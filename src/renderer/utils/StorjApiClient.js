import iView from 'iview';
import store from '../store'
import config from '../../config'
const uuidv4 = require('uuid/v4');
const {Environment} = require('storj');

const storjApiUrl = config.bridgeApiUrl;
const TASKSTATE = config.TASKSTATE
const TASKTYPE = config.TASKTYPE

function newTask(customProp) {
    let baseTask = {
        taskId: uuidv4(),
        taskType: TASKTYPE.NOTSET,
        taskState: TASKSTATE.INIT,
        progress: 0,
        created: Date.now(),
        updated: Date.now()
    }
    if(customProp && typeof customProp === 'object') {
        Object.keys(customProp).forEach(function(key,index) {
            baseTask[key] = customProp[key]
        })
    }
    return baseTask
}

/* 创建Bucket */
function createBucket(bucketName, bridgeUser, bridgePass, errorCallback, successCallback) {
    var _storj = getStorj(bridgeUser, bridgePass);
    _storj.createBucket(bucketName, function(err, result) {
        if (err) {
            errorCallback(err)
            console.error('create-bucket-info: ' + err);
        } else {
            successCallback(result)
            console.log('create-bucket-info:', result);
        }
    });
}

/* 获取bucket列表 */
function getBucketList(bridgeUser, bridgePass, errorCallback, successCallback) {
    var _storj = getStorj(bridgeUser, bridgePass);
    _storj.getBuckets(function (err, result) {
        if(err) {
            errorCallback(err)
        } else {
            successCallback(result)
        }
    });
}

/* 删除Bucket */
function deleteBucket(bucketId, bridgeUser, bridgePass, errorCallback, successCallback) {
    var _storj = getStorj(bridgeUser, bridgePass);
    _storj.deleteBucket(bucketId,function (err,result) {
        if(err){
            errorCallback(err)
            console.error('delete-bucket error: ' + err);
        } else {
            successCallback(result)
            console.log('delete-bucket:',result);
        }
    });
}

function uploadFile(file, bucketId, bridgeUser, bridgePass, errorCallback, successCallback, progressCallback1) {
    var _storj = getStorj(bridgeUser, bridgePass)
    let task = newTask({
        taskType: TASKTYPE.UPLOAD,
        state: null,
        filePath: file.path,
        bucketId: bucketId,
        user: bridgeUser,
        uploadedBytes: 0,
        totalBytes: 0,
        cancel: () => {
            console.log('cancel task: ' + taskId)
            console.log(this.state)
            _storj.storeFileCancel(this.state)
        }
    })
    task.state = _storj.storeFile(bucketId, file.path, {
        filename: file.name,
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
            if(err) {
                task.taskState = TASKSTATE.ERROR
                errorCallback(err)
                console.error('upload-file error: ' + err + ' filename=' + file.name)
            } else {
                task.progress = 1
                task.taskState = TASKSTATE.SUCCESS
                console.log(file.path + 'File upload complete:', fileId)
                successCallback()
            }
        }
    })
    return task
}

/* 获取文件列表 */
function getFileList(bucketId, bridgeUser, bridgePass, errorCallback, successCallback) {
    var _storj = getStorj(bridgeUser, bridgePass);
    _storj.listFiles(bucketId, function (err, result) {
        if (err) {
            errorCallback(err)
            console.error(err)
        } else {
            successCallback(result)
        }
    })
}

/* 下载文件 */
function downloadFile(bucketId, fileId, downloadFilePath, bridgeUser, bridgePass, errorCallback, successCallback, progressCallback1) {
    var _storj = getStorj(bridgeUser, bridgePass);

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
function deleteFile(bucketId, fileId, bridgeUser, bridgePass, errorCallback, successCallback) {
    var _storj = getStorj(bridgeUser, bridgePass);
    _storj.deleteFile(bucketId, fileId, function (err,result) {
        if (err) {
            errorCallback(err)
            console.error(err);
        } else {
            successCallback(result)
        }
    })
}

/* 获取信息 */
function getInfo(bridgeUser, bridgePass, errorCallback, successCallback) {
    var _storj = getStorj(bridgeUser, bridgePass);
    _storj.getInfo(function(err, result) {
        if(err) {
            errorCallback(err)
            console.error(err);
        } else {
            successCallback(result)
            console.log(result);
        }
    })
}

function register(email, passwd, errorCallback, successCallback) {
    var _storj = getEmptyStorj();
    _storj.register(email, passwd, function(err, result) {
        if(err) {
            errorCallback(err)
            console.error(err);
        } else {
            successCallback(result)
            console.log(result);
        }
    })
}

/* 获取Storj连接 */
function getStorj(bridgeUser, bridgePass) {
    var _storj = new Environment({
        bridgeUrl: storjApiUrl,
        bridgeUser: bridgeUser,
        bridgePass: bridgePass,
        encryptionKey: 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
        logLevel: 0
    });
    return _storj;
}
function getEmptyStorj() {
    var _storj = new Environment({
        bridgeUrl: storjApiUrl,
        encryptionKey: 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
        logLevel: 0
    });
    return _storj;
}

export default {
    createBucket,
    getBucketList,
    deleteBucket,
    deleteBucket,
    uploadFile,
    getFileList,
    downloadFile,
    deleteFile,
    getInfo,
    register
}