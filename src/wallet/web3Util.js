const Web3 = require("web3");
const isDev = process.env.NODE_ENV === 'development';
const utils = Web3.utils;

let web3Provider, chainId, web3Instance, GNXAddr, EtherscanURL, EMUAddr;

if (isDev) {
    web3Provider = 'https://ropsten.infura.io/CPKlwMsRTFVy6idI23Yb';
    chainId = 3;
    GNXAddr = "0x1F84118c3B0f3f97c63B8e125456d76C78baBed5" //ropsten;
    EtherscanURL = 'https://ropsten.etherscan.io/tx/';
    EMUAddr = "0xd0c419feC9541d23176A48648d3473d7E5185f70"
} else {
    web3Provider = 'https://mainnet.infura.io/CPKlwMsRTFVy6idI23Yb';
    chainId = 0;
    GNXAddr = "0x6ec8a24cabdc339a06a172f8223ea557055adaa5";
    EtherscanURL = 'https://etherscan.io/tx/';
    EMUAddr = "0x279022fcaac7aeb29cab86b215da670b7ec2c98a"
}
web3Instance = new Web3(new Web3.providers.HttpProvider(web3Provider));


export {
    utils,
    web3Instance as web3,
    chainId,
    GNXAddr,
    EMUAddr,
    EtherscanURL
}