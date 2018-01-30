<style scoped>
/* common-style */
.common-link {
  cursor: pointer;
  text-decoration: none;
  color: #3498db
}

/* popup style */
.el-select {
  width: 115px;
}
.preview-label {
  color: #999;
  padding-left: 5px;
  box-sizing: border-box;
}
.preview-value {
  overflow: hidden;
  padding-right: 5px;
  text-overflow: ellipsis;
  box-sizing: border-box;
}

/* banner style */
.banner {
  display: flex;
  flex-direction: row;
}

.banner > div {
  flex: 20;
  margin: 30px 0;
  height: 200px;
  box-sizing: border-box;
}

.banner .blank {
  flex: 1;
}

.banner .balance {
  border-radius: 4px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
  padding-top: 100px;
  color: #fff;
  padding-left: 23px;
  padding-right: 23px;
  position: relative;
  overflow: hidden;
}

.banner .balance div {
  position: relative;
  z-index: 1;
}

.banner .balance div:nth-child(1) {
  height: 45px;
  font-size: 0;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
  box-sizing: border-box;
  white-space: nowrap;
}

.banner .balance div:nth-child(1) span {
  height: 45px;
  font-size: 28px;
  line-height: calc(40px * 2 - 28px);
  max-width: calc(100% - 60px);
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
}

.banner .balance div:nth-child(1) .unit {
  font-size: 15px;
  line-height: calc(40px * 2 - 18px);
  margin-left: 10px;
}

