import { web3, chainId, utils, GNXAddr } from './web3Util'
import * as gnx from './gnxSmart'
const fs = require('fs')
const path = require('path')
const os = require('os')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const keytar = require('keytar')
const Wallet = require('ethereumjs-wallet')
const hdkey = require('ethereumjs-wallet/hdkey')
const Tx = require('ethereumjs-tx')

const KEYCHAIN_WALLET = 'network.genaro.eden.wallet'
const GXN_RATE = 10 ** 9

var isFirstTime = false
const dbFolder = path.join(os.homedir(), ".eden")
if (!fs.existsSync(dbFolder)) {
    fs.mkdirSync(dbFolder)
    isFirstTime = true
}

const dbPath = path.join(dbFolder, "wallets.json")
const adapter = new FileSync(dbPath)
const db = low(adapter)

db.defaults({ wallet: [] }).write()

function generateWalletName() {
    const names = new Set()
    db.get('wallet').value().forEach(e => {
        names.add(e.name)
    })
    var i = 0
    while (true) {
        i++
        var tmpname = `Account ${i}`
        if (!names.has(tmpname)) {
            return tmpname
        }
    }
}
/*
  {
    name: 'wallet 1',
    created: 1321321,
    address: '009b5109f8f0ef4d360f10bd51358e76f042d1a1',
    source: 'imported' // derieved
  }
*/
function loadWallet() {
    return new Promise((resolve, reject) => {
        const wallets = db.get('wallet').cloneDeep().sortBy(item => -item.created).value()
        let count = wallets.length
        if (count === 0) {
            resolve([])
        } else {
            wallets.forEach(w => {
                keytar.getPassword(KEYCHAIN_WALLET, w.address).then(v3str => {
                    count--
                    w.v3 = JSON.parse(v3str)
                    w.address = w.v3.address
                    w.rawWallet = null
                    if (count === 0) {
                        resolve(wallets)
                    }
                }).catch(e => reject(e))
            })
        }
    })
}

function loadFirstWallet() {
    const wallets = db.get('wallet').cloneDeep().sortBy(item => item.created).value()
    if (wallets && wallets[0]) {
        return wallets[0]
    } else {
        return null
    }
}

function loadRawWallet(address, password) {
    return new Promise((resolve, reject) => {
        keytar.getPassword(KEYCHAIN_WALLET, address).then(v3str => {
            const w = Wallet.fromV3(v3str, password)
            resolve(w)
        }).catch(e => reject(e))
    })
}

async function validateWalletPassword(address, password) {
    return new Promise((resolve, reject) => {
        const w = loadRawWallet(address, password).then(() => {
            resolve(true)
        }).catch(e => {
            reject('incorrect password')
        })
    })
}

async function exportV3Json(address) {
    return await keytar.getPassword(KEYCHAIN_WALLET, address)
}

function saveWallet(wa, name, pass) {
    return new Promise((resolve, reject) => {
        const v3 = wa.toV3(pass)
        const address = v3.address

        const found = db.get('wallet').find({ address: address }).value()
        if (found) {
            reject({ message: `address ${address} already exists. Please delete it first.` })
            return
        }
        keytar.setPassword(KEYCHAIN_WALLET, v3.address, JSON.stringify(v3)).then(() => {
            db.get('wallet').push({
                name,
                created: Date.now(),
                address
            }).write()
            resolve()
        })
    })
}

function updateWalletPassword(wa, newPass) {
    return new Promise((resolve, reject) => {
        const v3 = wa.toV3(newPass)
        const address = v3.address

        const found = db.get('wallet').find({ address: address }).value()
        if (!found) {
            reject({ message: `address ${address} not found` })
            return
        }
        keytar.setPassword(KEYCHAIN_WALLET, v3.address, JSON.stringify(v3)).then(() => {
            resolve()
        })
    })
}

async function importFromV3Json(json, password, name) {
    if (!name) {
        name = generateWalletName()
    }
    const jsonv3 = JSON.parse(json)
    const w = Wallet.fromV3(json, password)
    await saveWallet(w, name, password)
}

