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

.qr {
  width: 64px;
  height: 64px;
}
.actions {
  position: absolute;
  right: 0;
  top: 0;
}
.actions a {
  cursor: pointer;
}

/* wallets style */
.wallet-list {
  display: flex;
  flex-direction: row;
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

.wallet.import-wallet {
  cursor: pointer;
  border-radius: 5px;
  border: 2px dashed rgb(117, 117, 117);
  line-height: 206px;
  font-size: 30px;
  text-align: center;
  color: rgb(126, 126, 126);
}

.wallet.import-wallet i {
  margin-right: 30px;
  vertical-align: middle;
}

.wallet .card {
  height: 100%;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
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
  max-width: calc(100% - 30px);
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
  top: 10px;
  right: 10px;
  overflow: hidden;
}

.wallet .card .actions i {
  float: left;
  cursor: pointer;
  margin-right: 20px;
}

.wallet .card .detail .balance {
  float: left;
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
</style>
<template>

    <div class="fullheight v-flex">

        <el-dialog title="QR Code" @close="largeQRCode=null" :visible="largeQRCode!==null" center width="200px">
            <img class="large-qrcode" :src="largeQRCode">
        </el-dialog>

        <el-dialog title="Reset Password" :visible.sync="changePass.show" width="500" :close-on-click-modal="true" center>
            <el-form ref="changePassFormRef" :model="changePass" :rules="ruleInline">
                <div>
                    <el-form-item prop="password">
                        <el-input type="password" v-model="changePass.password" placeholder="Wallet Password" size="small">
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="newPassword">
                        <el-input type="password" v-model="changePass.newPassword" placeholder="New Password" size="small">
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="newPasswordRepeat">
                        <el-input type="password" v-model="changePass.newPasswordRepeat" placeholder="New Password Again" size="small">
                        </el-input>
                    </el-form-item>
                </div>
            </el-form>
            <div slot="footer">
                <el-button @click="resetPasswordForm()" :loading="false">Cancel</el-button>
                <el-button @click="submitChangePassword()" type="primary" :loading="false">Submit</el-button>
            </div>
        </el-dialog>

        <div class="top-bar">
            <h2>Wallet Manage</h2>
            <el-button type="primary" @click="importV3Wallet" size="small">Import Json
                <i class="el-icon-upload el-icon--right"></i>
            </el-button>
            <!-- 
            <el-button type="primary" @click="restore" size="small">Restore<i class="el-icon-upload el-icon--right"></i></el-button>
            -->
        </div>

        <!-- wallet list -->
        <div class="wallet-list">
            <div v-for="item, index in wallets" :class="{wallet: true, current: index === 0}">
                <div class="card">
                    <div class="account">
                        <img class="avatar" :src="avatarUrl(item.address)">
                        <div class="info">
                            <div>
                                <el-input size="small" v-model="item.name" @blur="saveName(index)" v-if="editNameIndex === index"></el-input>
                                <div v-else>{{ item.name }}</div>
                                <i class="material-icons" @click="editNameIndex = index" v-if="editNameIndex !== index">edit</i>
                            </div>
                            <div>
                                <div :title="item.address">{{item.address}}</div>
                                <i class="material-icons" @click="copy(item.address)">content_copy</i>
                            </div>
                        </div>
                    </div>
                    <div class="actions">
                        <i @click.stop.prevent="forgetWallet(item)" class="material-icons">delete</i>
                        <i @click.stop.prevent="popChangePass(item)" class="material-icons">vpn_key</i>
                        <i @click.stop.prevent="exportWalletV3(item)" class="material-icons">open_in_new</i>
                        <i @click.stop.prevent="setAsPayingWallet(item)" class="material-icons">open_in_new</i>
                    </div>
                    <div class="detail">
                        <div class="balance eth">
                            <img src="">
                            <div class="h1"> {{ balanceEth(item.address) | wei2eth}} </div>
                            <div class="p"> {{ balanceEth(item.address) | wei2gnx}} </div>
                        </div>
                        <!-- large QRCODE -->
                        <img class="qr" :src="qrUrl(item.address)" @click="largeQRCode=qrUrl(item.address)">
                    </div>
                </div>
            </div>
            <div class="wallet import-wallet" @click.stop.prevent="importV3Wallet">
                <i class="material-icons">add</i>import wallet
            </div>
        </div>

    </div>
</template>

<script>
import { getGasPrics, getGasLimit, getBalanceEth, getBalanceGnx } from "../../../wallet/transactionManager";
import walletManager from "../../../wallet/walletManager";
import { utils } from "../../../wallet/web3Util";
import { clipboard } from "electron";
const { dialog } = require("electron").remote;
const fs = require("fs");

export default {
    created: async function () {
        await this.$store.dispatch("loadAllWallets");
        await this.$store.dispatch("loadAllWalletsBalances");
    },
    mounted: function () {
        // init balance
        //this.$store.dispatch('loadBalance')
    },
    data: function () {
        return {
            editNameIndex: -1,
            largeQRCode: null,
            changePass: {
                show: false,
                address: "",
                password: "",
                newPassword: "",
                newPasswordRepeat: ""
            },
            ruleInline: {
                password: [
                    { required: true, message: "Please input password", trigger: "blur" },
                    {
                        type: "string",
                        min: 6,
                        message: "Password length must not be less than 6 bits",
                        trigger: "blur"
                    }
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
                                callback(new Error("Please enter your password again"));
                            } else if (value !== this.changePass.newPassword) {
                                callback(new Error("The two input passwords do not match!"));
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
            return this.$store.state.WalletManage.wallets;
        },
        balanceEth() {
            return address => this.$store.state.WalletManage.balances.eth[address];
        },
        dollarEth() {
            return "9,999,999.00";
        },
        balanceGnx() {
            return address => this.$store.state.WalletManage.balances.gnx[address];
        },
        dollarGnx() {
            return "9,999,999.00";
        }
    },
    methods: {
        restore() { },
        importV3Wallet() {
            let this2 = this;
            const { dialog } = require("electron").remote;
            const files = dialog.showOpenDialog({ properties: ["openFile"] });

            if (files && files.length > 0) {
                const filePath = files[0];
                this.$prompt("Password:", "Import Wallet", {
                    confirmButtonText: "OK",
                    cancelButtonText: "Cancel",
                    inputType: "password"
                }).then(({ value }) => {
                    this.$store
                        .dispatch("importV3Wallet", { filePath, password: value })
                        .then(() => {
                            this.$message({
                                type: "success",
                                message: "import success: "
                            });
                        })
                        .catch(e => {
                            this.$message.error("Error: " + e);
                        });
                });
            }
        },
        forgetWallet(item) {
            const this2 = this;

            this.$prompt("Password:", "Forget Wallet", {
                confirmButtonText: "OK",
                cancelButtonText: "Cancel",
                inputType: "password"
            }).then(({ value }) => {
                this.$store
                    .dispatch("forgetWallet", { address: item.address, password: value })
                    .catch(e => {
                        this2.$message.error(e);
                    });
            });
        },
        saveName(index) {
            this.editNameIndex = -1;
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
        submitChangePassword() {
            const this2 = this;
            this.$store
                .dispatch("changePassword", {
                    address: this.changePass.address,
                    password: this.changePass.password,
                    newPassword: this.changePass.newPassword
                })
                .then(() => {
                    this2.$message.success("Password Changed");
                    this2.resetPasswordForm();
                })
                .catch(e => {
                    console.log(e);
                    this2.$message.error(e.message);
                });
        },
        copy(value) {
            clipboard.writeText(value);
        },
        exportWalletV3: async function (item) {
            const this2 = this;
            this.$prompt("Password:", "Export Wallet", {
                confirmButtonText: "Export",
                cancelButtonText: "Cancel",
                inputType: "password"
            }).then(async ({ value }) => {
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
                                fs.writeFile(path, v3, function (err) {
                                    if (err) {
                                        this2.$message.error(err);
                                    } else {
                                        this2.$message.success("Wallet exported");
                                    }
                                });
                            }
                        }
                    );
                }
            }).catch(e => {
                this2.$message.error(e);
            });
        },
        setAsPayingWallet: async function (item) {
            const this2 = this;
            const {value} = await this.$prompt("Password:", "Set As Paying Wallet", {
                confirmButtonText: "Export",
                cancelButtonText: "Cancel",
                inputType: "password"
            })
            const password = value
            this.$store
                .dispatch("setAsPayingWallet", { address: item.address, password })
                .then(() => {
                    this.$message({
                        type: "success",
                        message: `now your payment wallet is 0x${item.address}`
                    });
                })
                .catch(e => {
                    this.$message.error("Error: " + e);
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