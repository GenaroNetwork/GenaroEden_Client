import { getBalanceEth, getBalanceGnx, sendTransaction } from '../../../wallet/transactionManager'

const state = {
    transaction: []
}

const getters = {
    
}

const mutations = {
}

const actions = {
    submitTransaction({ commit, state, getters, rootState, dispatch }, {payOption, rawTransaction}) {
        sendTransaction(payOption, rawTransaction)
        // TODO: observe transaction change and commit to state here, in order to update ui
    },
    loadTransactions() {

    }
}

export default {
    state,
    mutations,
    actions
}