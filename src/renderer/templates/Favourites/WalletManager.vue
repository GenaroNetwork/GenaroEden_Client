<style scoped>
.top-bar {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding: 10px;
}
.top-bar button i {
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
.top-bar h2 a {
  color: unset;
  text-decoration: unset;
}
.top-bar .folder-action {
  flex-shrink: 0;
}

/* wallets style */
.wallet-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-start;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 0 5px;
  overflow: visible;
}

.wallet {
  width: 50%;
  height: 210px;
  margin-bottom: 35px;
  box-sizing: border-box;
  padding: 0 10px;
  overflow: visible;
}

.wallet .import-wallet {
  cursor: pointer;
  border-radius: 5px;
  border: 2px dashed rgb(117, 117, 117);
  line-height: 206px;
  font-size: 30px;
  text-align: center;
  color: rgb(126, 126, 126);
}

.wallet .import-wallet i {
  margin-right: 30px;
  vertical-align: middle;
}

.wallet .card {
  height: 100%;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  border-radius: 5px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
  border: 2px solid rgb(231, 231, 231);
}

.wallet.current .card {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  border-color: rgb(88, 158, 248);
}

.wallet .card .account {
  height: 115px;
  background-image: linear-gradient(
    to right,
    rgb(234, 235, 236),
    rgb(243, 245, 248)
  );
}

.wallet .card .avatar {
  height: 80px;
  width: 80px;
  border-radius: 50%;
  float: left;
  margin: 20px auto auto 20px;
}

.wallet .card .info {
  margin-left: 120px;
  margin-right: 20px;
  padding: 20px 0;
}

.wallet .card .info > div {
  line-height: 35px;
  overflow: hidden;
}

.wallet .card .info > div > div {
  float: left;
  width: auto;
  max-width: calc(100% - 40px);
  overflow: hidden;
  text-overflow: ellipsis;
}

.wallet .card .info > div > i {
  display: none;
  cursor: pointer;
  float: left;
  line-height: inherit;
  margin-left: 10px;
}

.wallet .card .info div:hover i {
  display: block;
}

.wallet .card .actions {
  position: absolute;
  top: 25px;
  right: 0;
  overflow: hidden;
}

.wallet .card .actions i {
  float: left;
  cursor: pointer;
  margin-right: 20px;
}

