import store from '../store';
import { TASK_TYPE, TASK_STATE, BRIDGE_API_URL } from '../../config';
import log from "./log";
import events from "events";


const UUID = require('uuid/v1')
const { Environment, mnemonicGenerate, mnemonicCheck } = require('storj')


let _storj;
if (process.env.NODE_ENV === 'development') {
    _storj = new Environment({
        bridgeUrl: BRIDGE_API_URL,
        bridgeUser: localStorage.bridgeUser,
        bridgePass: localStorage.bridgePass,
        encryptionKey: localStorage.bridgeKey,
        logLevel: 0
    });
}

let bridgeUser;

class Task {
    constructor() {
        this.taskId = UUID();
        this.taskType = TASK_TYPE.NOTSET;
        this.taskState = TASK_STATE.INIT;
        this.progress = 0;
        this.created = Date.now();
        this.updated = Date.now();

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
    constructor({ filePath, bucketId, fileName }) {
        super();

        // init varibles
        this.taskType = TASK_TYPE.UPLOAD;
        this.state = null;
        this.user = bridgeUser;
        this.uploadedBytes = 0;
        this.totalBytes = 0;
        this.filePath = filePath;
        this.bucketId = bucketId;
        this.fileName = fileName;

        // start upload
        this.state = _storj.storeFile(this.bucketId, this.filePath, {
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
    onFinish(err) {
        if (err) {
            this.taskState = TASK_STATE.ERROR;
            this.emit("error", err);
            log.error("Upload file error.", this);
        } else {
            this.progress = 1;
            this.taskState = TASK_STATE.SUCCESS;
            this.emit("load");
            log.log("Upload file completed.", this);
        }
    };
    static cancel(state) {
        if (state) _storj.storeFileCancel(state);
    };
}

class DownloadTask extends Task {
    constructor({ bucketId, fileId, filePath, folderName }) {
        super();

        // init varibles
        this.taskType = TASK_TYPE.DOWNLOAD;
        this.state = null;
        this.user = bridgeUser;
        this.downloadedBytes = 0;
        this.totalBytes = 0;
        this.bucketId = bucketId;
        this.fileId = fileId;
        this.filePath = filePath;
        this.folderName = folderName;

        // start download
        this.state = _storj.resolveFile(bucketId, fileId, filePath, {
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
    onFinish(err) {
        if (err) {
            this.taskState = TASK_STATE.ERROR;
            this.emit("error", err);
            debugger;
            log.error("Download file error.", err);
        } else {
            this.progress = 1;
            this.taskState = TASK_STATE.SUCCESS;
            this.emit("load");
            log.log("Download file completed.", err);
        }
    };
    static cancel(state) {
        if (state) _storj.resolveFileCancel(state);
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
    _storj.createBucket(bucketName, callback);
}

/* 获取bucket列表 */
function getBucketList(callback) {
    _storj.getBuckets(callback)
}

/* 删除Bucket */
function deleteBucket(bucketId, callBack) {
    _storj.deleteBucket(bucketId, callBack);
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
            _storj.storeFileCancel(this.state)
        }
    })
    task.state = _storj.storeFile(bucketId, filePath, {
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
    _storj.listFiles(bucketId, callBack)
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
            _storj.ResolveFileCancel(this.state)
        }
    })

    task.state = _storj.resolveFile(bucketId, fileId, downloadFilePath, {
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
    _storj.deleteFile(bucketId, fileId, callBack)
}

/* 获取信息 */
function getInfo(errorCallback, successCallback) {
    _storj.getInfo(function (err, result) {
        if (err) {
            errorCallback(err)
        } else {
            successCallback(result)
        }
    })
}

function setEnvironment(bridgeUser, bridgePass, bridgeKey) {

    if (process.env.NODE_ENV === 'development') {
        localStorage.bridgeUser = bridgeUser;
        localStorage.bridgePass = bridgePass;
        localStorage.bridgeKey = bridgeKey;
    }

    _storj = new Environment({
        bridgeUrl: BRIDGE_API_URL,
        bridgeUser: bridgeUser,
        bridgePass: bridgePass,
        encryptionKey: bridgeKey,
        logLevel: 0
    });
}

function generateKey() {

}

function cancelDownload(state) {
    if (state) _storj.resolveFileCancel(state)
}
function cancelUpload(state) {
    if (state) _storj.storeFileCancel(state)
}
export {
    setEnvironment,
    createBucket,
    getBucketList,
    deleteBucket,
    oldUploadFile,
    UploadTask,
    DownloadTask,
    cancelUpload,
    getFileList,
    downloadFile,
    cancelDownload,
    deleteFile,
    getInfo,
    mnemonicGenerate,
    mnemonicCheck
}