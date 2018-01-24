<style scoped>
    .el-select{
        width: 115px;
    }
    .preview-label{
        color: #999;
        padding-left: 5px;
        box-sizing: border-box;
    }
    .preview-value{
        overflow: hidden;
        padding-right: 5px;
        text-overflow: ellipsis;
        box-sizing: border-box;
    }
</style>
<template>
    <div class="fullheight right-container v-flex">
        <el-popover ref="payFormPop" v-model="payFormPop" placement="bottom" width="400" trigger="click" @show="payPopped">
            <el-form ref="payOption" status-icon :model="payOption" :rules="ruleInline">
                <template v-if="payStep === 0">
                    <el-form-item prop="recipient">
                        <el-input type="text" v-model="payOption.recipient" placeholder="Recippient Address" size="mini">
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="amount">
                        <el-input type="number" v-model="payOption.amount" placeholder="Amount" size="mini" min="0">
                            <el-select v-model="payOption.payType" placeholder="Please choose" slot="append">
                                <el-option key="ETH" label="ETH" value="ETH"></el-option>
                                <el-option key="GNX" label="GNX" value="GNX"></el-option>
                            </el-select>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="gas pirce (Gwei)" prop="gasPrice">
                        <el-input type="number" v-model="payOption.gasPrice" placeholder="Gas" size="mini">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="gas limit (Unit)" prop="gasLimit">
                        <el-input type="number" v-model="payOption.gasLimit" placeholder="Gas Limit" size="mini">
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="nextStep" type="primary">Next</el-button>
                    </el-form-item>
                </template>
                <template v-if="payStep === 1">
                    <el-row>
                        <el-col :span="10" class="preview-label">Sent Address:</el-col>
                        <el-col :span="14" class="preview-value">{{ wallet.address }}</el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="10" class="preview-label">Recipient Address:</el-col>
                        <el-col :span="14" class="preview-value">{{ payOption.recipient }}</el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="10" class="preview-label">Amount:</el-col>
                        <el-col :span="14" class="preview-value">{{ payOption.amount }}</el-col>
                    </el-row>
                    <el-form-item label="Wallet Password" prop="password" key="password">
                        <el-input type="password" v-model="payOption.password" placeholder="Wallet Password">
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="pay()" class="" type="primary" :loading="false">Submit</el-button>
                        <el-button @click="resetForm" class="" type="primary" :loading="false">Cancel</el-button>
                    </el-form-item>
                </template>
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
                <el-button class="btn" v-popover:payFormPop type="primary" size="small" @click="resetForm">Pay</el-button>
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

const GNX_LIMIT = 120000;
const GNX_SUGGEST = 150000;
const ETH_LIMIT = 21000;
const ETH_SUGGEST = 21000;

export default {
    created: function() {
        this.$store.dispatch('loadTransactions')
        const address = this.$route.params.walletAddress
        this.$store.dispatch('initWallet')
    },
    mounted: function (){
        // init balance
        this.calculateGas()
    },
    data: function() {

        var validator = {
            recipient: (rule, value, callback) => {
                if (!/^0x[a-zA-Z0-9]{40}$/.test(value)){
                    callback(new Error('Incorrect account address.'))
                }
                else{
                    callback()
                }
            },
            amount: (rule, value, callback) => {
                let balance;
                switch (this.payOption.payType) {
                    case "ETH":
                    balance = this.balanceEth;
                    if (utils.toWei(value) > balance){
                        callback(new Error('Amount must less than balance.'))
                    } else {
                        callback()
                    }
                    break;

                    case "GNX":
                    balance = this.balanceGnx;
                    if (value * Math.pow(10, 9) > balance){
                        callback(new Error('Amount must less than balance.'))
                    } else {
                        callback()
                    }
                    break;

                    default:
                    callback(new Error('Incorrect pat type'))
                    break;
                }
            },
            gasPrice: async (rule, value, callback) => {
                let price = await getGasPrics();
                price = utils.fromWei(price, "Gwei");
                if (value < price) {
                    callback(new Error("gas price should greater than " + price));
                }else{
                    callback()
                }
            },
            gasLimit: (rule, value, callback) => {
                if (this.payOption.payType === 'ETH' && value < ETH_LIMIT){
                    callback("gas limit should greater than " + ETH_LIMIT)
                } else if(this.payOption.payType === 'GNX' && value < GNX_LIMIT) {
                    callback("gas limit should greater than " + GNX_LIMIT)
                } else {
                    callback()
                }
            }
        }

        return {
            payFormPop: false,
            payOption: {
                payType: 'ETH',
                recipient: null,
                amount: null,
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
                recipient: [
                    { required: true, message: 'Please input recipient', trigger: 'blur' },
                    { validator: validator.recipient , trigger: 'blur'}
                ],
                amount: [
                    { required: true, message: 'Please input amount', trigger: 'blur' },
                    { validator: validator.amount , trigger: 'blur'}
                ],
                gasPrice: [
                    { required: true, message: 'Please input gasPrice', trigger: 'blur' },
                    { validator: validator.gasPrice , trigger: 'blur'}
                ],
                gasLimit: [
                    { required: true, message: 'Please input gasLimit', trigger: 'blur' },
                    { validator: validator.gasLimit , trigger: 'blur'}
                ],
                password: [
                    { required: true, message: 'Please input password', trigger: 'blur' },
                    { min: 6 , message: 'Password length must not be less than 6 bits'  ,trigger: 'blur'}
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
    watch: {
        "payOption.payType"(newValue){
            if (newValue === "ETH") this.payOption.gasLimit = ETH_SUGGEST;
            else this.payOption.gasLimit = GNX_SUGGEST;
        } 
    },
    methods: {
        async nextStep() {
            try{
                await this.$refs.payOption.validate();
                this.payStep = 1;
            }catch(e){

            }
        },
        async pay() {
            try{
                await this.$refs.payOption.validate();
                await this.$store.dispatch('payByCurrentWallet', this.payOption)
                    this.$message('transaction submitted')
                    this.resetForm()
            }catch(e){
                    this.$message.error('create transaction error: ' + e)
            }
        },
        calculateGas: async function() {
            this.defaultGas.price = await getGasPrics()
            this.defaultGas.limit = ETH_SUGGEST;
        },
        payPopped() {
            function wei2Gwei(wei) {
                return utils.fromWei(wei, 'Gwei');
            }
            this.payOption.gasPrice = parseInt(wei2Gwei(this.defaultGas.price))
            this.payOption.gasLimit = this.defaultGas.limit
        },
        resetForm(){
            this.payFormPop = false
            this.payStep = 0
            this.$refs.payOption.resetFields()
        }
    }
}
</script>