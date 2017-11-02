const state = {
    uploadList: []
}

const getters = {
    uploadList: state=> state.uploadList
}

const mutations = {
    addFile(state, args) {
        state.uploadList.push({filename: args.filename, bucket: args.bucket})
    }
}

export default {
    state,
    mutations
}