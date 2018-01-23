import walletManager from '../../../wallet/walletManager'
const state = {
    wallets: []
}

const getters = {
    
}

const mutations = {
    updateWallet(state, wallet) {
        
    },
    setWallets(state, wallets) {
        state.wallets = wallets
    }
}

const actions = {
    async loadAllWallets({ commit }) {
        const wallets = await walletManager.loadWallet()
        commit('setWallets', wallets)
    }
}

export default {
    state,
    mutations,
    actions
}