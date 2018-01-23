<style scoped>

</style>
<template>
    <div class="fullheight right-container v-flex">
        <el-popover ref="payFormPop" v-model="payFormPop" placement="bottom" width="400" trigger="click" @show="payPopped">
            <el-form ref="payOption" :model="payOption" :rules="ruleInline">
                <div v-if="payStep === 0">
                    <el-form-item label="recipient" prop="recipient">
                        <el-input type="text" v-model="payOption.recipient" placeholder="Recippient Address">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="amount" prop="amount">
                        <el-input type="number" v-model="payOption.amount" placeholder="Amount">
                        </el-input>
                        <el-select v-model="payOption.payType" placeholder="Please choose">
                            <el-option key="ETH" label="ETH" value="ETH"></el-option>
                            <el-option key="GNX" label="GNX" value="GNX"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="gas pirce (Gwei)" prop="gasPrice">
                        <el-input type="number" v-model="payOption.gasPrice" placeholder="Gas">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="gas limit (Unit)" prop="gasLimit">
                        <el-input type="number" v-model="payOption.gasLimit" placeholder="Gas Limit">
                        </el-input>
                    </el-form-item>
                    <div class=''>
                        <el-form-item>
                            <el-button @click="payStep = 1" type="primary">Next</el-button>
                        </el-form-item>
                    </div>
                </div>
                <div v-if="payStep === 1">
                    <el-form-item label="Wallet Password" prop="password">
                        <el-input type="password" v-model="payOption.password" placeholder="Wallet Password">
                        </el-input>
                    </el-form-item>
                    <div class=''>
                        <el-form-item>
                            <el-button @click="pay()" class="" type="primary" :loading="false">Submit</el-button>
                            <el-button @click="resetPayForm()" class="" type="primary" :loading="false">Cancel</el-button>
                        </el-form-item>
                    </div>
                </div>
            </el-form>
        </el-popover>

        <div class="flex flex-noshrink">
            <div class="flex">
                <div class="v-flex balance">
                    <h2>Balance</h2>
                    <span>{{balanceGnx}} GNX</span>
                    <span>= $9,999,999</span>
                </div>
                <div class="v-flex balance">
                    <h2>Balance</h2>
                    <span>{{balanceEth}} ETH</span>
                    <span>= $9,999,999</span>
                </div>
            </div>
            <div>
                <div>
                    <h2>{{wallet.name}}</h2>
                    <div>{{wallet.address}}</div>
                </div>
                <el-button class="btn" v-popover:payFormPop type="primary" size="small">Pay</el-button>
                <el-button class="btn" type="primary" size="small">Recieve</el-button>
                <el-button type="primary" size="small">Upload<i class="el-icon-upload el-icon--right"></i></el-button>
            </div>
        </div>
        <!-- transaction -->
        <div class="flex flex-grow">
            <el-table :data="txList" class="files-table" height="100%" row-class-name="file-row" >
                <el-table-column prop="state" label="State" width="55"></el-table-column>
                <el-table-column prop="hash" label="Hash" min-width="" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="receipt.blockNumber" label="Block" width="80" ></el-table-column>
                <el-table-column prop="created" label="Created" width="180" class-name="created-col"></el-table-column>
                <el-table-column prop="from" label="From" width="" class-name="id-col"></el-table-column>
                <el-table-column prop="recipient" label="To" width="" class-name="id-col"></el-table-column>
                <el-table-column prop="amount" label="Amount" width="" class-name="id-col"></el-table-column>
                <span slot="empty">No Transactions yet</span>
            </el-table>
        </div>
    </div>
</template>

<script>
import {getGasPrics, getGasLimit} from '../../../wallet/transactionManager'
import {utils} from '../../../wallet/web3Util'

export default {
    created: function() {
        this.$store.dispatch('loadTransactions')
    },
    mounted: function (){
        // init balance
        this.$store.dispatch('loadBalance')
        this.calculateGas()
    },
    data: function() {
        return {
            payFormPop: false,
            payOption: {
                payType: 'ETH',
                recipient: '',
                amount: 0,
                gasPrice: 0,
                gasLimit: 0,
                password: ''
            },
            defaultGas: {
                price: 0,
                limit: 0
            },
            payStep: 0,
            ruleInline: {
                username: [
                    { required: true, message: 'Please input username', trigger: 'blur' },
                    { type: 'email', message: 'Incorrect email format', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: 'Please input password', trigger: 'blur' },
                    { type: 'string', min: 6, message: 'Password length must not be less than 6 bits', trigger: 'blur' }
                ]
            }
        }
    },
    computed: {
        wallet() {
            return this.$store.state.CurrentWallet.wallet
        },
        balanceEth() {
            return this.$store.state.CurrentWallet.balanceEth
        },
        balanceGnx() {
            return this.$store.state.CurrentWallet.balanceGnx
        },
        txList() {
            return this.$store.state.Transaction.transactions
        }
    },
    methods: {
        resetPayForm() {
            this.payFormPop = false
            this.payStep = 0

            this.payOption.recipient = ''
            this.payOption.amount = 0
            this.payOption.gasPrice = 0
            this.payOption.gasLimit = 0
            this.payOption.password = ''
        },
        pay() {
            const this2 = this

            this.$store.dispatch('payByCurrentWallet', this2.payOption).then(()=>{
                this2.$message('transaction submitted')
                this2.resetPayForm()
            }).catch(e => {
                this.$message.error('create transaction error: ' + e)
            })
        },
        calculateGas: async function() {
            this.defaultGas.price = await getGasPrics()
            this.defaultGas.limit = 21000
        },
        payPopped() {

            function wei2Gwei(wei) {
                return utils.fromWei(wei, 'Gwei');
            }
            this.payOption.gasPrice = parseInt(wei2Gwei(this.defaultGas.price))
            this.payOption.gasLimit = this.defaultGas.limit
        }
    }
}
</script>