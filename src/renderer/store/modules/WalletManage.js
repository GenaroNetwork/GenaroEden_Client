import walletManager from '../../../wallet/walletManager'
const fs = require('fs')
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
    },
    async importV3Wallet({ commit, dispatch }, {filePath, password}) {
        const content = fs.readFileSync(filePath, 'utf8')
        await walletManager.importFromV3Json(content, password)
        await dispatch('loadAllWallets')
    },
    async forgetWallet({ commit, dispatch }, {address, password}) {
        const passwordOk = await walletManager.validateWalletPassword(address, password)
        if(passwordOk) {
            const ok = await walletManager.forgetWallet(address)
            await dispatch('loadAllWallets')
        }
    },
    async changePassword({ commit, dispatch }, {address, password, newPassword}) {
        await walletManager.changePassword(address, password, newPassword)
        await dispatch('loadAllWallets')
    }
}

export default {
    state,
    mutations,
    actions
}