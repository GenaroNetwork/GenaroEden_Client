var fs = require('fs');
const path = require('path')
const os = require('os')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

var isFirstTime = false
const dbFolder = path.join(os.homedir(), ".eden")
if (!fs.existsSync(dbFolder)){
    fs.mkdirSync(dbFolder)
    isFirstTime = true
}
const dbPath = path.join(os.homedir(), ".eden", "db.json")
const adapter = new FileSync(dbPath)
const db = low(adapter)

db.defaults({ t_down_files: [], uploadSize: 0, history: [] }).write()

/* 插入数据 */
function save(tableName, data) {
    db.get(tableName).push(data).write()
}

/* 查询数据 */
function query(tableName, queryVal) {
    return db.get(tableName).filter(queryVal).value()
}

function addUploadSize(sizeByte) {
    db.set('uploadSize', getUploadSize() + sizeByte).write()
}

function getUploadSize() {
    return db.get('uploadSize').value()
}

function getHistory() {
    return db.get('history').sortBy('created').value()
}

function addHistory(data) {
    db.get('history').push(data).write()
}

function removeHistoryById(id) {
    db.get('history').remove({historyId: id}).write()
}

export default {
    save,
    query,
    addUploadSize,
    getUploadSize,
    isFirstTime,
    getHistory,
    addHistory,
    removeHistoryById
}