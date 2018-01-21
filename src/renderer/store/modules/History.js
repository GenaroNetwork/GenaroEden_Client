import STROJ_CLIENT from '../../utils/StorjApiClient'
import dbUtil from '../../utils/DbUtil'
const uuidV1 = require('uuid/v1')

const state = {
    historyList: []
}

const mutations = {
    setHisotry(state, history) {
        state.historyList = history
    }
}

const actions = {
    logHistory({ dispatch }, history) {
        history.historyId = uuidV1()
        // 1. save history in databse
        dbUtil.addHistory(history)
        // 2. reload 
        dispatch('loadHistory')
    },
    loadHistory({ commit }) {
        const his = dbUtil.getHistory()
        commit('setHisotry', his)
    },
    removeHistory({ dispatch }, historyId) {
        dbUtil.removeHistoryById(historyId)
        dispatch('loadHistory')
    }
}
export default {
    state,
    mutations,
    actions
}