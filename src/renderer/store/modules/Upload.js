import STROJ_CLIENT from '../../utils/StorjApiClient'
import dbUtil from '../../utils/DbUtil'
const state = {
    uploadList: []
}

const getters = {
    uploadList: state=> state.uploadList
}

const mutations = {
    updateRunningUploadTask(state, task) {
        let existTask = state.uploadList.find((ele) => {
            return ele.taskId === task.taskId
        })
        if(existTask) {
            existTask.progress = task.progress
            existTask.uploadedBytes = task.uploadedBytes
            existTask.totalBytes = task.totalBytes
            existTask.updated = task.updated
            existTask.taskState = task.taskState
            console.log('update process: ' + existTask.progress)
            console.log('update process: ' + existTask.taskState)
        }
    },
    appendNewUploadTask(state, task) {
        state.uploadList.push({
            taskId: task.taskId,
            taskType: task.taskType,
            taskState: task.taskState,
            filePath: task.filePath,
            bucketId: task.bucketId,
            user: task.user,
            progress: task.progress,
            uploadedBytes: task.uploadedBytes,
            totalBytes: task.totalBytes,
            created: task.created,
            updated: task.updated,
        })
    }
}

const actions = {
    fireUpload({ commit, rootState, dispatch }, {filePath, bucketId}) {
        
        const fs = require('fs')
        const path = require('path')
        const filename = path.basename(filePath)
        const stats = fs.statSync(filePath)
        const filesize = stats.size
        
        return new Promise((resolve, reject) => {
            var task = STROJ_CLIENT.uploadFile(filePath, filename, bucketId, function(err) {
                commit('updateRunningUploadTask', task)
                reject(err)
            }, () => {
                commit('updateRunningUploadTask', task)
                dispatch('logHistory', task, { root: true })
                dispatch('reloadBucketData')
                dbUtil.addUploadSize(filesize)
                const newTotalSize = dbUtil.getUploadSize()
                commit('updateTotalUploadSize', newTotalSize)
                resolve()
            }, () => {
                commit('updateRunningUploadTask', task)
            })
            commit('appendNewUploadTask', task)
        })
    }
}
export default {
    state,
    mutations,
    actions
}