import walletManager from '../../../wallet/walletManager'
import { getBalanceEth, getBalanceGnx } from '../../../wallet/transactionManager';
const fs = require('fs')
const state = {
    wallets: [],
    balances: {
        eth: {},
        gnx: {},
    },
}

const getters = {

}

const mutations = {
    updateWalletName(state, { address, name }) {
        let newWallets = state.wallets.forEach(oldWallet => {
            if (oldWallet.address !== address) return true;
            oldWallet.name = name;
        });
    },
    setWallets(state, wallets) {
        state.wallets = wallets
    },
    updateBalances(state, { address, eth, gnx }) {
        state.balances.gnx = Object.assign({}, state.balances.gnx, { [address]: gnx });
        state.balances.eth = Object.assign({}, state.balances.eth, { [address]: eth });
    }
}

const actions = {
    async loadAllWallets({ commit }) {
        const wallets = await walletManager.loadWallet()
        commit('setWallets', wallets)
    },
    async loadAllWalletsBalances({ commit }) {
        for (let wallet of state.wallets) {
            let address = wallet.address;
            let eth = await getBalanceEth(address);
            let gnx = await getBalanceGnx(address);
            commit("updateBalances", { address, eth, gnx });
        }

    },
    async importV3Wallet({ commit, dispatch }, { filePath, password }) {
        const content = fs.readFileSync(filePath, 'utf8')
        await walletManager.importFromV3Json(content, password)
        await dispatch('loadAllWallets')
    },
    async forgetWallet({ commit, dispatch }, { address, password }) {
        const passwordOk = await walletManager.validateWalletPassword(address, password)
        if (passwordOk) {
            const ok = await walletManager.forgetWallet(address)
            await dispatch('loadAllWallets')
        }
    },
    async changePassword({ commit, dispatch }, { address, password, newPassword }) {
        await walletManager.changePassword(address, password, newPassword)
        await dispatch('loadAllWallets')
    },
    async setAsPayingWallet({ commit, dispatch, rootState }, { address, password }) {
        const user = rootState.User.username
        await walletManager.submitAddress(user, address, password)
    },
    async updateWalletName({ commit }, { address, name }) {
        await walletManager.updateWalletName({ address, name });
        commit("updateWalletName", { address, name });
    },
}

export default {
    state,
    mutations,
    actions
}