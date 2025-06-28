const { getPagination, getPagingData } = require('../helpers/pagination');
const db = require('../models');
const moment = require('moment');
const config = require('../helpers/config');
const { validatePhoneNumber } = require('../helpers/utils');
// const Op = db.Sequelize.Op;
// const sequelize = require('sequelize');

// const { PAYMENT_FEE } = config;

// userId: {
// requestId: {
// nameItem: {
// amountCoin: {
// transferDate: {
// transfered: {
// fromAddress: {
// txHash: {
// errMsg: {

const ITEMS = [
  { itemId: 1, nameItem: 'Saldo GOPAY 50.000', amount: 52000 },
  { itemId: 2, nameItem: 'Saldo GOPAY 100.000', amount: 102000 },
  { itemId: 3, nameItem: 'Saldo OVO 50.000', amount: 52000 },
  { itemId: 4, nameItem: 'Saldo OVO 100.000', amount: 102000 }
]

async function findItems(req, res) {
  try {
    console.log('findItems !!');
    const response = { items: ITEMS };
    console.log(response);
    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({
      message: err.message || 'unknown error',
    });
  }
}

async function create(req, res) {
  try {
    let { receiver, itemId, fromAddress } = req.body;

    // validate receiver as phoneNum
    if (!validatePhoneNumber(receiver)) throw new Error('Nomor penerima tidak tepat.')
    fromAddress = fromAddress.toLowerCase();
    itemId = Number(itemId);

    let item = false;
    for (let i = 0; i < ITEMS.length; i++) {
      const ii = ITEMS[i];
      if (ii.itemId === itemId) {
        item = ii;
        break;
      }
    }

    if (!item) throw new Error('invalid itemId');

    const userId = req.userId;
    const user = await db.users.findOne({ where: { id: userId } });
    if (user && user.walletAddress) {
      const walletAddress = user.walletAddress.toLowerCase();
      if (walletAddress !== fromAddress) throw new Error('invalid fromAddress');
    } else {
      throw new Error('user not found');
    }

    const newObj = {
      userId,
      nameItem: item.nameItem,
      amount: item.amount,
      receiver,
      fromAddress,
    };

    const paymentId = await db.sequelize.transaction(async (t) => {
      const pay = await db.payments.create(newObj, { transaction: t });
      const requestId =
        'PAY/' +
        moment().format('YY/MM/DD') +
        '/' +
        userId +
        '/' +
        pay.id;

      await db.payments.update(
        {
          requestId,
        },
        { where: { id: pay.id }, transaction: t },
      );
      return pay.id;
    });

    const resp = await db.payments.findOne({ where: { id: paymentId } });
    return res.status(200).send(resp);
  } catch (err) {
    console.error(err);
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
      sortby,
      sortdir
      // , from, to, sortby, sortdir, searchvalue
    } = req.query;
    const { limit } = getPagination(page, size);
    let order = [['createdAt', 'DESC']];
    if ((sortby !== undefined) || (sortdir !== undefined)) {

      let sortcolumn = 'createdAt';
      if (sortby) sortcolumn = sortby;

      let dir = "DESC";
      if (typeof sortdir !== 'undefined') {
        if (sortdir.toLowerCase() == 'asc') {
          dir = "ASC";
        }
      }

      order = [[sortcolumn, dir]];
      if (sortcolumn.indexOf('.') >= 0) {
        const arr = sortby.split('.');
        arr.push(dir);
        order = [arr];
      }
    }

    const userId = req.userId;
    const where = {
      userId,
    };
    const data = await db.payments.findAndCountAll({ where, order });
    const response = getPagingData(data, page, limit);
    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({
      message: err.message || 'unknown error',
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
    const data = await db.payments.findAndCountAll({ where });
    const response = getPagingData(data, page, limit);
    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({
      message: err.message || 'unknown error',
    });
  }
}

module.exports = {
  findItems,
  create,
  findMe,
  findAll
};
