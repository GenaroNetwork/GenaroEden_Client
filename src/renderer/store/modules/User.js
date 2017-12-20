const state = {
    username: 'un',
    password: 'pwd',
    bucketId: '{bucketId}',
    totalUploadSize: 0
}

const getters = {
    username: state => state.username,
    password: state => state.password,
    bucketId: state => state.bucketId,
    totalUploadSize: state => state.totalUploadSize
}

const mutations = {
    updateUsername(state, username) {
        state.username = username
    },
    updatePassword(state, password) {
        state.password = password
    },
    updateBucketId(state, bucketId) {
        state.bucketId = bucketId
    },
    updateTotalUploadSize(state, sizeByte) {
        state.totalUploadSize = sizeByte
    }
}

export default {
    state,
    mutations
}