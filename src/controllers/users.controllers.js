// const { getPagination, getPagingData } = require('../helpers/pagination');
const { generateToken } = require('../helpers/auth');
const db = require('../models');
// const Op = db.Sequelize.Op;
// const sequelize = require('sequelize');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const siwe = require('siwe');
const { SiweMessage } = siwe;

async function createUser(userName, password) {
  const hash = await bcrypt.hash(password, saltRounds);
  return await db.users.create({ userName, password: hash });
}

async function updateUserPassword(userId, password) {
  const hash = await bcrypt.hash(password, saltRounds);
  return await db.users.update({ password: hash }, { where: { id: userId } });
}

async function setAdminPassword(password) {
  const check = await db.users.findOne({ where: { userName: 'admin' } });
  if (!check) return await createUser('admin', password);
  return await updateUserPassword(check.id, password);
}

async function auth(req, res) {
  try {
    let { userName, password } = req.body;

    const user = await db.users.findOne({ where: { userName } });
    if (user && user.password) {
      const valid = await bcrypt.compare(password, user.password);
      if (valid) {
        const access_token = generateToken(user.id);
        return res.status(200).send({ access_token });
      }
    }

    throw new Error('access denied');
  } catch (err) {
    const errMsg = err.message || 'unknown error';
    return res.status(500).send({
      message: errMsg,
    });
  }
}

async function profile(req, res) {
  try {
    const userId = req.userId;
    const data = await db.users.findOne({ where: { id: userId } });
    const resp = JSON.parse(JSON.stringify(data));
    if (resp.password) delete resp.password;
    return res.status(200).send(resp);
  } catch (err) {
    return res.status(500).send({
      message: err.message || 'unknown error',
    });
  }
}

async function authSiwe(req, res) {
  try {
    let { message, signature } = req.body;
    let siweMessage;
    try {
      console.log('new siwe msg..');
      siweMessage = new SiweMessage(message);
      console.log('verify signature..');
      await siweMessage.verify({ signature });
    } catch (err2) {
      console.error(err2);
      throw new Error('invalid signature');
    }

    const walletAddress = siweMessage.address.toLowerCase();
    const nonce = siweMessage.nonce;

    console.log('siwe login:');
    console.log({ walletAddress, nonce });

    let user = await db.users.findOne({ where: { walletAddress } });
    if (!user) {
      user = await db.users.create({ userName: walletAddress, walletAddress });
    }

    const access_token = generateToken(user.id);
    return res.status(200).send({ access_token, user });
  } catch (err) {
    const errMsg = err.message || 'unknown error';
    return res.status(500).send({
      message: errMsg,
    });
  }
}

module.exports = {
  setAdminPassword,
  auth,
  profile,
  authSiwe,
};
