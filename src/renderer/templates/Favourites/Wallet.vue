<style scoped>

</style>
<template>
    <div class="fullheight right-container v-flex">
        <el-popover ref="payFormPop" placement="bottom" width="400" trigger="click" @show="payPopped">
            <el-form ref="payOption" :model="payOption" :rules="ruleInline">
                <div v-if="payStep === 0">
                    <el-form-item label="recipient" prop="recipient">
                        <el-input type="text" v-model="payOption.recipient" placeholder="Recippient Address">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="amount (ETH)" prop="amount">
                        <el-input type="number" v-model="payOption.amount" placeholder="Amount">
                        </el-input>
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
                            <el-button @click="pay()" class="sign-in" type="primary" :loading="false">Submit</el-button>
                        </el-form-item>
                    </div>
                </div>
            </el-form>
        </el-popover>

        <div class="flex">
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
    </div>
</template>

<script>
import walletManager from '../../../wallet/walletManager'
import {getGasPrics, getGasLimit} from '../../../wallet/transactionManager'
import {utils} from '../../../wallet/web3Util'

export default {
    mounted: function (){
        // init balance
        this.$store.dispatch('loadBalance')
        this.calculateGas()
        
    },
    data: function() {
        return {
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
        }
    },
    methods: {
        pay() {
            const w = this.wallet
            walletManager.pay(w.address, this.payOption.password, this.payOption.recipient, this.payOption.amount, this.payOption.gasPrice, this.payOption.gasLimit).then((t) => {
                this.$message('transaction submitted');
                console.log(t)
            }).catch(e => {
                this.$message.error('err: ' + e)
                console.log(e)
            })
        },
        calculateGas: async function() {
            this.defaultGas.price = await getGasPrics()
            this.defaultGas.limit = 30000
        },
        payPopped() {

            function wei2Gwei(wei) {
                return utils.fromWei(wei, 'Gwei');
            }
            console.log(this.defaultGas.price)
            console.log(wei2Gwei(this.defaultGas.price))
            this.payOption.gasPrice = parseInt(wei2Gwei(this.defaultGas.price))
            this.payOption.gasLimit = this.defaultGas.limit
        }
    }
}
</script>