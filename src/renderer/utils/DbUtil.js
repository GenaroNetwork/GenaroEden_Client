const fs = require('fs');
const path = require('path')
const os = require('os')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const keytar = require('keytar')
const {encryptText2Json, decryptJson2Text} = require('./encryptUtil')

var isFirstTime = false
const dbFolder = path.join(os.homedir(), ".eden")
if (!fs.existsSync(dbFolder)){
    fs.mkdirSync(dbFolder)
    isFirstTime = true
}
const dbPath = path.join(os.homedir(), ".eden", "db.json")
const adapter = new FileSync(dbPath)
const db = low(adapter)

db.defaults({ username: null, uploadSize: 0, history: [], encryptionKey: null }).write()

const KEYCHAIN_LOGIN = 'network.genaro.eden.login'
const KEYCHAIN_ENCRYPTIONKEY = 'network.genaro.eden.encryptionkey'

function addUploadSize(sizeByte) {
    db.set('uploadSize', getUploadSize() + sizeByte).write()
}

function getUploadSize() {
    return db.get('uploadSize').value()
}

function getHistory() {
    return db.get('history').sortBy(item => -item.created).value()
}

function addHistory(data) {
    db.get('history').push(data).write()
}

function removeHistoryById(id) {
    db.get('history').remove({historyId: id}).write()
}

function saveCredentials(username, password) {
    db.set('username', username).write()
    // keytar.setPassword(KEYCHAIN_LOGIN, username, password).then(() => {
    //     console.log('Credentials saved to keychain')
    // })
}

function getCredentials() {
    return new Promise((resolve, reject) => {
        const account = db.get('username').value()
        if(account) {
            keytar.getPassword(KEYCHAIN_LOGIN, account).then((password) => {
                resolve({account, password})
            }).catch(() => {
                console.error('getCredentials from keyChain error!')
                resolve(null)
            })
        } else {
            resolve(null)
        }
    })
}

function deleteCredentials() {
    const account = db.get('username').value()
    db.set('username', null).set('encryptionKey', null).write()
    keytar.deletePassword(KEYCHAIN_ENCRYPTIONKEY, account)
    return keytar.deletePassword(KEYCHAIN_LOGIN, account)
}

function saveEncryptionKey(key, password) {
    return new Promise((resolve, reject) => {
        const cipheredKey = (encryptText2Json(key, password))
        db.set('encryptionKey', cipheredKey).write()
        resolve()
    })
}

function getEncryptionKey(password) {
    return new Promise((resolve, reject) => {
        const ek = db.get('encryptionKey').value()
        if(ek) {
            resolve( decryptJson2Text(ek, password) )
        } else {
            resolve(null)
        }
    })
}

export default {
    addUploadSize,
    getUploadSize,
    isFirstTime,
    getHistory,
    addHistory,
    removeHistoryById,
    saveCredentials,
    getCredentials,
    deleteCredentials,
    saveEncryptionKey,
    getEncryptionKey
}