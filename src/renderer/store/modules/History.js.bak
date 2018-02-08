/*
 *  NOTE: This is a old version of History List
 *        Do not add any feature in this file
 *        The only reason to edit this file is bug fix
 *        Use `TaskList.js` instead
 */

import { getHistory, addHistory, removeHistoryById } from '../../utils/dbUtil'
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
        addHistory(history)
        // 2. reload 
        dispatch('loadHistory')
    },
    loadHistory({ commit }) {
        const his = getHistory()
        commit('setHisotry', his)
    },
    removeHistory({ dispatch }, historyId) {
        removeHistoryById(historyId)
        dispatch('loadHistory')
    }
}
export default {
    state,
    mutations,
    actions
}