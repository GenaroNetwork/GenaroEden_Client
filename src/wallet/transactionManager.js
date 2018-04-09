import { web3, chainId } from './web3Util'
import * as gnx from './gnxSmart'
const fs = require('fs')
const path = require('path')
const clone = require('clone')
const uuidV1 = require('uuid/v1')
const os = require('os')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

var isFirstTime = false
const dbFolder = path.join(os.homedir(), ".eden")
if (!fs.existsSync(dbFolder)) {
    fs.mkdirSync(dbFolder)
    isFirstTime = true
}

const dbPath = path.join(dbFolder, "transaction.json")
const adapter = new FileSync(dbPath)
const db = low(adapter)

db.defaults({ transaction: [] }).write()

const TXSTATE = Object.freeze({
    INIT: 1,
    INPROGRESS: 2,
    ERROR: 3,
    SUCCESS: 4
})

// logic begin:
function getTransactions() {
    return clone(db.get('transaction').sortBy(item => -item.created).value())
}

function addTransaction(data) {
    db.get('transaction').push(data).write()
}

function updateTransaction(transactionId, props) {
    db.get('transaction').find({ transactionId }).assign(props).write()
    return clone(db.get('transaction').find({ transactionId }).value())
}

function removeTransaction(id) { }


function getBalanceEth(address) {
    return web3.eth.getBalance(address)
}

function getBalanceGnx(address) {
    return gnx.getBalance(address)
}

// let GasPrice = 40
// function _getPrice() {
//     web3.eth.getGasPrice().then((p) => {
//         GasPrice = p
//     })
// }
// _getPrice()
// setInterval(_getPrice, 5000)
function getGasPrice() {
    return 3e9; // web3.eth.getGasPrice sometimes give very low value which will fail transaction. default to 40 now
}

async function getGasLimit() {
    // const block = await web3.eth.getBlock('latest')
    // const txCount = block.transactions.length
    // const avgGas = block.gasUsed / txCount
    // const gasLimit = avgGas / 9 * 10
    // debugger
    // return gasLimit
}

const RECEIPTSTATE = Object.freeze({
    NOTFOUND: 0,
    PENDING: 1,
    FAIL: 2,
    SUCCESS: 3
})


function sendTransactionNoLog(rawTx) {

    function checkTxByHash(hash) {
        return new Promise((resolve, reject) => {
            web3.eth.getTransactionReceipt(hash).then(receipt => {
                if (receipt) {
                    console.debug(receipt)
                    console.debug(receipt.status)
                    if (receipt.status === '0x0') { //fail
                        resolve(RECEIPTSTATE.FAIL)
                    } else {
                        resolve(RECEIPTSTATE.SUCCESS)
                    }
                } else {
                    resolve(RECEIPTSTATE.NOTFOUND)
                }
            }).catch(error => {
                console.error('checkTxByHash error')
            })
        })
    }

    function checkTxByHashNtimes(hash, checkCount, interval) {
        return new Promise((resolve, reject) => {
            const intv = setInterval(function () {
                console.debug('checkTxByHash checkCount: ' + checkCount)
                checkTxByHash(hash).then(state => {
                    checkCount--
                    console.debug('checkTxByHash checkCount: ' + checkCount + ' state: ' + state)
                    if (state === RECEIPTSTATE.NOTFOUND) {
                        if (checkCount === 0) {
                            clearInterval(intv)
                            resolve(RECEIPTSTATE.NOTFOUND)
                        }
                    } else if (state === RECEIPTSTATE.FAIL) {
                        clearInterval(intv)
                        resolve(RECEIPTSTATE.FAIL)
                    } else if (state === RECEIPTSTATE.SUCCESS) {
                        clearInterval(intv)
                        resolve(RECEIPTSTATE.SUCCESS)
                    }
                })
            }, interval)
        })
    }

    return new Promise((resolve, reject) => {
        let thisHash
        web3.eth.sendSignedTransaction(rawTx).once('transactionHash', function (hash) {
            // log hash here
            console.debug('transactionHash' + hash)
            thisHash = hash
        }).once('error', async (error) => {
            console.debug('sendSignedTransaction error: ' + error)
            if (thisHash) {
                // recheck hash several times: 5 times, each 20 seconds
                const state = await checkTxByHashNtimes(thisHash, 15, 20000)
                if (state === RECEIPTSTATE.NOTFOUND) {
                    reject('receipt not found: ' + thisHash)
                } else if (state === RECEIPTSTATE.FAIL) {
                    reject('receipt found but failed')
                } else if (state === RECEIPTSTATE.SUCCESS) {
                    resolve('receipt found and success')
                }
            } else {
                reject('no hash received for transaction')
            }
        }).then(async (receipt) => {
            console.debug('sendSignedTransaction receipt: ' + receipt)
            const result = await checkTxByHash(thisHash)
            if (result === RECEIPTSTATE.SUCCESS) {
                resolve('receipt found and success')
            } else {
                reject('receipt found but failed')
            }
        }).catch(function (error) {
            console.error(error)
        })
    })
}

function sendTransaction(payOption, rawTx, txUpdateCb) {
    const txHistory = clone(payOption)
    txHistory.created = Date.now()
    txHistory.transactionId = uuidV1()
    txHistory.state = TXSTATE.INIT
    txHistory.message = ''
    txHistory.hash = null
    txHistory.error = null
    txHistory.receipt = null
    addTransaction(txHistory)
    // good: hash => confirmation => receipt got => receipt mined
    // bad: error
    // bad2: hash => error
    web3.eth.sendSignedTransaction(rawTx).once('transactionHash', function (hash) {
        console.log('1 hash: ' + hash)
        //var receipt = web3.eth.getTransactionReceipt(hash).then(console.log)
        const tx = updateTransaction(txHistory.transactionId, { hash, state: TXSTATE.INPROGRESS })
        txUpdateCb(tx)
    }).on('error', function (error) {
        console.log('5 error: ' + error)
        const tx = updateTransaction(txHistory.transactionId, { error, state: TXSTATE.ERROR })
        txUpdateCb(tx)
    }).then(function (receipt) {
        // will be fired once the receipt its mined
        console.log('6 receipt mined: ')
        console.log(receipt)
        const tx = updateTransaction(txHistory.transactionId, { receipt, state: TXSTATE.SUCCESS })
        txUpdateCb(tx)
    })
}
export {
    getBalanceEth,
    getBalanceGnx,
    getGasLimit,
    getGasPrice,
    sendTransaction,
    sendTransactionNoLog,
    getTransactions,
    addTransaction,
    updateTransaction,
    TXSTATE
}