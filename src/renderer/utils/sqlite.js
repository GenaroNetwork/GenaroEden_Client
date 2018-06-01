const SQLITE3 = require("better-sqlite3")
const PATH = require("path");
const OS = require("os");
import {
    TASK_TYPE
} from "../../config";

const addr2hash = add => {
    if (add.length === 40) return add;
    if (add.length === 42 && add.startsWith("0x")) return add.substr(2);
    throw new Error("Invalide Address");
};

const hash2addr = hash => {
    if (hash.length === 40) return `0x${hash}`;
    if (hash.length === 42 && hash.startsWith("0x")) return hash;
    throw new Error("Invalide Address");
};

const task2db = task => {
    let names = ["taskId", "bucketId", "created", "updated", "errorMessage", "fileId", "fileName", "filePath", "folderName", "progress", "state", "taskState", "taskType", "completedBytes", "totalBytes"];
    let db = Object.assign({}, task);
    db.state = JSON.stringify(db.state);
    for (let name in db) {
        if (names.indexOf(name) === -1) delete db[name];
    }
    if (db.taskType === TASK_TYPE.DOWNLOAD && db.downloadedBytes > -1) {
        db.completedBytes = db.downloadedBytes;
        delete db.downloadedBytes;
    }
    if (db.taskType === TASK_TYPE.UPLOAD && db.uploadedBytes > -1) {
        db.completedBytes = db.uploadedBytes;
        delete db.uploadedBytes;
    }
    return db;
};

const db2task = db => {
    let task = Object.assign({}, db);
    task.state = JSON.parse(task.state);
    if (task.taskType === TASK_TYPE.DOWNLOAD && task.completedBytes > -1) {
        task.downloadedBytes = task.completedBytes;
        delete task.completedBytes;
    }
    if (task.taskType === TASK_TYPE.UPLOAD && task.completedBytes > -1) {
        task.uploadedBytes = task.completedBytes;
        delete task.completedBytes;
    }
    return task;
}

const DB = new SQLITE3(PATH.join(OS.homedir(), ".eden", "database.sqlite"));

const getTransactions = (transactionId = null) => {
    let condition = transactionId ? `WHERE transactionId = '${transactionId}'` : "";
    let results = DB.prepare(`SELECT * FROM transactions ${condition}`).all();
    return results.map(result => {
        result.from = result.addrFrom;
        delete result.addrFrom;
        result.receipt = JSON.parse(result.chainDetail);
        delete result.chainDetail;
        result.recipient = result.addrTo;
        delete result.addrTo;
        return result;
    });
};

const addTransaction = data => {
    let addrFrom = addr2hash(data.from);
    let addrTo = addr2hash(data.recipient);
    let chainDetail = JSON.stringify(data.receipt);

    let result = DB.prepare(`INSERT INTO transactions 
    (amount, created, error, addrFrom, gasLimit, gasPrice, hash, message, payType, chainDetail, addrTo, state, transactionId)
    VALUES
    ('${data.amount}', ${data.created}, '${data.error}', '${addrFrom}', ${data.gasLimit},
    ${data.gasPrice}, '${data.hash}', '${data.message}', '${data.payType}', '${chainDetail}',
    '${addrTo}', '${data.state}', '${data.transactionId}')`).run();
};

const updateTransaction = (transactionId, props) => {
    let sqlarr = [];
    const NOT_TEXT_KEY = ["amount", "gasPrice", "gasLimit", "created", "state"];

    let addrFrom, addrTo, chainDetail;
    if (props.from) addrFrom = addr2hash(props.from);
    if (props.recipient) addrTo = addr2hash(props.recipient);
    if (props.receipt) {
        chainDetail = JSON.stringify(props.receipt);
    }

    for (let name in props) {
        if (NOT_TEXT_KEY.indexOf(name) > -1) {
            sqlarr.push(`${name} = ${props[name]}`);
        } else if (name === "from") {
            sqlarr.push(`addrFrom = '${addrFrom}'`);
        } else if (name === "recipient") {
            sqlarr.push(`addrTo = '${addrTo}'`);
        } else if (name === "receipt") {
            sqlarr.push(`chainDetail =  '${chainDetail}'`);
        } else {
            sqlarr.push(`${name} = '${props[name]}'`);
        }
    }
    if (sqlarr.length === 0) return;
    let sql = sqlarr.join(",");
    DB.prepare(`UPDATE transactions SET ${sql} WHERE transactionId = '${transactionId}'`).run();
    return getTransactions(transactionId)[0];
};

