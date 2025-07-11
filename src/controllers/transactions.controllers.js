// const { getPagination, getPagingData } = require('../helpers/pagination');
const db = require('../models');
const moment = require('moment');
const web3 = require('../helpers/web3');
const config = require('../helpers/config');

const { ADMIN_ADDRESS } = config;

async function validateParams(userId, signer, signature) {
  const user = await db.users.findOne({ where: { id: userId } });
  if (user && user.walletAddress) {
    const walletAddress = user.walletAddress.toLowerCase();
    if (walletAddress !== signer.toLowerCase())
      throw new Error('invalid siner');
  } else {
    throw new Error('user not found');
  }

  const check = await db.transactions.findOne({
    where: {
      signer,
      signature
    },
  });

  if (check && check.txHash && check.txHash.length > 0)
    throw new Error('transaction in db');
}

async function processTransaction(userId, nonce, name, payload, signer, signature, txHash, errMsg) {
  const newObj = {
    userId,
    nonce,
    name,
    payload,
    signer,
    signature,
    txHash,
    errMsg,
    processed: true,
    processDate: moment().toDate()
  };

  return await db.transactions.create(newObj);
}

async function buyToken(req, res) {
  try {
    let { amountCoin, resultMinimum, fee, nonce, signature, signer } = req.body;

    signer = signer.toLowerCase();
    const payload = {
      amountCoin,
      resultMinimum,
      fee,
      nonce,
      signature,
      signer,
    };

    const userId = req.userId;
    await validateParams(userId, signer, signature);
    const result = await web3.buyToken(payload);
    const resp = await processTransaction(userId, nonce, 'buyToken',
      payload, signer, signature, result.txHash, result.errMsg);
    return res.status(200).send(resp);
  } catch (err) {
    const errMsg = err.message || 'unknown error';
    return res.status(500).send({
      message: errMsg,
    });
  }
}

async function sellToken(req, res) {
  try {
    let { amountToken, resultMinimum, fee, nonce, signature, signer } =
      req.body;

    signer = signer.toLowerCase();
    const payload = {
      amountToken,
      resultMinimum,
      fee,
      nonce,
      signature,
      signer,
    };

    const userId = req.userId;
    await validateParams(userId, signer, signature);
    const result = await web3.sellToken(payload);
    const resp = await processTransaction(userId, nonce, 'sellToken',
      payload, signer, signature, result.txHash, result.errMsg);
    return res.status(200).send(resp);
  } catch (err) {
    const errMsg = err.message || 'unknown error';
    return res.status(500).send({
      message: errMsg,
    });
  }
}

async function takeLoan(req, res) {
  try {
    let { amountToken, fee, nonce, signature, signer } =
      req.body;

    signer = signer.toLowerCase();
    const payload = {
      amountToken, fee, nonce, signature, signer
    };

    const userId = req.userId;
    await validateParams(userId, signer, signature);

    const result = await web3.takeLoan(payload);
    const resp = await processTransaction(userId, nonce, 'takeLoan',
      payload, signer, signature, result.txHash, result.errMsg);
    return res.status(200).send(resp);
  } catch (err) {
    const errMsg = err.message || 'unknown error';
    return res.status(500).send({
      message: errMsg,
    });
  }
}

async function payLoan(req, res) {
  try {
    let { nftId, amountCoin, fee, nonce, signature, signer } =
      req.body;

    signer = signer.toLowerCase();
    const payload = {
      nftId, amountCoin, fee, nonce, signature, signer
    };

    const userId = req.userId;
    await validateParams(userId, signer, signature);

    const result = await web3.payLoan(payload);
    const resp = await processTransaction(userId, nonce, 'payLoan',
      payload, signer, signature, result.txHash, result.errMsg);
    return res.status(200).send(resp);
  } catch (err) {
    const errMsg = err.message || 'unknown error';
    return res.status(500).send({
      message: errMsg,
    });
  }
}

async function payWithNotes(req, res) {
  try {
    const userId = req.userId;
    let { toAddress, notes, amountCoin, fee, nonce, signature, signer } = req.body;
    const requestId = notes;

    toAddress = toAddress.toLowerCase();
    if (toAddress !== ADMIN_ADDRESS.toLowerCase()) throw new Error('invalid toAddress');

    signer = signer.toLowerCase();
    const payload = {
      toAddress, notes, amountCoin, fee, nonce, signature, signer
    };

    const check = await db.payments.findOne({
      where: { requestId, userId, fromAddress: signer, transfered: false }
    });

    if (!check) throw new Error('payment not found');

    const amountAsked = check.amount + '000000000000000000';
    if (amountCoin !== amountAsked) throw new Error('invalid amountCoin');

    await validateParams(userId, signer, signature);
    const result = await web3.payWithNotes(payload);

    const resp = await processTransaction(userId, nonce, 'payWithNotes',
      payload, signer, signature, result.txHash, result.errMsg);

    await db.payments.update({
      transfer: true,
      transferDate: moment().toDate(),
      txHash: result.txHash,
      errMsg: result.errMsg
    }, { where: { requestId } });

    const respPayment = await db.payments.findOne({ where: { requestId } });
    resp.payment = respPayment;

    return res.status(200).send(resp);
  } catch (err) {
    const errMsg = err.message || 'unknown error';
    return res.status(500).send({
      message: errMsg,
    });
  }
}

module.exports = {
  buyToken,
  sellToken,
  takeLoan,
  payLoan,
  payWithNotes
};
