<style scoped>
/* common-style */
.common-link {
  cursor: pointer;
  text-decoration: none;
  color: #3498db;
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
  flex-shrink: 0;
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
  content: "";
  pointer-events: none;
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
  background-image: url(~@/assets/img/gnx_white.svg);
  background-size: 50px auto;
}

.banner .gnx:after {
  background-image: url(~@/assets/img/gnx_blue.svg);
  background-size: 180px auto;
}

.banner .eth {
  background-image: linear-gradient(to right bottom, #c4c4c4, #a2a2a2);
}

.banner .eth:before {
  background-image: url(~@/assets/img/eth_white.svg);
  background-size: 28px auto;
}

.banner .eth:after {
  background-image: url(~@/assets/img/eth_gray.svg);
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
.banner .account .actions > button {
  width: 40%;
  min-width: 100px;
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

.history-icon {
  white-space: nowrap;
}

.history-icon > i {
  display: inline-block;
  vertical-align: middle;
}
.transactions /deep/ .word-wrap .cell {
  word-break: break-word;
}
.transactions /deep/ .no-wrap .cell {
  white-space: nowrap;
}
</style>
<template>
    <div class="fullheight right-container v-flex">

        <!-- transfer popup -->
        <el-popover ref="payFormPop" v-model="payFormPop" placement="bottom" width="350" trigger="click" @show="payPopped">
            <el-form ref="payOption" status-icon :model="payOption" :rules="ruleInline" @submit.native.prevent>
                <template v-if="payStep === 0">
                    <el-form-item prop="recipient">
                        <el-input type="text" v-model="payOption.recipient" :placeholder="$t('dashboard.mywallet.recipientaddress')" size="mini">
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="amount">
                        <el-input type="number" v-model="payOption.amount" :placeholder="$t('dashboard.mywallet.amount')" size="mini" min="0">
                            <el-select v-model="payOption.payType" :placeholder="$t('common.choose')" slot="append">
                                <el-option key="ETH" :label="$t('dashboard.mywallet.ETH')" value="ETH"></el-option>
                                <el-option key="GNX" :label="$t('dashboard.mywallet.GNX')" value="GNX"></el-option>
                            </el-select>
                        </el-input>
                    </el-form-item>
                    <el-form-item :label="$t('dashboard.mywallet.gasprice')" prop="gasPrice">
                        <el-input type="number" v-model="payOption.gasPrice" :placeholder="$t('dashboard.mywallet.gaspriceholder')" size="mini">
                        </el-input>
                    </el-form-item>
                    <el-form-item :label="$t('dashboard.mywallet.gaslimit')" prop="gasLimit">
                        <el-input type="number" v-model="payOption.gasLimit" :placeholder="$t('dashboard.mywallet.gaslimitholder')" size="mini">
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="nextStep" type="primary">{{ $t('common.next') }}</el-button>
                    </el-form-item>
                </template>
                <template v-if="payStep === 1">
                    <el-row>
                        <el-col :span="10" class="preview-label">{{ $t('dashboard.mywallet.sendaddress') }}:</el-col>
                        <el-col :span="14" class="preview-value">{{ wallet.address }}</el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="10" class="preview-label">{{ $t('dashboard.mywallet.recipientaddress') }}:</el-col>
                        <el-col :span="14" class="preview-value">{{ payOption.recipient }}</el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="10" class="preview-label">{{ $t('dashboard.mywallet.amount') }}:</el-col>
                        <el-col :span="14" class="preview-value">{{ payOption.amount }}</el-col>
                    </el-row>
                    <el-form-item :label="$t('dashboard.mywallet.walletpassword')" prop="password" key="password">
                        <el-input type="password" :disabled="payLoading" v-model="payOption.password" :placeholder="$t('dashboard.mywallet.walletpassword')" :error="passwordError">
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="payFormPop = false">{{ $t('el.messagebox.cancel') }}</el-button>
                        <el-button @click="pay()" type="primary" :disabled="payLoading">{{ $t('common.submit') }}</el-button>
                    </el-form-item>
                </template>
            </el-form>
        </el-popover>

        <!-- Deposit popup -->
        <el-popover ref="depositPop" placement="bottom" width="350" trigger="click" v-model="depositPop">
            <div class="deposit-pop">
                <el-input type="text" :disabled="true" :value="`0x${wallet.address}`">
                </el-input>
                <img :src="'qr://' + wallet.address">
                <div class="actions">
                    <el-button class="btn" size="small" @click="depositPop=false">{{ $t('el.messagebox.cancel') }}</el-button>
                    <el-button class="btn" type="primary" size="small" @click="copy(wallet.address)">{{ $t('dashboard.mywallet.copyaddress') }}</el-button>
                </div>
            </div>
        </el-popover>

        <!-- banner info -->
        <div class="banner">
            <div class="blank"></div>
            <div class="balance gnx">
                <div>
                    <span :title="balanceGnx">{{balanceGnx | wei2gnx}}</span>
                    <span class="unit">{{ $t('dashboard.mywallet.GNX') }}</span>
                </div>
                <!-- <div>≈${{ dollarGnx }}</div> -->
            </div>
            <div class="blank"></div>
            <div class="balance eth">
                <div>
                    <span :title="balanceEth">{{balanceEth | wei2eth | numslice}}</span>
                    <span class="unit">{{ $t('dashboard.mywallet.ETH') }}</span>
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
                                {{ wallet.name }}
                                <i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item v-for="wallet, index of wallets" :command="wallet.address" :key="`walletId-${index}`">
                                    {{ wallet.name }}
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </h2>
                    <div>
                        <span :title="wallet.address">0x{{wallet.address}}</span>
                        <span class="copy">
                            <el-tooltip :value="copiedPopup" :content="$t('dashboard.mywallet.addresscopied')" placement="bottom" :manual="true">
                                <i class="material-icons" @click="copy(wallet.address)" @mouseleave="copiedPopup=false">content_copy</i>
                            </el-tooltip>
                        </span>
                    </div>
                </div>
                <div class="actions">
                    <el-button class="btn" v-popover:depositPop type="primary" size="small">{{ $t('dashboard.mywallet.deposit') }}</el-button>
                    <el-button class="btn" v-popover:payFormPop type="primary" size="small">{{ $t('dashboard.mywallet.transfer') }}</el-button>
                </div>
            </div>
            <div class="blank"></div>
        </div>

        <!-- transaction history -->
        <div class="">
            <el-table :data="txList" class="transactions" row-class-name="file-row">
                <el-table-column prop="state" label="" width="60" class-name="no-wrap">
                    <template slot-scope="scope">
                        <div class="history-icon">
                            <i class="material-icons state-icon" :state="scope.row.state" v-if="scope.row.state === TASK_STATE.INIT || scope.row.state === TASK_STATE.INPROGRESS">
                                remove_circle_outline
                            </i>
                            <i class="material-icons state-icon" :state="scope.row.state" v-else-if="scope.row.state === TASK_STATE.ERROR">
                                error_outline
                            </i>
                            <i class="material-icons state-icon" :state="scope.row.state" v-else>
                                add_circle_outline
                            </i>
                            <i class="material-icons state-icon common-link" @click="refreshStatus(scope.row)" v-if="scope.row.state === TASK_STATE.ERROR">
                                refresh
                            </i>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="hash" :label="$t('dashboard.mywallet.hash')" :show-overflow-tooltip="true" class-name="no-wrap">
                    <template slot-scope="scope">
                        <a class="common-link" href="#" @click="hashCheck(scope.row.hash)">{{ scope.row.hash }}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="receipt.blockNumber" :label="$t('dashboard.mywallet.block')" class-name="no-wrap"></el-table-column>
                <el-table-column prop="created" :label="$t('dashboard.mywallet.created')" class-name="word-wrap">
                    <template slot-scope="scope">
                        {{ scope.row.created | formatTime }}
                    </template>
                </el-table-column>
                <el-table-column prop="from" :label="$t('dashboard.mywallet.from')" class-name="no-wrap" :show-overflow-tooltip="true">
                    <template slot-scope="scope">0x{{scope.row.from}}</template>
                </el-table-column>
                <el-table-column prop="recipient" :label="$t('dashboard.mywallet.to')" class-name="no-wrap" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="amount" :label="$t('dashboard.mywallet.amount')" class-name="no-wrap"></el-table-column>
                <el-table-column prop="payType" label="Token" class-name="no-wrap"></el-table-column>
                <span slot="empty">{{ $t('dashboard.mywallet.notransactions') }}</span>
            </el-table>
        </div>
    </div>
</template>

<script>
import { getGasPrice, getGasLimit } from "../../../wallet/transactionManager";
import { utils, EtherscanURL, web3 } from "../../../wallet/web3Util";
import { clipboard, shell } from "electron";
import { TASK_STATE } from "../../../config.js";

const GNX_LIMIT = 120000;
const GNX_SUGGEST = 150000;
const ETH_LIMIT = 21000;
const ETH_SUGGEST = 21000;

export default {
    async created() {
        const address = this.$route.params.walletAddress;
        this.$store.dispatch("loadTransactions");
        this.$store.dispatch("walletListSetCurrent", { address: this.$store.getters.currentWallet.address })
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
                    callback(new Error(this.$t('dashboard.mywallet.accounterrmsg')));
                } else {
                    callback();
                }
            },
            amount: (rule, value, callback) => {
                let balance;
                switch (this.payOption.payType) {
                    case "ETH":
                        balance = parseInt(this.balanceEth);
                        if (utils.toWei(value) > balance) {
                            callback(new Error(this.$t('dashboard.mywallet.amounterrmsg')));
                        } else {
                            callback();
                        }
                        break;

                    case "GNX":
                        balance = this.balanceGnx;
                        if (value * Math.pow(10, 9) > balance) {
                            callback(new Error(this.$t('dashboard.mywallet.amounterrmsg')));
                        } else {
                            callback();
                        }
                        break;

                    default:
                        callback(new Error(this.$t('dashboard.mywallet.paterrmsg')));
                        break;
                }
            },
            gasPrice: async (rule, value, callback) => {
                if (value.toString().trim() === "") {
                    callback(new Error(this.$t('dashboard.mywallet.gaspricemsg')));
                }
                let price = await getGasPrice();
                price = utils.fromWei(price.toString(), "Gwei");
                if (parseInt(value) < parseInt(price)) {
                    callback(new Error(this.$t('dashboard.mywallet.gaspriceerrmsg', { price })));
                } else {
                    callback();
                }
            },
            gasLimit: (rule, value, callback) => {
                if (value.toString().trim() === "") {
                    callback(new Error(this.$t('dashboard.mywallet.gaslimitmsg')));
                }
                if (this.payOption.payType === "ETH" && value < ETH_LIMIT) {
                    callback(this.$t('dashboard.mywallet.gaslimiterrmsg', { limit: ETH_LIMIT }));
                } else if (this.payOption.payType === "GNX" && value < GNX_LIMIT) {
                    callback(this.$t('dashboard.mywallet.gaslimiterrmsg', { limit: GNX_LIMIT }));
                } else {
                    callback();
                }
            }
        };
        return {
            TASK_STATE,
            payFormPop: false,
            depositPop: false,
            copiedPopup: false,
            payOption: {
                payType: "ETH",
                recipient: null,
                amount: null,
                gasPrice: 0,
                gasLimit: 0,
                password: null
            },
            passwordError: null,
            defaultGas: {
                price: 0,
                limit: 0
            },
            payStep: 0,
            payLoading: false,
            ruleInline: {
                recipient: [
                    {
                        required: true,
                        message: this.$t('dashboard.mywallet.recipientmsg'),
                        trigger: "blur"
                    },
                    { validator: validator.recipient, trigger: "blur" }
                ],
                amount: [
                    { required: true, message: this.$t('dashboard.mywallet.amountmsg'), trigger: "blur" },
                    { validator: validator.amount, trigger: "blur" }
                ],
                gasPrice: [
                    { validator: validator.gasPrice, trigger: "blur" }
                ],
                gasLimit: [
                    { validator: validator.gasLimit, trigger: "blur" }
                ],
                password: [
                    { required: true, message: this.$t("common.inputpwd"), trigger: "blur" },
                    {
                        min: 6,
                        message: this.$t("common.pwdlength"),
                        trigger: "blur"
                    }
                ]
            }
        };
    },
    computed: {
        wallets() {
            return this.$store.state.WalletList.wallets;
        },
        wallet() {
            return this.$store.getters.currentWallet;
        },
        balanceEth() {
            return this.$store.getters.currentWalletEth;
        },
        dollarEth() {
            return "9,999,999.00";
        },
        balanceGnx() {
            return this.$store.getters.currentWalletGnx;
        },
        dollarGnx() {
            return "9,999,999.00";
        },
        txList() {
            return this.$store.getters.transactionsByWallet;
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
            this.payLoading = true;
            try {
                await this.$refs.payOption.validate();
                await this.$store.dispatch("walletListPayByCurrent", this.payOption);
                this.$message(this.$t("dashboard.mywallet.transactionsubmitted"));
            } catch (e) {
                if (e.messgae === "Key derivation failed - possibly wrong passphrase") this.passwordError = "Wrong Password.";
                else this.$message.error(this.$t("dashboard.mywallet.createtransactionerr", { error: e.message }));
            } finally {
                this.payLoading = false;
            }
        },
        changeWallet(address) {
            this.$store.dispatch("walletListSetCurrent", { address });
        },
        refreshStatus(row) {
            this.$store.commit("updateSingleTransaction", {
                transactionId: row.transactionId,
                state: TASK_STATE.INPROGRESS,
            });
            this.$store.dispatch("updateSingleTransactionOnline", {
                transactionId: row.transactionId,
            });
        },
        hashCheck(hash) {
            shell.openExternal(EtherscanURL + hash);
        },
        async calculateGas() {
            this.defaultGas.price = await getGasPrice();
            this.defaultGas.limit = ETH_SUGGEST;
        },
        payPopped() {
            this.payStep = 0;
            this.payOption.recipient = null;
            this.payOption.amount = null;
            this.payOption.payType = "ETH";
            this.payOption.password = null;
            this.payOption.gasPrice = parseInt(utils.fromWei(this.defaultGas.price.toString(), "Gwei"));
            this.payOption.gasLimit = this.defaultGas.limit;
            this.passwordError = null;
            this.$refs.payOption.clearValidate();
        },
        avatarUrl(id) {
            return "avatar://" + id;
        },
        qrUrl(id) {
            return "qr://" + id;
        },
        copy(value) {
            clipboard.writeText(`0x${value}`);
            this.copiedPopup = true;
        }
    }
};
</script>