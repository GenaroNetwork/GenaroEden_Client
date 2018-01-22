import * as txManager from '../../../wallet/transactionManager'

const state = {
    transactions: []
}

const getters = {
    
}

const mutations = {

    setTransactions(state, Txs) {
        state.transactions = Txs
    },
    updateSingleTransaction(state, tx) {
        let existTx = state.transactions.find((ele) => {
            return ele.transactionId === tx.transactionId
        })
        if(existTx) {
            Object.assign(existTx, tx)
        }
    }
}

const actions = {
    submitTransaction({ commit, state, getters, rootState, dispatch }, {payOption, rawTransaction}) {
        txManager.sendTransaction(payOption, rawTransaction, tx => {
            commit('updateSingleTransaction', tx)
        })
        dispatch('loadTransactions')
        // TODO: observe transaction change and commit to state here, in order to update ui
    },
    loadTransactions({ commit }) {
        const txs = txManager.getTransactions()
        commit('setTransactions', txs)
    }
}

export default {
    state,
    mutations,
    actions
}