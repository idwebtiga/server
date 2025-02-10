const { getPagination, getPagingData } = require('../helpers/pagination');
const db = require('../models');
const moment = require('moment');
const web3 = require('../helpers/web3');

async function buyToken(req, res) {
  try {
    let { amountCoin, resultMinimum, fee, nonce, signature, signer } = req.body;

    signer = signer.toLowerCase();
    const payload = { amountCoin, resultMinimum, fee, nonce, signature, signer };

    const userId = req.userId;
    const user = await db.users.findOne({ where: { id: userId } });
    if (user && user.walletAddress) {
      const walletAddress = user.walletAddress.toLowerCase();
      if (walletAddress !== signer.toLowerCase()) throw new Error('invalid siner');
    } else {
      throw new Error('user not found');
    }

    const prevTx = await db.transactions.findOne({
      where: {
        userId,
        nonce
      },
    });

    if (prevTx) throw new Error('invalid nonce');

    const newObj = {
      userId,
      nonce,
      name: 'buyToken',
      payload,
      signer,
      signature,
      // mintDate,
      // minted,
      // txHash,
      // errMsg
    };

    const tx = await db.transactions.create(newObj);
    const result = await web3.buyToken(payload);
    await db.transactions.update({
      txHash: result.txHash,
      errMsg: result.errMsg,
      minted: true,
      mintDate: moment().toDate()
    }, { where: { id: tx.id } });

    const resp = await db.transactions.findOne({ where: { id: tx.id } });
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
    let { amountToken, resultMinimum, fee, nonce, signature, signer } = req.body;

    signer = signer.toLowerCase();
    const payload = { amountToken, resultMinimum, fee, nonce, signature, signer };

    const userId = req.userId;
    const user = await db.users.findOne({ where: { id: userId } });
    if (user && user.walletAddress) {
      const walletAddress = user.walletAddress.toLowerCase();
      if (walletAddress !== signer.toLowerCase()) throw new Error('invalid siner');
    } else {
      throw new Error('user not found');
    }

    const prevTx = await db.transactions.findOne({
      where: {
        userId,
        nonce
      },
    });

    if (prevTx) throw new Error('invalid nonce');

    const newObj = {
      userId,
      nonce,
      name: 'sellToken',
      payload,
      signer,
      signature
    };

    const tx = await db.transactions.create(newObj);
    const result = await web3.sellToken(payload);
    await db.transactions.update({
      txHash: result.txHash,
      errMsg: result.errMsg,
      minted: true,
      mintDate: moment().toDate()
    }, { where: { id: tx.id } });

    const resp = await db.transactions.findOne({ where: { id: tx.id } });
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
  sellToken
};
