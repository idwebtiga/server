const { getPagination, getPagingData } = require('../helpers/pagination');
const db = require('../models');
const moment = require('moment');
const config = require('../helpers/config');
const { mintCoin } = require('../helpers/web3');
// const Op = db.Sequelize.Op;
// const sequelize = require('sequelize');

const { TOPUP_MINIMUM, TOPUP_MAXIMUM, TOPUP_FEE } = config;

async function create(req, res) {
  try {
    let { amount, toAddress } = req.body;

    toAddress = toAddress.toLowerCase();
    amount = Number(amount);

    const userId = req.userId;

    const user = await db.users.findOne({ where: { id: userId } });
    if (user && user.walletAddress) {
      const walletAddress = user.walletAddress.toLowerCase();
      if (walletAddress !== toAddress) throw new Error('invalid toAddress');
    } else {
      throw new Error('user not found');
    }

    const pending = await db.topups.findOne({
      where: {
        userId,
        confirmed: false,
        cancelled: false,
      },
    });

    if (pending) throw new Error('there is pending topup');
    if (amount < TOPUP_MINIMUM || amount > TOPUP_MAXIMUM)
      throw new Error('invalid amount');
    const check = Math.floor(amount / 1000) * 1000;
    if (amount !== check)
      throw new Error('invalid amount: not multiplier of 1000');

    let goodUniqueCode = 0;

    for (let i = 0; i < 100; i++) {
      const uc = Math.floor(Math.random() * 998) + 1;
      const tm = await db.topups.findOne({
        where: {
          uniqueCode: check,
          confirmed: false,
          cancelled: false,
        },
      });
      if (!tm) {
        goodUniqueCode = uc;
        break;
      }
    }
    if (goodUniqueCode === 0) throw new Error('unique code not available');

    const total = amount + TOPUP_FEE + goodUniqueCode;

    const newObj = {
      userId,
      amount,
      fee: TOPUP_FEE,
      uniqueCode: goodUniqueCode,
      total,
      toAddress,
    };

    const topupId = await db.sequelize.transaction(async (t) => {
      const tu = await db.topups.create(newObj, { transaction: t });
      const invoiceId =
        'TUMN/' +
        moment().format('YY/MM/DD') +
        '/' +
        goodUniqueCode +
        '/' +
        tu.id;
      await db.topups.update(
        {
          invoiceId,
        },
        { where: { id: tu.id }, transaction: t },
      );
      return tu.id;
    });

    const resp = await db.topups.findOne({ where: { id: topupId } });
    return res.status(200).send(resp);
  } catch (err) {
    const errMsg = err.message || 'unknown error';
    return res.status(500).send({
      message: errMsg,
    });
  }
}

async function findMe(req, res) {
  try {
    const {
      page,
      size,
      // , from, to, sortby, sortdir, searchvalue
    } = req.query;
    const { limit } = getPagination(page, size);
    const userId = req.userId;
    const where = {
      userId,
    };
    const data = await db.topups.findAndCountAll({ where });
    const response = getPagingData(data, page, limit);
    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({
      message: err.message || 'unknown error',
    });
  }
}

async function cancel(req, res) {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const pending = await db.topups.findOne({
      where: {
        id: id,
        userId: userId,
        confirmed: false,
        minted: false,
      },
    });

    if (!pending) throw new Error('topup not found');

    await db.sequelize.transaction(async (t) => {
      await db.topups.update(
        {
          cancelled: true,
          cancelDate: moment().toDate(),
        },
        { where: { id: id }, transaction: t },
      );
    });

    const resp = await db.topups.findOne({ where: { id } });
    return res.status(200).send(resp);
  } catch (err) {
    const errMsg = err.message || 'unknown error';
    return res.status(500).send({
      message: errMsg,
    });
  }
}

async function findAll(req, res) {
  try {
    const {
      page,
      size,
      // , from, to, sortby, sortdir, searchvalue
    } = req.query;
    const { limit } = getPagination(page, size);
    // const userId = req.userId;

    const where = {};
    const data = await db.topups.findAndCountAll({ where });
    const response = getPagingData(data, page, limit);
    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({
      message: err.message || 'unknown error',
    });
  }
}

async function approve(req, res) {
  try {
    const { id } = req.params;

    let { approve } = req.body;

    const userId = req.userId;
    if (userId !== 1) throw new Error('not admin');
    if (!(approve === true)) throw new Error('approve not true');

    const pending = await db.topups.findOne({
      where: {
        id: id,
        confirmed: false,
        cancelled: false,
      },
    });

    if (!pending) throw new Error('pending topup not found');

    await db.sequelize.transaction(async (t) => {
      await db.topups.update(
        {
          confirmed: true,
          confirmDate: moment().toDate(),
        },
        { where: { id: id }, transaction: t },
      );
    });

    const resp = await db.topups.findOne({ where: { id } });
    return res.status(200).send(resp);
  } catch (err) {
    const errMsg = err.message || 'unknown error';
    return res.status(500).send({
      message: errMsg,
    });
  }
}

async function mint(req, res) {
  try {
    const { id } = req.params;

    let { mint, force } = req.body;

    const userId = req.userId;
    if (userId !== 1) throw new Error('not admin');
    if (!(mint === true)) throw new Error('approve not true');

    let where = {
      id,
      confirmed: true,
      minted: false,
    };

    if (force === true) {
      where = { id, confirmed: true };
    }

    const pending = await db.topups.findOne({
      where,
    });

    if (!pending) throw new Error('confirmed topup not found');

    const tx = await mintCoin(pending.toAddress, pending.amount + '');
    await db.sequelize.transaction(async (t) => {
      await db.topups.update(
        {
          txHash: tx.txHash,
          errMsg: tx.errMsg,
          minted: true,
          mintDate: moment().toDate(),
        },
        { where: { id: id }, transaction: t },
      );
    });

    const resp = await db.topups.findOne({ where: { id } });
    return res.status(200).send(resp);
  } catch (err) {
    const errMsg = err.message || 'unknown error';
    return res.status(500).send({
      message: errMsg,
    });
  }
}

module.exports = {
  create,
  findMe,
  cancel,
  findAll,
  approve,
  mint,
};
