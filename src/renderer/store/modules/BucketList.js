import { Bucket } from '../../utils/storjApiClient';
import { O_NONBLOCK } from 'constants';

const state = {
    buckets: []
}

const getters = {
}

const mutations = {
    bucketListLoad(state, commitList) {
        state.buckets = [];
        commitList.forEach(bucket => {
            state.buckets.push(Object.assign({}, bucket));
        });
    }
}

const actions = {
    async bucketListLoad({ commit }) {
        commit("bucketListLoad", await Bucket.list());
    },
    async bucketListCreate({ commit, dispatch }, { bucketName }) {
        await Bucket.create({ bucketName });
        dispatch("bucketListLoad");
    },
    async bucketListDelete({ commit, dispatch }, { bucketId }) {
        await Bucket.delete({ bucketId });
        dispatch("bucketListLoad");
    },
}

export default {
    state,
    mutations,
    actions
}