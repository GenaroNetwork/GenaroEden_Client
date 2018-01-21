import {web3, chainId} from './web3Util'
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
if (!fs.existsSync(dbFolder)){
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
    return db.get('transaction').sortBy(item => -item.created).value()
}

function addTransaction(data) {
    db.get('transaction').push(data).write()
}

function removeTransaction(id) {
    
}


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

function sendTransaction(payOption, rawTx) {
    const txHistory = clone(payOption)
    txHistory.created = Date.now()
    txHistory.transactionId = uuidV1()
    txHistory.state = TXSTATE.INIT
    txHistory.message = ''
    addTransaction(txHistory)
    web3.eth.sendSignedTransaction(rawTx).once('transactionHash', function(hash){ 
        console.log('1 hash: '+hash)
        //var receipt = web3.eth.getTransactionReceipt(hash).then(console.log)
    }).once('receipt', function(receipt){
        
        console.log('2 receipt got: ')
        console.log(receipt)
    }).on('confirmation', function(confNumber, receipt){
        
        console.log('3 confNumber: '+confNumber)
        console.log(receipt)
    }).on('error', function(error){ 
        
        console.log('5 error: '+error)
    }).then(function(receipt){
        // will be fired once the receipt its mined
        console.log('6 receipt mined: ')
        console.log(receipt)
    })
}
export {
    getBalanceEth,
    getBalanceGnx,
    getGasLimit,
    getGasPrics,
    sendTransaction
}