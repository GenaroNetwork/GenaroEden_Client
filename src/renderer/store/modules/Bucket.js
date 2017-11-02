const state = {
    bucketList: [],
    showBucketList:[],
    moreBucketList:[]
}

const getters = {
    bucketList: state=> state.bucketList,
    showBucketList: state=> state.showBucketList,
    moreBucketList: state=> state.moreBucketList
}

const mutations = {
    updateBucketList(state, bucketList) {
        state.bucketList = bucketList
        if(bucketList.length < 5) {
            state.showBucketList = bucketList
        } else {
            state.showBucketList = bucketList.slice(0,4)
            state.moreBucketList = bucketList.slice(4)
        }
    }
}

export default {
    state,
    mutations
}