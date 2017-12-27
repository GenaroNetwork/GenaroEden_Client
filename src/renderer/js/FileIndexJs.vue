<script type="text/javascript">
import iView from 'iview';
import store from '../store'
import STROJ_CLIENT from '../utils/StorjApiClient'
import DB_UTIL from '../utils/DbUtil'

/* 初始化BucketList */
function initBucketList(username, password) {
    STROJ_CLIENT.getBucketList(username, password, function(err) {
            iView.Modal.error({
                title : 'Obtain Folder Error',
                content: 'Obtain Folder Error :' + err,
                okText: 'OK'
            });
        }, function(result) {
                store.commit('updateBucketList', result)
        }
    );
}

/* 初始化文件列表 */
function initFileList(username, password, bucketId) {
    store.commit('updateFileListLoading', true)
    STROJ_CLIENT.getFileList(bucketId, username, password, function(err) {
            iView.Message.error('Get Folder File List Error:' + err);
            store.commit('updateFileListLoading', false)
        }, function(result) {
            store.commit('updateBucketFileList', result)
            store.commit('updateFileListLoading', false)
    })
}

/* 保存下载后的文件列表 */
function saveDownloadFile(bucketId, fileId, callback) {
    var val = {bucketId: bucketId, fileId: fileId }
    DB_UTIL.save('t_down_files', val)
    callback()
}

/* 校验文件是否已经下载 */
function checkFileDownload(bucketId, fileId, callback) {
    var val = {bucketId: bucketId, fileId: fileId }
    var result = DB_UTIL.query('t_down_files', val)
    callback(result)
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
    saveDownloadFile,
    checkFileDownload,
    deleteFile
}
</script>