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
            console.log('update process: ' + existTask.progress)
            console.log('update process: ' + existTask.taskState)
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
        })
    }
}

const actions = {
    fireDownload({ commit, rootState, dispatch }, {folderId, fileId, filePath}) {
        // TODO: history
        let bridgeUser = rootState.User.username
        let bridgePass = rootState.User.password
        return new Promise((resolve, reject) => {
            let task = STROJ_CLIENT.downloadFile(folderId, fileId, filePath, bridgeUser, bridgePass, (err) => {
                // error
                commit('updateRunningDownloadTask', task)
                reject(err)
            }, () => { // success
                commit('updateRunningDownloadTask', task)
                dispatch('logHistory', task, { root: true })
                resolve()
            }, () => { // in process
                commit('updateRunningDownloadTask', task)
            })
            commit('appendNewDownloadTask', task)
        })
    }
}
export default {
    state,
    mutations,
    actions
}