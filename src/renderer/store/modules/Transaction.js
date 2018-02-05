import * as txManager from '../../../wallet/transactionManager';
import { web3 } from "../../../wallet/web3Util";
import { TASK_STATE } from "../../../config";

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
        if (existTx) {
            Object.assign(existTx, tx)
        }
    },
}

const actions = {
    submitTransaction({ commit, state, getters, rootState, dispatch }, { payOption, rawTransaction }) {
        txManager.sendTransaction(payOption, rawTransaction, tx => {
            commit('updateSingleTransaction', tx)
        })
        dispatch('loadTransactions')
        // TODO: observe transaction change and commit to state here, in order to update ui
    },
    loadTransactions({ commit }) {
        const txs = txManager.getTransactions()
        commit('setTransactions', txs)
    },
    async updateSingleTransactionOnline({ state, commit }, { transactionId }) {
        let existTx = state.transactions.find((ele) => {
            return ele.transactionId === transactionId
        });
        if (existTx && existTx.hash) {
            let hash = existTx.hash;
            let receipt = await web3.eth.getTransactionReceipt(hash);
            let prop;
            if (receipt) {
                prop = {
                    transactionId,
                    state: TASK_STATE.SUCCESS,
                    receipt,
                }
            } else {
                prop = {
                    transactionId,
                    state: TASK_STATE.ERROR,
                }
            }
            txManager.updateTransaction(transactionId, prop);
            commit("updateSingleTransaction", prop);
        }
    }
}

export default {
    state,
    mutations,
    actions
}