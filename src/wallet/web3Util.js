const Web3 = require("web3")
const isDev = process.env.NODE_ENV === 'development'

let web3Provider, chainId, web3Instance, GNXAddr

if(isDev) {
    web3Provider = 'https://ropsten.infura.io/wYBhtj2SSUB7qlztqEjx'
    web3Instance = new Web3(new Web3.providers.HttpProvider(web3Provider))
    chainId = 3
    GNXAddr = "0x1F84118c3B0f3f97c63B8e125456d76C78baBed5" //ropsten
} else {

    GNXAddr = "0x6cd6104d8bb94a08e0c5ce2486192894c34ee317" //mainnet
}



const utils = Web3.utils
export {
    utils,
    web3Instance as web3,
    chainId,
    GNXAddr
}