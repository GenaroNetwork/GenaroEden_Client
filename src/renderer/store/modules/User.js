const state = {
    username: '',
    password: '',
    encryptionKey: '',
    totalUploadSize: 0
}

const getters = {
    username: state => state.username,
    password: state => state.password,
    totalUploadSize: state => state.totalUploadSize
}

const mutations = {
    updateUsername(state, username) {
        state.username = username
    },
    updatePassword(state, password) {
        state.password = password
    },
    updateTotalUploadSize(state, sizeByte) {
        state.totalUploadSize = sizeByte
    },
    setEncryptionKey(state, key) {
        state.encryptionKey = key
    }
}

export default {
    state,
    mutations
}