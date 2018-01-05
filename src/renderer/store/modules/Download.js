const state = {
    downloadList: []
}

const getters = {
    downloadList: state=> state.downloadList
}

const mutations = {
    updateDownloadTask(state, task) {
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
        } else {
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
}

export default {
    state,
    mutations
}