.wallet .card .detail .balance {
  width: 30%;
  float: left;
  white-space: nowrap;
}
.wallet .card .detail .balance img {
  float: left;
  display: block;
  height: 40px;
  margin: 25px 20px;
  width: auto;
}
.wallet .card .detail .balance div {
  line-height: 90px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.wallet .card .detail .qr {
  float: right;
  height: 75px;
  width: 75px;
  margin: 10px 20px;
}

/* large QRCode popover */
.large-qrcode {
  display: block;
  margin: 0 auto;
}

/* import wallet style */
.choose-file {
  min-height: 125px;
  background: rgb(249, 249, 249);
  border: 1px dashed rgb(202, 202, 202);
  border-radius: 4px;
  text-align: center;
  box-sizing: border-box;
  margin-bottom: 10px;
  cursor: pointer;
}

.choose-file,
.choose-file + * {
  width: 400px;
  margin-left: auto;
  margin-right: auto;
  display: block;
}

.choose-file i {
  font-size: 40px;
  vertical-align: middle;
  line-height: 80px;
}
.choose-file div {
  line-height: 30px;
}

.import-success i {
  color: rgb(122, 186, 58);
  display: block;
  margin: 0 auto;
  line-height: 100px;
  font-size: 100px;
  text-align: center;
}
</style>
<template>

    <div class="fullheight v-flex">

        <!-- large QRCode dialog -->
        <el-dialog title="QR Code" @close="largeQRCode=null" :visible="largeQRCode!==null" center width="200px">
            <img class="large-qrcode" :src="largeQRCode">
        </el-dialog>

        <!-- reset Password dialog -->
        <el-dialog :title="$t('common.reset')" :visible.sync="changePass.show" width="590px" :close-on-click-modal="true" center @close="clearDialog('resetPassword')">
            <el-form ref="changePassFormRef" :model="changePass" :rules="ruleInline">
                <el-form-item prop="password">
                    <el-input type="password" v-model="changePass.password" :placeholder="$t('dashboard.mywallet.walletpassword')" size="small">
                    </el-input>
                </el-form-item>
                <el-form-item prop="newPassword">
                    <el-input type="password" v-model="changePass.newPassword" :placeholder="$t('common.newpasswordholder')" size="small">
                    </el-input>
                </el-form-item>
                <el-form-item prop="newPasswordRepeat">
                    <el-input type="password" v-model="changePass.newPasswordRepeat" :placeholder="$t('common.newpwdagain')" size="small">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="resetPasswordForm()" :loading="false">{{ $t('el.messagebox.cancel') }}</el-button>
                <el-button @click="submitChangePassword()" type="primary">{{ $t('common.submit') }}</el-button>
            </div>
        </el-dialog>

        <!-- submit payment -->
        <el-dialog :title="$t('dashboard.mywallet.setaspay')" :visible.sync="submitPay.show" width="590px" :close-on-click-modal="true" center @close="clearDialog('submitPayment')">
            <el-form ref="submitPayFormRef" :model="submitPay" :rules="ruleInline">
                <el-form-item prop="password">
                    <el-input type="password" v-model="submitPay.password" :placeholder="$t('dashboard.mywallet.walletpassword')" size="small">
                    </el-input>
                </el-form-item>
                <el-form-item :label="$t('dashboard.mywallet.paylimitGNX')" prop="amount">
                    <el-input type="number" v-model="submitPay.amount" :placeholder="$t('dashboard.mywallet.maxGNX')" size="small">
                    </el-input>
                </el-form-item>
                <el-alert :title="$t('dashboard.walletmanage.setDeafultCoast')" type="info" :closable="false">
                </el-alert>
            </el-form>
            <div slot="footer">
                <el-button @click="setAsPayingWallet()" type="primary">{{ $t('common.submit') }}</el-button>
            </div>
        </el-dialog>

        <!-- import wallet dialog -->
        <el-dialog :title="$t('dashboard.walletmanage.importwallet')" :visible.sync="importV3WalletDialog.shown" width="590px" center @close="clearDialog('importWallet')">
            <template v-if="importV3WalletDialog.step === 0">
                <div class="choose-file" @click="importV3Wallet().selectFile($event)">
                    <i class="material-icons">{{ importV3WalletDialog.files ? "remove" : "add" }}</i>
                    <div>{{ importV3WalletDialog.files ? importV3WalletDialog.files[0] : $t('dashboard.walletmanage.uploadjson') }}</div>
                </div>
                <el-input type="password" v-model="importV3WalletDialog.password" :placeholder="$t('dashboard.walletmanage.placeholder1')" size="small"></el-input>
                <div slot="footer">
                    <el-button @click="importV3Wallet().cancel($event)">{{ $t('el.messagebox.cancel') }}</el-button>
                    <el-button @click="importV3Wallet().submit($event)" type="primary">{{ $t('common.submit') }}</el-button>
                </div>
            </template>
            <template v-else>
                <div class="import-success">
                    <i class="material-icons">check_circle</i>
                </div>
                <div slot="footer">
                    <el-button @click="importV3Wallet().cancel($event)" type="primary">{{ $t('common.done') }}</el-button>
                </div>
            </template>
        </el-dialog>

        <div class="top-bar">
            <h2>{{ $t('dashboard.walletmanage.walletmanage') }}</h2>
            <el-button type="primary" @click="importV3WalletDialog.shown=true" size="small">{{ $t('dashboard.walletmanage.import', {name: ' Json'}) }}
                <i class="el-icon-upload el-icon--right"></i>
            </el-button>
        </div>

        <!-- wallet list -->
        <div class="wallet-list">
            <div v-for="item, index of wallets" :class="['wallet',{current: item.address === paymentWallet}]" :key="`walletId-${index}`">
                <div class="card">
                    <div class="account">
                        <img class="avatar" :src="avatarUrl(item.address)">
                        <div class="info">
                            <div>
                                <el-input size="small" :value="item.name" @blur="saveName(index, $event)" v-if="editNameIndex === index"></el-input>
                                <div v-else>{{ item.name }}</div>
                                <i class="material-icons" @click="editNameIndex = index" v-if="editNameIndex !== index">edit</i>
                            </div>
                            <div>
                                <div :title="item.address">0x{{item.address}}</div>
                                <el-tooltip :value="copiedIndex === index" content="Address Copied to ClipBoard." placement="bottom" :manual="true">
                                    <i class="material-icons" @click="copy(item.address, index)" @mouseleave="copiedIndex = -1">content_copy</i>
                                </el-tooltip>
                            </div>
                        </div>
                    </div>
                    <div class="actions">

                        <el-dropdown trigger="click" @command="moreActions">
                            <span class="el-dropdown-link">
                                <i class="material-icons">more_vert</i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item :command="{item,action:'forgetWallet'}">
                                    {{ $t('dashboard.walletmanage.deletewallet') }}
                                </el-dropdown-item>
                                <el-dropdown-item :command="{item,action:'popChangePass'}">
                                    {{ $t('dashboard.walletmanage.changepassword') }}
                                </el-dropdown-item>
                                <el-dropdown-item :command="{item,action:'exportWalletV3'}">
                                    {{ $t('dashboard.walletmanage.exportwallet') }}
                                </el-dropdown-item>
                                <el-dropdown-item :command="{item,action:'popSubmitPay'}">
                                    {{ $t('dashboard.walletmanage.setdefaultpayment') }}
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                    <div class="detail">
                        <div class="balance eth">
                            <img src="~@/assets/img/eth_colorful.svg">
                            <div class="h1" :title="balanceEth(item.address) | wei2eth | numslice"> {{ balanceEth(item.address) | wei2eth | numslice}} </div>
                        </div>
                        <div class="balance gnx">
                            <img src="~@/assets/img/gnx_colorful.svg">
                            <div class="h1" :title="balanceGnx(item.address) | wei2gnx "> {{ balanceGnx(item.address) | wei2gnx }} </div>
                        </div>
                        <!-- large QRCODE -->
                        <img class="qr" :src="qrUrl(item.address)" @click="largeQRCode=qrUrl(item.address)">
                    </div>
                </div>
            </div>
            <div class="wallet" @click.stop.prevent="importV3WalletDialog.shown=true">
                <div class="import-wallet">
                    <i class="material-icons">add</i>{{ $t('dashboard.walletmanage.import', {name: ' JSON'}) }}
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import { getGasPrice, getGasLimit, getBalanceEth, getBalanceGnx } from "../../../wallet/transactionManager";
import walletManager from "../../../wallet/walletManager";
import { utils } from "../../../wallet/web3Util";
import { clipboard } from "electron";
const { dialog } = require("electron").remote;
const fs = require("fs");
import { BRIDGE_API_URL } from "../../../config";
import { sha256hex } from '../../../lib/cryptUtil';

export default {
    created: async function () {
        let data = await this.$http.get(`${BRIDGE_API_URL}/user/${this.$store.state.User.username}`, {
            auth: {
                username: this.$store.state.User.username,
                password: sha256hex(this.$store.state.User.password),
            }
        });
        // this.$store.dispatch("walletListSetPayment", { address: data.data.wallet });
    },
    mounted: function () {
        // init balance
        //this.$store.dispatch('loadBalance')
    },
    data: function () {
        return {
            copiedIndex: -1,
            editNameIndex: -1,
            largeQRCode: null,
            changePass: {
                show: false,
                address: null,
                password: null,
                newPassword: null,
                newPasswordRepeat: null
            },
            passwordError: {
                deleteWallet: null
            },
            submitPay: {
                show: false,
                password: "",
                amount: 100
            },
            importV3WalletDialog: {
                shown: false,
                step: 0,
                password: null,
                files: null,
            },
            ruleInline: {
                password: [
                    { required: true, message: "Please input password", trigger: "blur" }
                ],
                newPassword: [
                    { required: true, message: "Please input password", trigger: "blur" },
                    {
                        type: "string",
                        min: 6,
                        message: "Password length must not be less than 6 bits",
                        trigger: "blur"
                    }
                ],
                newPasswordRepeat: [
                    {
                        validator: (rule, value, callback) => {
                            if (value === "") {
                                callback(new Error(this.$t('common.inputpwdagain')));
                            } else if (value !== this.changePass.newPassword) {
                                callback(new Error(this.$t('common.pwdmismatch')));
                            } else {
                                callback();
                            }
                        },
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
        paymentWallet() {
            return this.$store.state.WalletList.paymentWallet;
        },
        balanceEth() {
            return address => this.$store.state.WalletList.balances.eth[address];
        },
        dollarEth() {
            return "9,999,999.00";
        },
        balanceGnx() {
            return address => this.$store.state.WalletList.balances.gnx[address];
        },
        dollarGnx() {
            return "9,999,999.00";
        }
    },
    methods: {
        clearDialog(name) {
            switch (name) {
                case "resetPassword":
                    this.changePass.address = null;
                    this.changePass.password = null;
                    this.changePass.newPassword = null;
                    this.changePass.newPasswordRepeat = null;
                    this.$refs.changePassFormRef.clearValidate();
                    break;
                case "submitPayment":
                    this.submitPay.password = null;
                    break;
                case "importWallet":
                    break;
                case "deleteWallet":
                    this.passwordError.deleteWallet = e.message;
                    break;
            }
        },
        moreActions({ action, item }) {
            this[action](item);
        },
        restore() { },
        importV3Wallet() {
            return {
                selectFile: () => {
                    this.importV3WalletDialog.files = dialog.showOpenDialog({ properties: ["openFile"] });
                },
                submit: () => {
                    if (this.importV3WalletDialog.files && this.importV3WalletDialog.files.length > 0) {
                        const filePath = this.importV3WalletDialog.files[0]
                        this.$store
                            .dispatch("walletListImportV3", { filePath, password: this.importV3WalletDialog.password })
                            .then(() => {
                                this.importV3WalletDialog.step = 1;
                            })
                            .catch(e => {
                                this.$message.error("Error: " + e.message);
                            });
                    }
                },
                cancel: () => {
                    this.importV3WalletDialog.shown = false;
                    this.importV3WalletDialog.step = 0;
                    this.importV3WalletDialog.password = null;
                }
            }
        },
        async forgetWallet(item) {
            this.passwordError.deleteWallet = null;
            let value = await this.$prompt("Password (of wallet):", "Delete Wallet", {
                confirmButtonText: this.$t('el.messagebox.confirm'),
                cancelButtonText: this.$t('el.messagebox.cancel'),
                inputType: "password",
            });
            try {
                await this.$store.dispatch("walletListDelete", { address: item.address, password: value.value });
            } catch (e) {
                this.$message.error(e.message);
            }
        },
        saveName(index, event) {
            this.editNameIndex = -1;
            this.$store.dispatch("walletListUpdateName", {
                address: this.wallets[index].address,
                name: event.target.value,
            });
        },
        popChangePass(item) {
            this.changePass.show = true;
            this.changePass.address = item.address;
        },
        resetPasswordForm() {
            this.changePass.show = false;
            this.changePass.address = "";
            this.changePass.password = "";
            this.changePass.newPassword = "";
            this.changePass.newPasswordRepeat = "";
        },
        async submitChangePassword() {
            try {
                let validated = await this.$refs.changePassFormRef.validate();
                if (!validated) return;
                await this.$store.dispatch("walletListChangePassword", {
                    address: this.changePass.address,
                    password: this.changePass.password,
                    newPassword: this.changePass.newPassword
                })
                this.$message.success("Password Changed");
                this.resetPasswordForm();
            } catch (e) {
                this.$message.error(e.message);
            }
        },
        copy(value, index) {
            clipboard.writeText(`0x${value}`);
            this.copiedIndex = index;
        },
        async exportWalletV3(item) {
            try {
                let { value } = await this.$prompt("Password:", "Export Wallet", {
                    confirmButtonText: "Export",
                    cancelButtonText: this.$t('el.messagebox.cancel'),
                    inputType: "password"
                });

                const passwordOk = await walletManager.validateWalletPassword(
                    item.address,
                    value
                );
                if (passwordOk) {
                    const v3 = await walletManager.exportV3Json(item.address);
                    dialog.showSaveDialog(
                        {
                            title: "Export Wallet",
                            defaultPath: "./" + item.name + ".wallet.json"
                        },
                        path => {
                            if (path != undefined && path.length > 0) {
                                fs.writeFile(path, v3, err => {
                                    if (err) {
                                        this.$message.error(err);
                                    } else {
                                        this.$message.success("Wallet exported");
                                    }
                                });
                            }
                        }
                    );
                }
            } catch (e) {
                this.$message.error(e.message);
            };
        },
        popSubmitPay: async function (item) {
            this.submitPay.show = true;
            this.submitPay.address = item.address;
        },
        resetSubmitPayForm() {
            this.submitPay.show = false
            this.submitPay.address = ""
            this.submitPay.password = ""
            this.submitPay.amount = 0
        },
        setAsPayingWallet: async function () {
            const password = this.submitPay.password
            const gasPrice = getGasPrice()
            const amount = this.submitPay.amount

            const loading = this.$loading({
                lock: true,
                text: 'Please wait while executing smart contract, this will take up to 3 minutes.',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            this.$store
                .dispatch("walletListSetPayment", { address: this.submitPay.address, password, amount, gasPrice })
                .then(() => {
                    this.$message({
                        type: "success",
                        message: `now your payment wallet is 0x${this.submitPay.address}`
                    });
                    this.resetSubmitPayForm()
                    loading.close()
                })
                .catch(e => {
                    this.$message.error("Error: " + e)
                    this.resetSubmitPayForm()
                    loading.close()
                });
        },
        avatarUrl(id) {
            return "avatar://" + id;
        },
        qrUrl(id) {
            return "qr://" + id;
        }
    }
};
</script>