.banner .balance div:nth-child(2) {
  height: 30px;
  font-size: 18px;
  line-height: 30px;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.banner .balance:before,
.banner .balance:after {
  pointer-events: none;
  content: "";
  position: absolute;
  left: 25px;
  top: 20px;
  height: 100px;
  width: 100px;
  background-repeat: no-repeat;
  background-position: 0 0;
}

.banner .balance:after {
  left: auto;
  top: auto;
  right: -20px;
  bottom: -20px;
  height: 200px;
  width: 200px;
  background-position: 100% 100%;
}

.banner .gnx {
  background: linear-gradient(to right bottom, #409eff, #188be2);
}

.banner .gnx:before {
  background-image: url(../../../static/gnx_white.svg);
  background-size: 50px auto;
}

.banner .gnx:after {
  background-image: url(../../../static/gnx_blue.svg);
  background-size: 180px auto;
}

.banner .eth {
  background-image: linear-gradient(to right bottom, #c4c4c4, #a2a2a2);
}

.banner .eth:before {
  background-image: url(../../../static/eth_white.svg);
  background-size: 28px auto;
}

.banner .eth:after {
  background-image: url(../../../static/eth_gray.svg);
  right: 10px;
  bottom: -10px;
  background-size: 120px auto;
}

.banner .account {
  flex: 25;
  max-width: 400px;
  overflow: hidden;
  border-radius: 0;
}

.banner .account .info {
  overflow: hidden;
  margin-bottom: 40px;
}

.banner .account .info img {
  float: left;
  height: 88px;
  width: 88px;
  border-radius: 50%;
  background-image: linear-gradient(to bottom, #a1e9fe, #8ed8fb);
}

.banner .account .info h2,
.banner .account .info > div {
  width: calc(100% - 100px);
  box-sizing: border-box;
  margin-left: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.banner .account .info h2 {
  cursor: pointer;
}

.banner .account .info div {
  position: relative;
  padding-right: 50px;
  height: 30px;
  line-height: 30px;
}

.banner .account .info div .copy {
  position: absolute;
  right: 0;
  top: 0;
  height: 30px;
  line-break: 30px;
}

.banner .account .info div .copy i {
  cursor: pointer;
}

.banner .account .actions {
  display: flex;
  padding: 0 20%;
  justify-content: space-around;
}

/* list style */
.state-icon {
  text-align: center;
  display: block;
  margin: auto;
}

.state-icon[state="1"],
.state-icon[state="2"] {
  color: #f6a725;
}

.state-icon[state="3"] {
  color: #f56167;
}

.state-icon[state="4"] {
  color: #8bc34a;
}

/* deposit popup style */
.deposit-pop img {
  display: block;
  margin: 0 auto;
}

.deposit-pop .actions {
  padding: 0 10%;
  display: flex;
  justify-content: space-around;
}
</style>
<template>
    <div class="fullheight right-container v-flex">

        <!-- transfer popup -->
        <el-popover ref="payFormPop" v-model="payFormPop" placement="bottom" width="350" trigger="click" @show="payPopped">
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

        <!-- Deposit popup -->
        <el-popover ref="depositPop" placement="bottom" width="350" trigger="click" v-model="depositPop">
            <div class="deposit-pop">
                <el-input type="text" :disabled="true" v-model="wallet.address">
                </el-input>
                <img :src="'qr://' + wallet.address">
                <div class="actions">
                    <el-button class="btn" size="small" @click="depositPop=false">Cancel</el-button>
                    <el-button class="btn" type="primary" size="small" @click="copy(wallet.address)">Copy The Address</el-button>
                </div>
            </div>
        </el-popover>

        <!-- afterCopyTip -->
        <el-popover ref="afterCopyTip" trigger="click" content="Address Copyed to ClipBoard."></el-popover>

        <!-- banner info -->
        <div class="banner">
            <div class="blank"></div>
            <div class="balance gnx">
                <div>
                    <span :title="balanceGnx">{{balanceGnx | wei2gnx}}</span>
                    <span class="unit"> GNX</span>
                </div>
                <!-- <div>≈${{ dollarGnx }}</div> -->
            </div>
            <div class="blank"></div>
            <div class="balance eth">
                <div>
                    <span :title="balanceEth">{{balanceEth | wei2eth}}</span>
                    <span class="unit"> ETH</span>
                </div>
                <!-- <div>≈${{ dollarEth }}</div> -->
            </div>
            <div class="blank"></div>
            <div class="account">
                <div class="info">
                    <img :src="avatarUrl(wallet.address)">
                    <h2>
                        <el-dropdown trigger="click" @command="changeWallet">
                            <span class="el-dropdown-link">
                                {{wallet.name}}
                                <i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item v-for="wallet of wallets" :command="wallet.address">
                                    {{ wallet.name }}
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </h2>
                    <div>
                        <span :title="wallet.address">{{wallet.address}}</span>
                        <span class="copy">
                            <i class="material-icons" @click="copy(wallet.address)" v-popover:afterCopyTip>content_copy</i>
                        </span>
                    </div>
                </div>
                <div class="actions">
                    <el-button class="btn" v-popover:depositPop type="primary" size="small">Deposit</el-button>
                    <el-button class="btn" v-popover:payFormPop type="primary" size="small" @click="resetForm">Transfer</el-button>
                </div>
            </div>
            <div class="blank"></div>
        </div>

        <!-- transaction history -->
        <div class="flex flex-grow">
            <el-table :data="txList" class="files-table" height="100%" row-class-name="file-row">
                <el-table-column prop="state" label="" width="60">
                    <template slot-scope="scope">
                        <i class="material-icons state-icon" :state="scope.row.state" v-if="scope.row.state === taskstate.INIT || scope.row.state === taskstate.INPROGRESS">
                            remove_circle_outline
                        </i>
                        <i class="material-icons state-icon" :state="scope.row.state" v-else-if="scope.row.state === taskstate.ERROR">
                            error_outline
                        </i>
                        <i class="material-icons state-icon" :state="scope.row.state" v-else>
                            add_circle_outline
                        </i>
                        <i class="material-icons state-icon common-link" @click="refreshStatus(scope.row)" v-if="scope.row.state === taskstate.ERROR">
                            refresh
                        </i>

                    </template>
                </el-table-column>
                <el-table-column prop="hash" label="Hash" min-width="" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <a class="common-link" href="#" @click="hashCheck(scope.row.hash)">{{ scope.row.hash }}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="receipt.blockNumber" label="Block" width="80"></el-table-column>
                <el-table-column prop="created" label="Created" width="180" class-name="created-col"></el-table-column>
                <el-table-column prop="from" label="From" width="" class-name="id-col" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="recipient" label="To" width="" class-name="id-col" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="amount" label="Amount" width="" class-name="id-col"></el-table-column>
                <span slot="empty">No Transactions yet</span>
            </el-table>
        </div>
    </div>
</template>

<script>
import { getGasPrics, getGasLimit } from "../../../wallet/transactionManager";
import { utils, EtherscanURL, web3 } from "../../../wallet/web3Util";
import { clipboard, shell } from "electron";
import config from "../../../config.js";

const GNX_LIMIT = 120000;
const GNX_SUGGEST = 150000;
const ETH_LIMIT = 21000;
const ETH_SUGGEST = 21000;

export default {
    async created() {
        const address = this.$route.params.walletAddress;
        this.$store.dispatch("loadTransactions");
        this.$store.dispatch("initWallet");
        await this.$store.dispatch("loadAllWallets");
    },
    mounted() {
        // init balance
        this.calculateGas();
        web3.eth.subscribe("newBlockHeaders", this.calculateGas);
    },
    beforeDestroyed() {
        web3.eth.clearSubscriptions();
    },
    data() {
        var validator = {
            recipient: (rule, value, callback) => {
                if (!/^0x[a-zA-Z0-9]{40}$/.test(value)) {
                    callback(new Error("Incorrect account address."));
                } else {
                    callback();
                }
            },
            amount: (rule, value, callback) => {
                let balance;
                switch (this.payOption.payType) {
                    case "ETH":
                        balance = this.balanceEth;
                        if (utils.toWei(value) > balance) {
                            callback(new Error("Amount must less than balance."));
                        } else {
                            callback();
                        }
                        break;

                    case "GNX":
                        balance = this.balanceGnx;
                        if (value * Math.pow(10, 9) > balance) {
                            callback(new Error("Amount must less than balance."));
                        } else {
                            callback();
                        }
                        break;

                    default:
                        callback(new Error("Incorrect pat type"));
                        break;
                }
            },
            gasPrice: async (rule, value, callback) => {
                let price = await getGasPrics();
                price = utils.fromWei(price, "Gwei");
                if (value < price) {
                    callback(new Error("gas price should greater than " + price));
                } else {
                    callback();
                }
            },
            gasLimit: (rule, value, callback) => {
                if (this.payOption.payType === "ETH" && value < ETH_LIMIT) {
                    callback("gas limit should greater than " + ETH_LIMIT);
                } else if (this.payOption.payType === "GNX" && value < GNX_LIMIT) {
                    callback("gas limit should greater than " + GNX_LIMIT);
                } else {
                    callback();
                }
            }
        };
        return {
            payFormPop: false,
            depositPop: false,
            payOption: {
                payType: "ETH",
                recipient: null,
                amount: null,
                gasPrice: 0,
                gasLimit: 0,
                password: ""
            },
            taskstate: config.TASKSTATE,
            defaultGas: {
                price: 0,
                limit: 0
            },
            payStep: 0,
            ruleInline: {
                recipient: [
                    {
                        required: true,
                        message: "Please input recipient",
                        trigger: "blur"
                    },
                    { validator: validator.recipient, trigger: "blur" }
                ],
                amount: [
                    { required: true, message: "Please input amount", trigger: "blur" },
                    { validator: validator.amount, trigger: "blur" }
                ],
                gasPrice: [
                    { required: true, message: "Please input gasPrice", trigger: "blur" },
                    { validator: validator.gasPrice, trigger: "blur" }
                ],
                gasLimit: [
                    { required: true, message: "Please input gasLimit", trigger: "blur" },
                    { validator: validator.gasLimit, trigger: "blur" }
                ],
                password: [
                    { required: true, message: "Please input password", trigger: "blur" },
                    {
                        min: 6,
                        message: "Password length must not be less than 6 bits",
                        trigger: "blur"
                    }
                ]
            }
        };
    },
    computed: {
        wallets() {
            return this.$store.state.WalletManage.wallets;
        },
        wallet() {
            return this.$store.state.CurrentWallet.wallet;
        },
        balanceEth() {
            return this.$store.state.CurrentWallet.balanceEth;
        },
        dollarEth() {
            return "9,999,999.00";
        },
        balanceGnx() {
            return this.$store.state.CurrentWallet.balanceGnx;
        },
        dollarGnx() {
            return "9,999,999.00";
        },
        txList() {
            return this.$store.state.Transaction.transactions;
        }
    },
    watch: {
        "payOption.payType"(newValue) {
            if (newValue === "ETH") this.payOption.gasLimit = ETH_SUGGEST;
            else this.payOption.gasLimit = GNX_SUGGEST;
        }
    },
    methods: {
        async nextStep() {
            try {
                await this.$refs.payOption.validate();
                this.payStep = 1;
            } catch (e) { }
        },
        async pay() {
            try {
                await this.$refs.payOption.validate();
                await this.$store.dispatch("payByCurrentWallet", this.payOption);
                this.$message("transaction submitted");
                this.resetForm();
            } catch (e) {
                this.$message.error("create transaction error: " + e);
            }
        },
        changeWallet(address) {
            this.$store.dispatch("initWallet", { address });
        },
        refreshStatus(row) {
            this.$store.commit("updateSingleTransaction", {
                transactionId: row.transactionId,
                state: config.TASKSTATE.INPROGRESS,
            });
            this.$store.dispatch("updateSingleTransactionOnline", {
                transactionId: row.transactionId,
            });
        },
        hashCheck(hash) {
            shell.openExternal(EtherscanURL + hash);
        },
        calculateGas: async function () {
            this.defaultGas.price = await getGasPrics();
            this.defaultGas.limit = ETH_SUGGEST;
        },
        payPopped() {
            function wei2Gwei(wei) {
                return utils.fromWei(wei, "Gwei");
            }
            this.payOption.gasPrice = parseInt(wei2Gwei(this.defaultGas.price));
            this.payOption.gasLimit = this.defaultGas.limit;
        },
        resetForm() {
            this.payFormPop = false;
            this.payStep = 0;
            this.$refs.payOption.resetFields();
        },
        avatarUrl(id) {
            return "avatar://" + id;
        },
        qrUrl(id) {
            return "qr://" + id;
        },
        copy(value) {
            clipboard.writeText(value);
        }
    }
};
</script>