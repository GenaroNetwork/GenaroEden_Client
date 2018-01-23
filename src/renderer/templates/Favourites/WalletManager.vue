<style scoped>
.top-bar {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    padding: 10px;
}
.top-bar button i{
    margin-left: 5px;
    font-size: 12px;
    vertical-align: bottom;
}
.top-bar h2 {
    margin: 0;
    font-weight: normal;
    font-size: 1rem;
    flex-grow: 1;
}
.top-bar h2 a{
    color: unset;
    text-decoration:unset;
}
.top-bar .folder-action {
    flex-shrink: 0;
}
.wallet-list {
    flex-wrap: wrap;
    align-content: flex-start;
    padding: 10px;
    overflow: auto;
    overflow-x: hidden;
    flex-wrap: wrap;
}
.wallet {
  flex: 0 50%;
  
  height: 100px;
}
</style>
<template>
    <div class="fullheight v-flex">

        <div class="top-bar">
            <h2>Wallet Manage</h2>
            <el-button type="primary" @click="restore" size="small">Restore<i class="el-icon-upload el-icon--right"></i></el-button>
        </div>
        <!-- transaction -->
        <div class="flex flex-grow wallet-list">
            <div v-for="item in wallets" class="wallet" @click="">
                <div class="folder-icon">
                    <i class="material-icons">folder</i>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {getGasPrics, getGasLimit} from '../../../wallet/transactionManager'
import {utils} from '../../../wallet/web3Util'

export default {
    created: function() {
        this.$store.dispatch('loadAllWallets')
    },
    mounted: function (){
        // init balance
        //this.$store.dispatch('loadBalance')
    },
    data: function() {
        return {
        }
    },
    computed: {
        wallets() {
            return this.$store.state.WalletManage.wallets
        }
    },
    methods: {
        restore() {
        }
    }
}
</script>