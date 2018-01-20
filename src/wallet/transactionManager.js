import {web3, chainId} from './web3Util'
import * as gnx from './gnxSmart'

function getBalanceEth(address) {
    return web3.eth.getBalance(address)
}

function getBalanceGnx(address) {
    return gnx.getBalance(address)
}

async function getGasPrics() {
    return await web3.eth.getGasPrice()
}

async function getGasLimit() {
    // const block = await web3.eth.getBlock('latest')
    // const txCount = block.transactions.length
    // const avgGas = block.gasUsed / txCount
    // const gasLimit = avgGas / 9 * 10
    // debugger
    // return gasLimit
}
export {
    getBalanceEth,
    getBalanceGnx,
    getGasLimit,
    getGasPrics
}