const taskListGet = () => {
    // 暂时不需要
};

const taskListAppend = task => {
    let db = task2db(task);
    if (!db.completedBytes) db.completedBytes = 0;
    DB.prepare(`INSERT INTO tasks
    (taskId, bucketId, created, updated, errorMessage, fileId,
        fileName, filePath, folderName, progress, state,
        taskState, taskType, completedBytes, totalBytes) VALUES
    ('${db.taskId}', '${db.bucketId}', ${db.created}, ${db.updated}, '${db.errorMessage}', '${db.fileId}',
        '${db.fileName}', '${db.filePath}', '${db.folderName}', ${db.progress}, '${db.state}',
        ${db.taskState}, ${db.taskType}, ${db.completedBytes}, ${db.totalBytes})`).run();
};

const taskListList = ({
    sort = (a, b) => b.created - a.created,
} = {}) => {
    let arr = DB.prepare(`SELECT * FROM tasks`).all();
    return arr.map(task => db2task(task)).sort(sort);
};

const taskListRemove = task => {
    DB.prepare(`DELETE FROM tasks WHERE taskId = '${task.taskId}'`).run();
};

const taskListUpdate = task => {
    let db = task2db(task);
    let IS_TEXT = ["taskId", "bucketId", "errorMessage", "fileId", "fileName", "filePath", "folderName", "state"];
    let sqlArr = [];
    for (let name in db) {
        if (IS_TEXT.indexOf(name) === -1) {
            sqlArr.push(`${name} = ${db[name]}`);
        } else {
            sqlArr.push(`${name} = '${db[name]}'`);
        }
    }
    let sql = sqlArr.join(",");
    console.log(sql);
    DB.prepare(`UPDATE tasks SET ${sql} WHERE taskId = '${db.taskId}'`).run();
};

const taskListClear = () => {
    DB.prepare(`DELETE FROM tasks`).run();
};



(() => {
    // initialize database and table
    try {
        DB.prepare(`CREATE TABLE IF NOT EXISTS transactions (
            payType TEXT,
            addrTo TEXT,
            amount REAL,
            gasPrice REAL,
            gasLimit INTEGER,
            addrFrom TEXT,
            created NUMERIC,
            transactionId TEXT,
            state INTEGER,
            message TEXT,
            hash TEXT,
            error TEXT,
            chainDetail TEXT
        )`).run();

        DB.prepare(`CREATE TABLE IF NOT EXISTS wallets (
            version INTEGER,
            id TEXT,
            address TEXT,
            name TEXT,
            created NUMERIC,
            crypto TEXT
        )`).run();

        // DB.prepare(`DROP TABLE tasks`).run();
        DB.prepare(`CREATE TABLE IF NOT EXISTS tasks (
            taskId TEXT,
            bucketId TEXT,
            created NUMERIC,
            updated NUMERIC,        
            errorMessage TEXT,
            fileId TEXT,
            fileName TEXT,
            filePath TEXT,
            folderName TEXT,
            progress INTEGER,
            state TEXT,
            taskState INTEGER,
            taskType INTEGER,
            completedBytes INTEGER,
            totalBytes INTEGER
        )`).run();

        DB.prepare(`CREATE TABLE IF NOT EXISTS metadata (
            username TEXT,
            uploadSize INTEGER,
            encryptionKey TEXT,
            salt TEXT
        )`).run();

    } catch (err) {
        console.log(err);
    }
})();


let getWallet = (address) => {

}


export {
    getTransactions,
    addTransaction,
    updateTransaction,
    taskListGet,
    taskListAppend,
    taskListList,
    taskListRemove,
    taskListUpdate,
    taskListClear,
}