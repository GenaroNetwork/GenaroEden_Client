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
        if (state.wallets[0]) return state.wallets[0];
        return {};
    },
    currentWalletEth(state) {
        if (state.currentWallet) return state.balances.eth[state.currentWallet];
        if (state.wallets[0]) return state.balances.eth[state.wallets[0].address];
        return 0;
    },
    currentWalletGnx(state) {
        if (state.currentWallet) return state.balances.gnx[state.currentWallet];
        if (state.wallets[0]) return state.balances.gnx[state.wallets[0].address];
        return 0;
    },
    paymentWallet(state) {
        let wallet = state.wallets.find(wallet => wallet.address === state.paymentWallet);
        if (wallet) return wallet;
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
    walletListUpdateBalance(state, { address, ETH, GNX }) {
        state.balances.gnx = Object.assign({}, state.balances.gnx, { [address]: GNX });
        state.balances.eth = Object.assign({}, state.balances.eth, { [address]: ETH });
    },
    walletListSetPayment(state, { address }) {
        state.paymentWallet = address;
    },
    walletListSetCurrent(state, { address }) {
        state.currentWallet = address;
    }
}

const actions = {
    async walletListInit({ commit, dispatch }) {
        let wallets = await walletManager.loadWallet();
        commit('walletListInit', wallets);
        dispatch("walletListInitBalances");
    },
    async walletListInitBalances({ commit }) {
        for (let wallet of state.wallets) {
            setTimeout(async () => {
                let address = wallet.address;
                let ETH = await getBalanceEth(address);
                let GNX = await getBalanceGnx(address);
                commit("walletListUpdateBalance", { address, ETH, GNX });
            }, 0);
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
            const ok = await walletManager.deleteWallet(address)
            await dispatch('walletListInit')
        }
    },
    async walletListChangePassword({ commit, dispatch }, { address, password, newPassword }) {
        await walletManager.changePassword(address, password, newPassword)
        await dispatch('walletListInit')
    },
    async setPaymentWallet({ commit, dispatch, rootState }, { address, password, amount, gasPrice }) {
        // first set to 0 or transaction will fail: https://github.com/ethereum/EIPs/issues/738
        // 1: GNX approve
        // 2: Submit to network
        const rawTrans0 = await walletManager.generateSignedApproveTx(address, password, 0, gasPrice, 70000);
        await txManager.sendTransactionNoLog(rawTrans0);
        // 1: GNX approve
        // 2: Submit to network
        const rawTrans = await walletManager.generateSignedApproveTx(address, password, amount, gasPrice, 70000);
        await txManager.sendTransactionNoLog(rawTrans);
        const user = rootState.User.username;
        await walletManager.submitAddress(user, address, password);
        commit("walletListSetPayment", { address });
    },
    async walletListUpdateName({ commit }, { address, name }) {
        await walletManager.updateWalletName({ address, name });
        commit("walletListUpdateName", { address, name });
    },
    async walletListSetPayment({ commit }, { address }) {
        commit("walletListSetPayment", { address });
    },
    async walletListSetCurrent({ commit, dispatch }, { address }) {
        commit("walletListSetCurrent", { address });
        dispatch("walletListUpdateCurrentBalance");
    },
    async walletListUpdateCurrentBalance({ commit }) {
        let ETH = await getBalanceEth(state.currentWallet);
        let GNX = await getBalanceGnx(state.currentWallet);
        commit('walletListUpdateBalance', { address: state.currentWallet, ETH, GNX });
    },
    async walletListPayByCurrent({ commit, state, getters, rootState, dispatch }, payOption) {
        let rawTransaction
        if (payOption.payType === 'ETH') {
            rawTransaction = await walletManager.generateSignedTx(state.currentWallet, payOption.password, payOption.recipient, payOption.amount, payOption.gasPrice, payOption.gasLimit)
        } else if (payOption.payType === 'GNX') {
            rawTransaction = await walletManager.generateSignedGnxTx(state.currentWallet, payOption.password, payOption.recipient, payOption.amount, payOption.gasPrice, payOption.gasLimit)
        }

        payOption.from = state.wallet.address
        delete payOption.password
        dispatch('submitTransaction', { payOption, rawTransaction }, { root: true })
    },
}

export default {
    state,
    getters,
    mutations,
    actions
}