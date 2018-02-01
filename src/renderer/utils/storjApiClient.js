import store from '../store'
import config from '../../config'
import log from "./log";

const UUID = require('uuid/v1')
const { Environment, mnemonicGenerate, mnemonicCheck } = require('storj')

const BRIDGE_API_URL = config.bridgeApiUrl;
const TASKSTATE = config.TASKSTATE
const TASKTYPE = config.TASKTYPE

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
        this.taskType = TASKTYPE.NOTSET;
        this.taskState = TASKSTATE.INIT;
        this.progress = 0;
        this.created = Date.now();
        this.updated = Date.now();

        Object.entries(props).forEach(([key, value]) => {
            this[key] = value;
        });
    }
}

class UploadTask extends Task {
    constructor({ params }) {
        super();
        this.taskType = TASKTYPE.UPLOAD;
        this.state = null;
        this.user = bridgeUser;
        this.uploadedBytes = 0;
        this.totalBytes = 0;
    };
    cancel() {
        log.log('Cancel task: ' + taskId);
        log.log(this.state);
        _storj.storeFileCancel(this.state);
    }
}

// old version to generate a task , use class instead
function newTask(customProp) {
    let baseTask = {
        taskId: UUID(),
        taskType: TASKTYPE.NOTSET,
        taskState: TASKSTATE.INIT,
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
        taskType: TASKTYPE.UPLOAD,
        state: null,
        filePath,
        bucketId,
        user: bridgeUser,
        uploadedBytes: 0,
        totalBytes: 0,
        cancel: () => {
            console.log('cancel task: ' + taskId)
            console.log(this.state)
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
            task.taskState = TASKSTATE.INPROGRESS
            progressCallback1(task)
            console.log(task)
        },
        finishedCallback: function (err, fileId) {
            if (err) {
                task.taskState = TASKSTATE.ERROR
                errorCallback(err)
                console.error('upload-file error')
            } else {
                task.progress = 1
                task.taskState = TASKSTATE.SUCCESS
                console.log(filePath + 'File upload complete:', fileId)
                successCallback()
            }
        }
    })
    return task
}

// new version
function uploadFile({ filePath, fileName, bucketId }) {
    let task = new Task({
        taskType: TASKTYPE.UPLOAD,

    });

}

/* 获取文件列表 */
function getFileList(bucketId, callBack) {
    _storj.listFiles(bucketId, callBack)
}

/* 下载文件 */
function downloadFile(bucketId, fileId, downloadFilePath, errorCallback, successCallback, progressCallback1) {
    let task = newTask({
        taskType: TASKTYPE.DOWNLOAD,
        state: null,
        filePath: downloadFilePath,
        bucketId: bucketId,
        user: bridgeUser,
        downloadedBytes: 0,
        totalBytes: 0,
        cancel: () => {
            console.log('cancel task: ' + taskId)
            console.log(this.state)
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
            task.taskState = TASKSTATE.INPROGRESS
            progressCallback1(task)
            console.log(task)
        },
        finishedCallback: function (err) {
            if (err) {
                task.taskState = TASKSTATE.ERROR
                errorCallback(err)
                console.error(err);
            } else {
                task.progress = 1
                task.taskState = TASKSTATE.SUCCESS
                console.log('File download complete');
                successCallback()
            }
        }
    })
    return task
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
            console.error(err);
        } else {
            successCallback(result)
            console.log(result);
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
export default {
    setEnvironment,
    createBucket,
    getBucketList,
    deleteBucket,
    deleteBucket,
    oldUploadFile,
    uploadFile,
    cancelUpload,
    getFileList,
    downloadFile,
    cancelDownload,
    deleteFile,
    getInfo,
    mnemonicGenerate,
    mnemonicCheck
}