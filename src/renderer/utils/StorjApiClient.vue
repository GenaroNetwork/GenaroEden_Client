<script type="text/javascript">
import iView from 'iview';
import store from '../store'
import config from '../../config'

const {Environment} = require('storj');

const storjApiUrl = config.bridgeApiUrl;

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

/* 上传文件 */
function uploadFile(file, bucketId, bridgeUser, bridgePass, errorCallback, successCallback, progressCallback) {
    var _storj = getStorj(bridgeUser, bridgePass);
    _storj.storeFile(bucketId, file.path, {
        filename: file.name,
        progressCallback: function (progress, uploadedBytes, totalBytes) {
            progressCallback(progress, uploadedBytes, totalBytes)
            console.log('Progress: %d, uploadedBytes: %d, totalBytes: %d', progress, uploadedBytes, totalBytes);
        },
        finishedCallback: function (err, fileId) {
            if(err) {
                errorCallback(err)
                return console.error('upload-file error: ' + err + ' filename=' + file.name);
            }
            console.log('File upload complete:', fileId);
            successCallback()
        }
    });
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
function downloadFile(bucketId, fileId, downloadFilePath, bridgeUser, bridgePass, errorCallback, successCallback, progressCallback) {
    var _storj = getStorj(bridgeUser, bridgePass);
    _storj.resolveFile(bucketId, fileId, downloadFilePath, {
        overwrite: true,
        progressCallback: function (progress, downloadedBytes, totalBytes) {
            progressCallback(progress, downloadedBytes, totalBytes)
            console.log('Progress: %d, downloadedBytes: %d, totalBytes: %d', progress, downloadedBytes, totalBytes)
        },
        finishedCallback: function (err) {
            if (err) {
                errorCallback(err)
                console.error(err);
            } else {
                console.log('File download complete');
                successCallback()
            }
        }
    })
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
</script>