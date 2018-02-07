import { Bucket } from '../../utils/storjApiClient';
let bucket;

let state = {
    bucket: null,
    files: [],
};

let getters = {}

let mutations = {
    fileListLoadBucket(state, { bucket }) {
        state.bucket = Object.assign({}, bucket);
    },
    fileListLoadFile(state, { files }) {
        state.files = [];
        files.forEach(file => {
            state.files.push(Object.assign({}, file));
        });
    },
};

let actions = {
    fileListLoadBucket({ commit, rootState, dispatch }, { bucketId }) {
        let bucket = rootState.BucketList.buckets.find(bucket => bucket.id === bucketId);
        commit("fileListLoadBucket", { bucket });
        dispatch("fileListLoadFile");
    },
    async fileListLoadFile({ commit, state }) {
        if (!state.bucket) throw new Error("no current bucket displaying");

        let files = await new Bucket(state.bucket.id).list();
        commit("fileListLoadFile", { files });
    },
    async fileListDelete({ commit, state, dispatch }, { fileId }) {
        await new Bucket(state.bucket.id).delete({ fileId });
        dispatch("fileListLoadFile");
    },
};

export default {
    state,
    getters,
    mutations,
    actions,
}