function importFromMnemonic(mnemonic, password) {
    return new Promise((resolve, reject) => {
        // compatible with metamask/jaxx
        const bip39 = require('bip39')
        const seed = bip39.mnemonicToSeed(mnemonic)
        let wallet = hdkey.fromMasterSeed(seed).derivePath(`m/44'/60'/0'/0`).deriveChild(0).getWallet()

        //const ss = wallet.getAddress().toString()
        const ss2 = wallet.getAddress().toString('hex')
        saveWallet(wallet, generateWalletName(), password).then(() => resolve()).catch(e => reject(e))
    })
}

function importFromPrivateKey() {
    // TODO:
}

async function forgetWallet(address) {
    db.get('wallet').remove({ address }).write()
    await keytar.deletePassword(KEYCHAIN_WALLET, address)
}

async function changePassword(address, passoword, newPassword) {
    const w = await loadRawWallet(address, passoword)
    await updateWalletPassword(w, newPassword)
}

function initRawWallet(v3, pass) {
    return Wallet.fromV3(v3, pass)
}

async function generateSignedTx(myAddr, password, receiveAddr, amount, gas, gasLimit) {
    const myWallet = db.get('wallet').find({ address: myAddr }).value()
    if (myWallet) {
        const rawWallet = await loadRawWallet(myAddr, password)
        const prikBuf = rawWallet.getPrivateKey()
        const nonceval = await web3.eth.getTransactionCount(myAddr)

        if (web3.currentProvider.connected !== true) {
            throw ('web3 not ready')
        } else {
            console.log('ready')
        }

        const weiAmount = utils.toWei(amount, 'ether') // TODO: Please pass numbers as strings or BigNumber objects to avoid precision errors 
        // 1. make transaction data
        let txOptions = {
            gasPrice: web3.utils.toHex(parseInt(gas)),
            gasLimit: web3.utils.toHex(gasLimit),
            value: web3.utils.toHex(weiAmount),
            nonce: web3.utils.toHex(nonceval),
            from: myAddr,
            to: receiveAddr,
            chainId
        }

        var tx = new Tx(txOptions)
        // 2. sign transaction
        tx.sign(prikBuf)
        var serializedTx = tx.serialize()
        const rawTrans = '0x' + serializedTx.toString('hex')
        console.log(txOptions)
        return rawTrans

    } else {
        throw ('wallet not found')
    }
}

async function generateSignedGnxTx(myAddr, password, receiveAddr, amount, gas, gasLimit) {
    const myWallet = db.get('wallet').find({ address: myAddr }).value()
    if (myWallet) {
        const rawWallet = await loadRawWallet(myAddr, password)
        const prikBuf = rawWallet.getPrivateKey()
        const nonceval = await web3.eth.getTransactionCount(myAddr)

        if (web3.currentProvider.connected !== true) {
            throw ('web3 not ready')
        } else {
            console.log('ready')
        }

        // 1. make transaction data
        let txOptions = {
            gasPrice: web3.utils.toHex(parseInt(gas)),
            gasLimit: web3.utils.toHex(gasLimit),
            value: 0,
            nonce: web3.utils.toHex(nonceval),
            from: myAddr,
            to: GNXAddr,
            data: gnx.getTransferData(receiveAddr, amount * GXN_RATE),
            chainId
        }

        var tx = new Tx(txOptions)
        // 2. sign transaction
        tx.sign(prikBuf)
        var serializedTx = tx.serialize()
        const rawTrans = '0x' + serializedTx.toString('hex')
        return rawTrans

    } else {
        throw ('wallet not found')
    }
}

export default {
    loadWallet,
    importFromV3Json,
    importFromMnemonic,
    initRawWallet,
    generateSignedTx,
    generateSignedGnxTx,
    forgetWallet,
    changePassword,
    validateWalletPassword,
    exportV3Json,
    loadFirstWallet
}
