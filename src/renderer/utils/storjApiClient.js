import store from '../store';
import { TASK_TYPE, TASK_STATE, BRIDGE_API_URL } from '../../config';
import log from "./log";
import events from "events";


const UUID = require('uuid/v1');
import { Environment, mnemonicGenerate, mnemonicCheck, listFiles } from 'storj';


let storj;
class Storj {
    constructor({
        bridgeUrl = BRIDGE_API_URL,
        bridgeUser = localStorage.bridgeUser,
        bridgePass = localStorage.bridgePass,
        encryptionKey = localStorage.bridgeKey,
        logLevel = 0,
    } = {}) {
        if (process.env.NODE_ENV === 'development') {
            localStorage.bridgeUser = bridgeUser;
            localStorage.bridgePass = bridgePass;
            localStorage.bridgeKey = encryptionKey;
        }
        return new Environment({
            bridgeUrl, bridgeUser, bridgePass, encryptionKey, logLevel,
        });
    };
    static init(...params) {
        storj = new Storj(...params);
    };
    static getInfo() {
        return new Promise((resolve, reject) => {
            storj.getInfo(function (err, result) {
                if (err) reject(err);
                else resolve(result);
            })
        });
    }
}
if (process.env.NODE_ENV === 'development') Storj.init();

class Bucket {
    constructor(bucketId) {
        this.bucketId = bucketId;
    }

    // create folder, not avaliable now.
    create() {
        return;
    };

