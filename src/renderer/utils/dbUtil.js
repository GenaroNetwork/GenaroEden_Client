const fs = require('fs');
const path = require('path')
const os = require('os')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const keytar = require('keytar')
const {
    encryptText2Json,
    decryptJson2Text
} = require('./encryptUtil')

var isFirstTime = false
const dbFolder = path.join(os.homedir(), ".eden")
if (!fs.existsSync(dbFolder)) {
    fs.mkdirSync(dbFolder)
    isFirstTime = true
}
const dbPath = path.join(os.homedir(), ".eden", "db.json")
const adapter = new FileSync(dbPath)
const db = low(adapter)

db.defaults({
    username: null,
    uploadSize: 0,
    tasks: [],
    encryptionKey: null
}).write()

const KEYCHAIN_LOGIN = 'network.genaro.eden.login';
const KEYCHAIN_ENCRYPTIONKEY = 'network.genaro.eden.encryptionkey';
const KEYCHAIN_WALLET = 'network.genaro.eden.wallet';

function addUploadSize(sizeByte) {
    db.set('uploadSize', getUploadSize() + sizeByte).write()
}

function getUploadSize() {
    return db.get('uploadSize').value()
}

import {
    taskListAppend,
    taskListClear,
    taskListGet,
    taskListList,
    taskListRemove,
    taskListUpdate
} from "./sqlite";
// instead history
/*
function taskListList({
    sort = item => -item.created,
} = {}) {
    return db.get("tasks")
        .sortBy(sort)
        .value();
}

function taskListAppend(commitTask) {
    db.get("tasks")
        .push(commitTask)
        .write();
}

function taskListGet(commitTask) {
    return db.get("tasks")
        .find(commitTask)
        .value();
}

function taskListUpdate(commitTask) {
    db.get("tasks")
        .find({
            taskId: commitTask.taskId
        })
        .assign(commitTask).write();
}

function taskListRemove(commitTask) {
    db.get("tasks")
        .remove(commitTask)
        .write();
}

function taskListClear() {
    db.set("tasks", [])
        .write();
}
*/

function saveCredentials(username, password) {
    db.set('username', username).write()
    // keytar.setPassword(KEYCHAIN_LOGIN, username, password).then(() => {
    //     console.log('Credentials saved to keychain')
    // })
}

function getCredentials() {
    return new Promise((resolve, reject) => {
        const account = db.get('username').value()
        if (account) {
            keytar.getPassword(KEYCHAIN_LOGIN, account).then((password) => {
                resolve({
                    account,
                    password
                })
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
    db
        .set('username', null)
        .set('encryptionKey', null)
        .set('tasks', [])
        .write();
    if (!account) return;
    keytar.deletePassword(KEYCHAIN_ENCRYPTIONKEY, account);
    return keytar.deletePassword(KEYCHAIN_LOGIN, account);
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
        if (ek) {
            resolve(decryptJson2Text(ek, password))
        } else {
            resolve(null)
        }
    })
}

export {
    addUploadSize,
    getUploadSize,
    isFirstTime,
    saveCredentials,
    getCredentials,
    deleteCredentials,
    saveEncryptionKey,
    getEncryptionKey,
    taskListGet,
    taskListAppend,
    taskListList,
    taskListRemove,
    taskListUpdate,
    taskListClear,
}