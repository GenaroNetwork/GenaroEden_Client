import walletManager from '../../../wallet/walletManager'
import * as txManager from '../../../wallet/transactionManager'
import { getBalanceEth, getBalanceGnx } from '../../../wallet/transactionManager'

const fs = require('fs')
const state = {
    wallets: [],
    balances: {
        eth: {},
        gnx: {},
    },
    currentWallet: null,
    paymentWallet: null,
}

const getters = {
    currentWallet(state) {
        let wallet = state.wallets.find(wallet => wallet.address === state.currentWallet);
        if (wallet) return wallet;
        if (states.wallets[0]) return states.wallets[0];
        return {};
    },
    currentWalletEth(state) { },
    currentWalletGnx(state) { },
    paymentWallet(state) {
        let wallet = state.wallets.find(wallet => wallet.address === state.paymentWallet);
        if (wallet) return wallet;
        if (states.wallets[0]) return states.wallets[0];
        return {};
    },
}

const mutations = {
    walletListUpdateName(state, { address, name }) {
        let newWallets = state.wallets.forEach(oldWallet => {
            if (oldWallet.address !== address) return true;
            oldWallet.name = name;
        });
    },
    walletListInit(state, wallets) {
        state.wallets = wallets
    },
    walletListUpdateBalance(state, { address, eth, gnx }) {
        state.balances.gnx = Object.assign({}, state.balances.gnx, { [address]: gnx });
        state.balances.eth = Object.assign({}, state.balances.eth, { [address]: eth });
    }
}

const actions = {
    async walletListInit({ commit }) {
        const wallets = await walletManager.loadWallet()
        commit('walletListInit', wallets)
    },
    async walletListInitBalances({ commit }) {
        for (let wallet of state.wallets) {
            let address = wallet.address;
            let eth = await getBalanceEth(address);
            let gnx = await getBalanceGnx(address);
            commit("walletListUpdateBalance", { address, eth, gnx });
        }

    },
    async walletListImportV3({ commit, dispatch }, { filePath, password }) {
        const content = fs.readFileSync(filePath, 'utf8')
        await walletManager.importFromV3Json(content, password)
        await dispatch('walletListInit')
    },
    async walletListDelete({ commit, dispatch }, { address, password }) {
        const passwordOk = await walletManager.validateWalletPassword(address, password)
        if (passwordOk) {
            const ok = await walletManager.forgetWallet(address)
            await dispatch('walletListInit')
        }
    },
    async walletListChangePassword({ commit, dispatch }, { address, password, newPassword }) {
        await walletManager.changePassword(address, password, newPassword)
        await dispatch('walletListInit')
    },
    async walletListSetPayment({ commit, dispatch, rootState }, { address, password, amount, gasPrice }) {
        // first set to 0 or transaction will fail: https://github.com/ethereum/EIPs/issues/738
        // 1: GNX approve
        // 2: Submit to network
        const rawTrans0 = await walletManager.generateSignedApproveTx(address, password, 0, gasPrice, 70000)
        await txManager.sendTransactionNoLog(rawTrans0)
        // 1: GNX approve
        // 2: Submit to network
        const rawTrans = await walletManager.generateSignedApproveTx(address, password, amount, gasPrice, 70000)
        await txManager.sendTransactionNoLog(rawTrans)
        const user = rootState.User.username
        await walletManager.submitAddress(user, address, password)
    },
    async walletListUpdateName({ commit }, { address, name }) {
        await walletManager.walletListUpdateName({ address, name });
        commit("walletListUpdateName", { address, name });
    },
}

export default {
    state,
    mutations,
    actions
}