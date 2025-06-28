const ethersv6 = require('ethers');
const daoabi = require('./abi/DAO.json').abi;
const zilabi = require('./abi/ZILNFT.json').abi;
const coinabi = require('./abi/Coin.json').abi;
const tokenabi = require('./abi/Token.json').abi;
// const configabi = require('./abi/Config.json').abi;
const delegatorabi = require('./abi/Delegator.json').abi;
const { Contract, ethers, parseEther } = ethersv6;

const CONFIG = {
  deployer: '0x8AdF8d3DB777c4d69728F34B8B581Cb862CEc6D5',
  configAddress: '0xd4C48B845e3b4FC8E46dAe83dD5B6ef5BDCc9701',
  daoAddress: '0x74Ca300E3D8059A5bA7e5468c5B612d0C37a44C0',
  zilAddress: '0xBb9C6492e86f06dd4E21ec6023D261bB7A5CaC72',
  coinAddress: '0x0031a43E49ebf45A19610985d9063a45CF711988',
  tokenAddress: '0xE648371936c0Ff823c15C7De65d9Be06431C1440',
  delegatorAddress: '0x76a2870E1B393a74e05191C99d27a9deB41BBF14',
  rpcUrl: 'https://evmtestnet.confluxrpc.com',
  chainId: 71,
  gasSymbol: 'ETH',
};

const PRIVATE_KEY = process.env.PRIVATE_KEY;

function getContracts() {
  const provider = new ethers.JsonRpcProvider(CONFIG.rpcUrl);
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);
  const coin = new Contract(CONFIG.coinAddress, coinabi, signer);
  const token = new Contract(CONFIG.tokenAddress, tokenabi, signer);
  const dao = new Contract(CONFIG.daoAddress, daoabi, signer);
  const zil = new Contract(CONFIG.zilAddress, zilabi, signer);
  const delegator = new Contract(CONFIG.delegatorAddress, delegatorabi, signer);
  const ret = {
    provider,
    signer,
    coin,
    token,
    dao,
    zil,
    delegator,
  };
  return ret;
}

async function mintCoin(toAddress, amount) {
  console.log('mintCoin');
  const { coin } = getContracts();
  const amountWei = parseEther(amount + '');
  const ret = {};
  try {
    const tx = await coin.mint(toAddress, amountWei);
    const txHash = tx.hash;
    ret.txHash = txHash;
    // const receipt = await tx.wait(1);
    // console.log({ receipt });
  } catch (err) {
    console.error(err);
    const errMsg = err && err.message ? err.message : JSON.stringify(err);
    ret.errMsg = errMsg;
  }
  console.log(ret);
  return ret;
}

async function buyToken(args) {
  console.log('buyToken');
  const { amountCoin, resultMinimum, fee, nonce, signature, signer } = args;
  const { delegator } = getContracts();
  const ret = {};
  try {
    const tx = await delegator.BuyToken(
      amountCoin,
      resultMinimum,
      fee,
      nonce,
      signature,
      signer,
    );
    const txHash = tx.hash;
    ret.txHash = txHash;
  } catch (err) {
    console.error(err);
    const errMsg = err && err.message ? err.message : JSON.stringify(err);
    ret.errMsg = errMsg;
  }
  console.log(ret);
  return ret;
}

async function sellToken(args) {
  console.log('sellToken');
  const { amountToken, resultMinimum, fee, nonce, signature, signer } = args;
  const { delegator } = getContracts();
  const ret = {};
  try {
    const tx = await delegator.SellToken(
      amountToken,
      resultMinimum,
      fee,
      nonce,
      signature,
      signer,
    );
    const txHash = tx.hash;
    ret.txHash = txHash;
  } catch (err) {
    console.error(err);
    const errMsg = err && err.message ? err.message : JSON.stringify(err);
    ret.errMsg = errMsg;
  }
  console.log(ret);
  return ret;
}

async function takeLoan(args) {
  console.log('takeLoan');
  const { amountToken, fee, nonce, signature, signer } = args;
  const { delegator } = getContracts();
  const ret = {};
  try {
    const tx = await delegator.TakeLoan(
      amountToken,
      fee,
      nonce,
      signature,
      signer,
    );
    const txHash = tx.hash;
    ret.txHash = txHash;
  } catch (err) {
    console.error(err);
    const errMsg = err && err.message ? err.message : JSON.stringify(err);
    ret.errMsg = errMsg;
  }
  console.log(ret);
  return ret;
}

async function payLoan(args) {
  console.log('payLoan');
  const { nftId, amountCoin, fee, nonce, signature, signer } = args;
  const { delegator } = getContracts();
  const ret = {};
  try {
    const tx = await delegator.PayLoan(
      nftId,
      amountCoin,
      fee,
      nonce,
      signature,
      signer,
    );
    const txHash = tx.hash;
    ret.txHash = txHash;
  } catch (err) {
    console.error(err);
    const errMsg = err && err.message ? err.message : JSON.stringify(err);
    ret.errMsg = errMsg;
  }
  console.log(ret);
  return ret;
}

async function payWithNotes(args) {
  console.log('payWithNotes');
  const { toAddress, notes, amountCoin, fee, nonce, signature, signer } = args;
  const { delegator } = getContracts();
  const ret = {};
  try {
    console.log('staticCall check:');

    await delegator.PayWithNotes.staticCall(
      toAddress, notes, amountCoin, fee, nonce, signature, signer
    );

    console.log('staticCall passed');

    const tx = await delegator.PayWithNotes(
      toAddress, notes, amountCoin, fee, nonce, signature, signer
    );
    const txHash = tx.hash;
    ret.txHash = txHash;
  } catch (err) {
    console.error(err);
    const errMsg = err && err.message ? err.message : JSON.stringify(err);
    ret.errMsg = errMsg;
  }
  console.log(ret);
  return ret;
}

module.exports = {
  mintCoin,
  buyToken,
  sellToken,
  takeLoan,
  payLoan,
  payWithNotes
};
