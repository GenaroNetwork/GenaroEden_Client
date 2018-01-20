import bridgeApi from '../../utils/StorjApiClient'
import { getBalanceEth, getBalanceGnx } from '../../../wallet/transactionManager'

/*
    wallet: {
      "name": "Account 1",
      "created": 1516333259919,
      "address": "b69f7afad452559d08bf0c4e975b73e478fe5ef2"
    }
*/
const state = {
    wallet: {
        "name": "Account 1",
        "created": 1516333259919,
        "address": "b69f7afad452559d08bf0c4e975b73e478fe5ef2"
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
    }
}

const actions = {
    async loadBalance({ commit, state, getters, rootState, dispatch }) {
        const ba = await getBalanceEth(state.wallet.address)
        const gba = await getBalanceGnx(state.wallet.address)
        commit('setEthBalance', ba)
        commit('setGnxBalance', gba)
    }
}

export default {
    state,
    mutations,
    actions
}