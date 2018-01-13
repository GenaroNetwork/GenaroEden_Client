import STROJ_CLIENT from '../../utils/StorjApiClient'
const state = {
    downloadList: []
}

const getters = {
}

const mutations = {
    updateRunningDownloadTask(state, task) {
        let existTask = state.downloadList.find((ele) => {
            return ele.taskId === task.taskId
        })
        if(existTask) {
            existTask.progress = task.progress
            existTask.downloadedBytes = task.downloadedBytes
            existTask.totalBytes = task.totalBytes
            existTask.updated = task.updated
            existTask.taskState = task.taskState
        }
    },
    appendNewDownloadTask(state, task) {
        state.downloadList.push({
            taskId: task.taskId,
            taskType: task.taskType,
            taskState: task.taskState,
            filePath: task.filePath,
            bucketId: task.bucketId,
            user: task.user,
            progress: task.progress,
            downloadedBytes: task.downloadedBytes,
            totalBytes: task.totalBytes,
            created: task.created,
            updated: task.updated,
            folderName: task.folderName,
            state: task.state
        })
    },
    removeDownloadTask(state, taskId) {
        const index = state.downloadList.findIndex(t => t.taskId === taskId)
        state.downloadList.splice(index, 1)
    },
    removeState(state, task) {
        task.state = null
    }
}

const actions = {
    fireDownload({ commit, rootState, dispatch }, {folderId, fileId, filePath, folderName}) {
        return new Promise((resolve, reject) => {
            let task = STROJ_CLIENT.downloadFile(folderId, fileId, filePath, (err) => {
                // error
                commit('updateRunningDownloadTask', task)
                const fs = require('fs')
                fs.unlink(filePath, function(){})
                reject(err)
            }, () => { // success
                commit('updateRunningDownloadTask', task)
                dispatch('logHistory', task, { root: true })
                resolve()
            }, () => { // in process
                commit('updateRunningDownloadTask', task)
            })
            task.folderName = folderName
            commit('appendNewDownloadTask', task)
        })
    },
    cancelDownload({ commit, state, dispatch }, {taskId}) {
        const task = state.downloadList.find(t => t.taskId === taskId)
        if (task) {
            STROJ_CLIENT.cancelDownload(task.state)
            commit('removeState', task) // storj may crash when cancel task multipile times. set state to null to prevent.
        }
    },
    removeDownloadTask({ commit, state, dispatch }, {taskId}) {
        commit('removeDownloadTask', taskId)
    }
}
export default {
    state,
    mutations,
    actions
}