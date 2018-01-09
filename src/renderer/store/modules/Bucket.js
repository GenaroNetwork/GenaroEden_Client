import bridgeApi from '../../utils/StorjApiClient'
const state = {
    bucketList: []
}

const getters = {
    bucketList: state=> state.bucketList
}

const mutations = {
    updateBucketList(state, bucketList) {
        state.bucketList = bucketList
    }
}

const actions = {
    fetchBucketList({ commit }) {
        return new Promise((resolve, reject) => {
            bridgeApi.getBucketList((err, data) => {
                if (err) {
                    reject(err)
                } else {
                    commit('updateBucketList', data)
                    resolve()
                }
            })
        })
    },
    createBucket({ commit, dispatch }, {bucketName}) {
        return new Promise((resolve, reject) => {
            bridgeApi.createBucket(bucketName, (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    dispatch('fetchBucketList')
                    resolve()
                }
            })
        })
    },
    deleteBucket({ commit, dispatch }, {bucketId}) {
        return new Promise((resolve, reject) => {
            bridgeApi.deleteBucket(bucketId, (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    dispatch('fetchBucketList')
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