import { getFileList, deleteFile } from '../../utils/storjApiClient'
const state = {
    bucket: null,
    fileList: []
}

const getters = {
    fileList: state => state.fileList
}

const mutations = {
    setFileList(state, files) {
        state.fileList = files
    },
    setBucket(state, bucket) {
        state.bucket = bucket
    },
    deleteFile(state, fileId) {
        const index = state.fileList.findIndex(f => f.id === fileId)
        state.fileList.splice(index, 1)
    }
}

const actions = {
    initBucketData({ commit, getters, rootState, dispatch }, { bucketId }) {
        let blist = rootState.Bucket.bucketList
        const bucket = blist.find(b => b.id === bucketId)
        commit('setBucket', bucket)
        return dispatch('reloadBucketData')
    },
    reloadBucketData({ commit, state }) {
        return new Promise((resolve, reject) => {
            if (state.bucket) {
                getFileList(state.bucket.id, function (err, data) {
                    if (err) {
                        reject()
                    } else {
                        commit('setFileList', data)
                        resolve()
                    }
                })
            } else {
                reject('no current bucket displaying')
            }
        })
    },
    deleteFile({ commit, getters }, { bucketId, fileId }) {
        return new Promise((resolve, reject) => {
            deleteFile(bucketId, fileId, (err, result) => {
                if (err) {
                    reject(err)
                } else {
                    commit('deleteFile', fileId)
                    resolve()
                }
            })
        })
    }
}

export default {
    state,
    mutations,
    actions
}