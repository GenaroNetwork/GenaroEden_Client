const state = {
    username: 'gencodettt@gmail.com',
    password: 'lab@12345',
    bucketId: '{bucketId}'
}

const getters = {
    username: state=> state.username,
    password: state=> state.password,
    bucketId: state=> state.bucketId
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
    }
}

export default {
    state,
    mutations
}