    // get file list of this bucket
    list() {
        return new Promise((resolve, reject) => {
            storj.listFiles(this.bucketId, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        });
    };

    // delete file
    delete({ fileId }) {
        return new Promise((resolve, reject) => {
            storj.deleteFile(this.bucketId, fileId, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        });
    };

    // get bucket list
    static list() {
        return new Promise((resolve, reject) => {
            storj.getBuckets((err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        });
    };

    //create bucket
    static create({ bucketName }) {
        return new Promise((resolve, reject) => {
            storj.createBucket(bucketName, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        });
    };

    // delete bucket
    static delete({ bucketId }) {
        return new Promise((resolve, reject) => {
            storj.deleteBucket(bucketId, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        });
    };
}

class Task {
    constructor() {
        this.taskId = UUID();
        this.taskType = TASK_TYPE.NOTSET;
        this.taskState = TASK_STATE.INIT;
        this.progress = 0;
        this.created = Date.now();
        this.updated = Date.now();
        this.state = null;
        this.totalBytes = 0;
        this.errorMessage = null;

        let taskEvent = new events;
        this.on = taskEvent.on;
        this.once = taskEvent.once;
        this.emit = taskEvent.emit;
        this.off = (eventName, listener = null) => {
            if (listener === null) taskEvent.removeAllListeners(eventName);
            else taskEvent.removeListener(eventName, listener);
        };

        Object.defineProperty(this, "on", { enumerable: false });
        Object.defineProperty(this, "once", { enumerable: false });
        Object.defineProperty(this, "emit", { enumerable: false });
        Object.defineProperty(this, "off", { enumerable: false });
    };
    onProgress() { };
    onFinish() { };
    static cancel(state) { };
}

class UploadTask extends Task {
    constructor({ filePath, bucketId, fileName, folderName }) {
        super();

        // init varibles
        this.taskType = TASK_TYPE.UPLOAD;
        this.uploadedBytes = 0;
        this.filePath = filePath;
        this.bucketId = bucketId;
        this.fileName = fileName;
        this.folderName = folderName;

        // start upload
        this.state = storj.storeFile(this.bucketId, this.filePath, {
            filename: this.fileName,
            progressCallback: (...params) => this.onProgress(...params),
            finishedCallback: (...params) => this.onFinish(...params),
        });
    };

    onProgress(progress, uploadedBytes, totalBytes) {
        this.progress = progress;
        this.updated = Date.now();
        this.uploadedBytes = uploadedBytes;
        this.totalBytes = totalBytes;
        this.taskState = TASK_STATE.INPROGRESS;
        this.emit("progress", progress, uploadedBytes, totalBytes);
    };
    onFinish(error) {
        if (error) {
            if (error.message === "File transfer canceled") return;
            this.taskState = TASK_STATE.ERROR;
            this.errorMessage = error.message;
            this.emit("error", error);
            log.error("Upload file error.", this);
        } else {
            this.progress = 1;
            this.taskState = TASK_STATE.SUCCESS;
            this.emit("load");
            log.log("Upload file completed.", this);
        }
    };
    static cancel(state) {
        if (state) storj.storeFileCancel(state);
    };
}

class DownloadTask extends Task {
    constructor({ bucketId, fileId, filePath, folderName }) {
        super();

        // init varibles
        this.taskType = TASK_TYPE.DOWNLOAD;
        this.downloadedBytes = 0;
        this.bucketId = bucketId;
        this.fileId = fileId;
        this.filePath = filePath;
        this.folderName = folderName;

        // start download
        this.state = storj.resolveFile(bucketId, fileId, filePath, {
            overwrite: true,
            progressCallback: (...params) => this.onProgress(...params),
            finishedCallback: (...params) => this.onFinish(...params),
        });
    };

    onProgress(progress, downloadedBytes, totalBytes) {
        this.progress = progress;
        this.updated = Date.now();
        this.downloadedBytes = downloadedBytes;
        this.totalBytes = totalBytes;
        this.taskState = TASK_STATE.INPROGRESS;
        this.emit("progress", progress, downloadedBytes, totalBytes);
    };
    onFinish(error) {
        if (error) {
            if (error.message === "File transfer canceled") return;
            this.taskState = TASK_STATE.ERROR;
            this.errorMessage = error.message;
            this.emit("error", error);
            log.error("Upload file error.", this);
        } else {
            this.progress = 1;
            this.taskState = TASK_STATE.SUCCESS;
            this.emit("load");
        }
    };
    static cancel(state) {
        if (state) storj.resolveFileCancel(state);
    };
}

// old version to generate a task , use class instead
function newTask(customProp) {
    let baseTask = {
        taskId: UUID(),
        taskType: TASK_TYPE.NOTSET,
        taskState: TASK_STATE.INIT,
        progress: 0,
        created: Date.now(),
        updated: Date.now()
    }
    if (customProp && typeof customProp === 'object') {
        Object.keys(customProp).forEach(function (key, index) {
            baseTask[key] = customProp[key]
        })
    }
    return baseTask
}

/* 创建Bucket */
function createBucket(bucketName, callback) {
    storj.createBucket(bucketName, callback);
}

/* 获取bucket列表 */
function getBucketList(callback) {
    storj.getBuckets(callback)
}

/* 删除Bucket */
function deleteBucket(bucketId, callBack) {
    storj.deleteBucket(bucketId, callBack);
}

// oldVersiopn
function oldUploadFile(filePath, filename, bucketId, errorCallback, successCallback, progressCallback1) {
    let task = newTask({
        taskType: TASK_TYPE.UPLOAD,
        state: null,
        filePath,
        bucketId,
        user: bridgeUser,
        uploadedBytes: 0,
        totalBytes: 0,
        cancel: () => {
            storj.storeFileCancel(this.state)
        }
    })
    task.state = storj.storeFile(bucketId, filePath, {
        filename: filename,
        progressCallback: function (progress, uploadedBytes, totalBytes) {
            task.progress = progress
            task.updated = Date.now()
            task.uploadedBytes = uploadedBytes
            task.totalBytes = totalBytes
            task.taskState = TASK_STATE.INPROGRESS
            progressCallback1(task)
        },
        finishedCallback: function (err, fileId) {
            if (err) {
                task.taskState = TASK_STATE.ERROR
                errorCallback(err)
            } else {
                task.progress = 1
                task.taskState = TASK_STATE.SUCCESS
                successCallback()
            }
        }
    })
    return task
}

/* 获取文件列表 */
function getFileList(bucketId, callBack) {
    storj.listFiles(bucketId, callBack)
}

/* 下载文件 */
function downloadFile(bucketId, fileId, downloadFilePath, errorCallback, successCallback, progressCallback1) {
    let task = newTask({
        taskType: TASK_TYPE.DOWNLOAD,
        state: null,
        filePath: downloadFilePath,
        bucketId: bucketId,
        user: bridgeUser,
        downloadedBytes: 0,
        totalBytes: 0,
        cancel: () => {
            storj.ResolveFileCancel(this.state)
        }
    })

    task.state = storj.resolveFile(bucketId, fileId, downloadFilePath, {
        overwrite: true,
        progressCallback: function (progress, downloadedBytes, totalBytes) {
            task.progress = progress
            task.updated = Date.now()
            task.downloadedBytes = downloadedBytes
            task.totalBytes = totalBytes
            task.taskState = TASK_STATE.INPROGRESS
            progressCallback1(task)
        },
        finishedCallback: function (err) {
            if (err) {
                task.taskState = TASK_STATE.ERROR
                errorCallback(err)
            } else {
                task.progress = 1
                task.taskState = TASK_STATE.SUCCESS
                successCallback()
            }
        }
    })
    return task;
}

/* 删除文件 */
function deleteFile(bucketId, fileId, callBack) {
    storj.deleteFile(bucketId, fileId, callBack)
}

/* 获取信息 */
function getInfo(errorCallback, successCallback) {
    storj.getInfo(function (err, result) {
        if (err) {
            errorCallback(err)
        } else {
            successCallback(result)
        }
    })
}

function setEnvironment(bridgeUser, bridgePass, bridgeKey) {

    storj = new Storj()
    /* if (process.env.NODE_ENV === 'development') {
        localStorage.bridgeUser = bridgeUser;
        localStorage.bridgePass = bridgePass;
        localStorage.bridgeKey = bridgeKey;
    }

    storj = new Environment({
        bridgeUrl: BRIDGE_API_URL,
        bridgeUser: bridgeUser,
        bridgePass: bridgePass,
        encryptionKey: bridgeKey,
        logLevel: 0
    }); */
}

export {
    Storj,
    Bucket,
    UploadTask,
    DownloadTask,
    createBucket,
    getBucketList,
    deleteBucket,
    getFileList,
    deleteFile,
    mnemonicGenerate,
    mnemonicCheck
}