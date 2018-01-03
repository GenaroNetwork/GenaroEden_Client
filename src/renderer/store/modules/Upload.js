
const state = {
    uploadList: []
}

const getters = {
    uploadList: state=> state.uploadList
}

const mutations = {
    updateUploadTask(state, task) {
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
        } else {
            state.uploadList.push({
                taskId: task.taskId,
                taskState: task.taskState,
                filePath: task.filePath,
                bucketId: task.taskbucketIdId,
                user: task.user,
                progress: task.progress,
                uploadedBytes: task.uploadedBytes,
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