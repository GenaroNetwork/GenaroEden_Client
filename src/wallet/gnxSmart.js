import { web3, chainId, GNXAddr } from './web3Util'
const abi = require('./GNX.json').abi

async function getBalance(address) {

    var Contract = new web3.eth.Contract(abi, GNXAddr);
    if (web3.currentProvider.connected !== true) {
        console.log('not ready')
    } else {
        console.log('ready')
    }

    // total balance including POS
    const totalBalance = await new Promise((resolve, reject) => {
        Contract.methods.balanceOf(address).call(function (err, res) {
            if(err) {
                reject(err)
                return
            }
            resolve(res)
        })
    })

    return totalBalance
    // balance excluding POS
    //Contract.methods.spendableBalanceOf(address).call(function (err, res) { console.log(res) })
}

export {
    getBalance
}