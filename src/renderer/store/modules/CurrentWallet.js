import bridgeApi from '../../utils/StorjApiClient'
import { getBalanceEth, getBalanceGnx } from '../../../wallet/transactionManager'
import walletManager from '../../../wallet/walletManager'

const state = {
    wallet: {
      "name": "",
      "created": 0,
      "address": ""
    },
    balanceEth: 0,
    balanceGnx: 0
}

const getters = {
    
}

const mutations = {
    setEthBalance(state, balance) {
        state.balanceEth = balance
    },
    setGnxBalance(state, balance) {
        state.balanceGnx = balance
    },
    setWallet(state, wallet) {
        state.wallet = wallet
    }
}

const actions = {
    async loadBalance({ commit, state, getters, rootState, dispatch }) {
        const ba = await getBalanceEth(state.wallet.address)
        const gba = await getBalanceGnx(state.wallet.address)
        commit('setEthBalance', ba)
        commit('setGnxBalance', gba)
    },
    async payByCurrentWallet({ commit, state, getters, rootState, dispatch }, payOption) {
        let rawTransaction
        if(payOption.payType === 'ETH') {
            rawTransaction = await walletManager.generateSignedTx(state.wallet.address, payOption.password, payOption.recipient, payOption.amount, payOption.gasPrice, payOption.gasLimit)
        } else if(payOption.payType === 'GNX') {
            rawTransaction = await walletManager.generateSignedGnxTx(state.wallet.address, payOption.password, payOption.recipient, payOption.amount, payOption.gasPrice, payOption.gasLimit)
        }
        
        payOption.from = state.wallet.address
        delete payOption.password
        dispatch('submitTransaction', {payOption, rawTransaction}, { root: true })
    },
    async initWallet({ commit, state, getters, rootState, dispatch }) {
        const w = walletManager.loadFirstWallet()
        commit('setWallet', w)
        dispatch('loadBalance')
    }
}

export default {
    state,
    mutations,
    actions
}