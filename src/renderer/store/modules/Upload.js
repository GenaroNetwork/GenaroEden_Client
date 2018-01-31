/*
 *  NOTE: This is a old version of Upload List
 *        Do not add any feature in this file
 *        The only reason to edit this file is bug fix
 *        Use `TaskList.js` instead
 */


import STROJ_CLIENT from '../../utils/StorjApiClient'
import dbUtil from '../../utils/DbUtil'
const state = {
    uploadList: []
}

const getters = {
    uploadList: state => state.uploadList
}

const mutations = {
    updateRunningUploadTask(state, task) {
        let existTask = state.uploadList.find((ele) => {
            return ele.taskId === task.taskId
        })
        if (existTask) {
            existTask.progress = task.progress
            existTask.uploadedBytes = task.uploadedBytes
            existTask.totalBytes = task.totalBytes
            existTask.updated = task.updated
            existTask.taskState = task.taskState
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
            folderName: task.folderName,
            state: task.state
        })
    },
    removeUploadTask(state, taskId) {
        const index = state.uploadList.findIndex(t => t.taskId === taskId)
        state.uploadList.splice(index, 1)
    },
    removeState(state, task) {
        task.state = null
    }
}

const actions = {
    fireUpload({ commit, rootState, dispatch }, { filePath, bucketId, folderName }) {

        const fs = require('fs')
        const path = require('path')
        const filename = path.basename(filePath)
        const stats = fs.statSync(filePath)
        const filesize = stats.size

        return new Promise((resolve, reject) => {
            var task = STROJ_CLIENT.uploadFile(filePath, filename, bucketId, function (err) {
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
            task.folderName = folderName
            commit('appendNewUploadTask', task)
        })
    },
    cancelUpload({ commit, state, dispatch }, { taskId }) {
        const task = state.uploadList.find(t => t.taskId === taskId)
        if (task) {
            STROJ_CLIENT.cancelUpload(task.state)
            commit('removeState', task) // storj may crash when cancel multipile times. set state to null to prevent.
        }
    },
    removeUploadTask({ commit, state, dispatch }, { taskId }) {
        commit('removeUploadTask', taskId)
    }
}
export default {
    state,
    mutations,
    actions
}