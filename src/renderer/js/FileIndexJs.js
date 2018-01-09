import iView from 'iview';
import store from '../store'
import STROJ_CLIENT from '../utils/StorjApiClient'
import DB_UTIL from '../utils/DbUtil'

/* 初始化BucketList */
function initBucketList(username, password) {
    STROJ_CLIENT.getBucketList(function(err, result) {
        if(err) {
            iView.Modal.error({
                title : 'Obtain Folder Error',
                content: 'Obtain Folder Error :' + err,
                okText: 'OK'
            })
        } else {

            store.commit('updateBucketList', result)
        }
    });
}

/* 初始化文件列表 */
function initFileList(username, password, bucketId) {
    store.commit('updateFileListLoading', true)
    STROJ_CLIENT.getFileList(bucketId, function(err, result) {
        if(err) {
            iView.Message.error('Get Folder File List Error:' + err);
            store.commit('updateFileListLoading', false)
        } else {
            store.commit('updateBucketFileList', result)
            store.commit('updateFileListLoading', false)
        }
    })
}

/* 删除文件 */
function deleteFile(username, password, bucketId, fileId) {
    store.commit('updateFileListLoading', true)
    STROJ_CLIENT.deleteFile(bucketId, fileId, username, password, function(err) {
        iView.Modal.error({
            title : 'Delete File Error',
            content: 'Delete File Error:' + err
        });
    }, function(result) {
        initFileList(username, password, bucketId)
    })
}

export default {
    initBucketList,
    initFileList,
    deleteFile
}