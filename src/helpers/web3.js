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
    configAddress: '0x52A1476eC247d9fED7E25f64Ac1e7F13582817C5',
    daoAddress: '0x49498c6c32424F272586ceD1F0Cd6898729A7c14',
    zilAddress: '0xee282946E4A04122a5aA2342f837f5B330EFD971',
    coinAddress: '0x97e479a958A7439Cfebe1962b314110CEFE8D556',
    tokenAddress: '0xb503eB26aD5931F77eE6cc0ca3aEaD1d9c439482',
    delegatorAddress: '0x0711aa52a48a595f2527728C641cca5334B3904C',
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
    const ret = {}
    try {
        const tx = await delegator.BuyToken(
            amountCoin,
            resultMinimum,
            fee,
            nonce,
            signature,
            signer
        )
        const txHash = tx.hash;
        ret.txHash = txHash;
    } catch (err) {
        console.error(err);
        const errMsg = err && err.message ? err.message : JSON.stringify(err);
        ret.errMsg = errMsg
    }
    console.log(ret);
    return ret;
}

async function sellToken(args) {
    console.log('sellToken');
    const { amountToken, resultMinimum, fee, nonce, signature, signer } = args;
    const { delegator } = getContracts();
    const ret = {}
    try {
        console.log(dto);
        const tx = await delegator.SellToken(
            amountToken,
            resultMinimum,
            fee,
            nonce,
            signature,
            signer
        )
        const txHash = tx.hash;
        ret.txHash = txHash;
    } catch (err) {
        console.error(err);
        const errMsg = err && err.message ? err.message : JSON.stringify(err);
        ret.errMsg = errMsg
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
            signer
        )
        const txHash = tx.hash;
        ret.txHash = txHash;
    } catch (err) {
        console.error(err);
        const errMsg = err && err.message ? err.message : JSON.stringify(err);
        ret.errMsg = errMsg
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
            signer
        )
        const txHash = tx.hash;
        ret.txHash = txHash;
    } catch (err) {
        console.error(err);
        const errMsg = err && err.message ? err.message : JSON.stringify(err);
        ret.errMsg = errMsg
    }
    console.log(ret);
    return ret;
}

module.exports = {
    mintCoin,
    buyToken,
    sellToken,
    takeLoan,
    payLoan
};
