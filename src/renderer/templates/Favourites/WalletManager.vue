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
  position: relative;
}
.row1 {
    background-color: #e9eaec;
}
.avatar {
    border-radius: 50%;
    width: 128px;
    height: 128px;
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
.actions a{
    cursor: pointer;
}
</style>
<template>
    <div class="fullheight v-flex">

        <el-dialog :visible.sync="changePass.show" width="500" :close-on-click-modal="true">
            <el-form ref="changePassFormRef" :model="changePass" :rules="ruleInline">
                <div>
                    <el-form-item label="Wallet Password" prop="password">
                        <el-input type="password" v-model="changePass.password" placeholder="Wallet Password">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="New Password" prop="newPassword">
                        <el-input type="password" v-model="changePass.newPassword" placeholder="New Password">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="New Password Again" prop="newPasswordRepeat">
                        <el-input type="password" v-model="changePass.newPasswordRepeat" placeholder="New Password Again">
                        </el-input>
                    </el-form-item>
                    <div>
                        <el-form-item>
                            <el-button @click="submitChangePassword()" class="" type="primary" :loading="false">Submit</el-button>
                            <el-button @click="resetPasswordForm()" class="" type="primary" :loading="false">Cancel</el-button>
                        </el-form-item>
                    </div>
                </div>
            </el-form>
        </el-dialog>
        
        <div class="top-bar">
            <h2>Wallet Manage</h2>
            <el-button type="primary" @click="importV3Wallet" size="small">Import Json<i class="el-icon-upload el-icon--right"></i></el-button>
            <el-button type="primary" @click="restore" size="small">Restore<i class="el-icon-upload el-icon--right"></i></el-button>
        </div>
        <!-- transaction -->
        <div class="flex flex-grow wallet-list">
            <div v-for="item in wallets" class="wallet" @click="">
                <div class="actions flex">
                    <a class="" @click.stop.prevent="forgetWallet(item)"><i class="material-icons">close</i></a>
                    <a class="" @click.stop.prevent="popChangePass(item)"><i class="material-icons">vpn_key</i></a>
                    <a class="" @click.stop.prevent="exportWalletV3(item)"><i class="material-icons">open_in_new</i></a>
                </div>
                <div class="flex row1">
                    <img class="avatar" :src="avatarUrl(item.address)" >
                    <div class="v-flex">
                        <span>{{item.name}}</span>
                        <span>{{item.address}}</span>
                    </div>
                </div>
                <div class="flex row2">
                    <!-- balance -->
                    <div></div>
                    <!-- qr -->
                    <img class="qr" :src="qrUrl(item.address)" >
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {getGasPrics, getGasLimit} from '../../../wallet/transactionManager'
import walletManager from '../../../wallet/walletManager'
import {utils} from '../../../wallet/web3Util'
const {dialog} = require('electron').remote
const fs = require('fs')

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
            changePass: {
                show: false,
                address: '',
                password: '',
                newPassword: '',
                newPasswordRepeat: ''
            },
            ruleInline: {
                password: [
                    { required: true, message: 'Please input password', trigger: 'blur' },
                    { type: 'string', min: 6, message: 'Password length must not be less than 6 bits', trigger: 'blur' }
                ],
                newPassword: [
                    { required: true, message: 'Please input password', trigger: 'blur' },
                    { type: 'string', min: 6, message: 'Password length must not be less than 6 bits', trigger: 'blur' }
                ],
                newPasswordRepeat: [
                    { validator: (rule, value, callback) => {
                        if (value === '') {
                            callback(new Error('Please enter your password again'));
                        } else if (value !== this.changePass.newPassword) {
                            callback(new Error('The two input passwords do not match!'));
                        } else {
                            callback();
                        }
                    }, trigger: 'blur' }
                ]
            }
        }
    },
    computed: {
        wallets() {
            return this.$store.state.WalletManage.wallets
        }
    },
    methods: {
        restore() {
        },
        importV3Wallet() {
            let this2 = this
            const {dialog} = require('electron').remote
            const files = dialog.showOpenDialog({properties: ['openFile']})

            if (files && files.length > 0) {
                const filePath = files[0]
                this.$prompt('Password:', 'Import Wallet', {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    inputType: 'password'
                }).then(({ value }) => {
                    this.$store.dispatch('importV3Wallet', {filePath, password: value}).then(() => {
                        this.$message({
                            type: 'success',
                            message: 'import success: '
                        });
                    }).catch( e => {
                        this.$message.error('Error: ' + e);
                    })
                })
            }
        },
        forgetWallet(item) {
            const this2 = this

            this.$prompt('Password:', 'Forget Wallet', {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                inputType: 'password'
            }).then(({ value }) => {
                this.$store.dispatch('forgetWallet', {address: item.address, password: value}).catch(e => {
                    this2.$message.error(e)
                })
            })
        },
        popChangePass(item) {
            this.changePass.show = true
            this.changePass.address = item.address
        },
        resetPasswordForm() {
            this.changePass.show = false
            this.changePass.address = ''
            this.changePass.password = ''
            this.changePass.newPassword = ''
            this.changePass.newPasswordRepeat = ''
        },
        submitChangePassword() {
            const this2 = this
            this.$store.dispatch('changePassword', {
                address: this.changePass.address, 
                password: this.changePass.password, 
                newPassword: this.changePass.newPassword
            }).then(()=>{
                this2.$message.success('Password Changed')
                this2.resetPasswordForm()
            }).catch( e => {
                console.log(e)
                this2.$message.error(e.message)
            })
        },
        exportWalletV3: async function(item) {
            const this2 = this
            this.$prompt('Password:', 'Export Wallet', {
                confirmButtonText: 'Export',
                cancelButtonText: 'Cancel',
                inputType: 'password'
            }).then(async ({ value }) => {
                const passwordOk = await walletManager.validateWalletPassword(item.address, value)
                if(passwordOk) {
                    const v3 = await walletManager.exportV3Json(item.address)
                    dialog.showSaveDialog({
                        title: 'Export Wallet',
                        defaultPath: './' + item.name +'.wallet.json'
                    }, (path) => {
                        if(path != undefined && path.length > 0) {
                            fs.writeFile(path, v3, function(err) {
                                if(err) {
                                    this2.$message.error(err)
                                } else {
                                    this2.$message.success('Wallet exported')
                                }
                            }); 
                        }
                    })
                }
            }).catch(e => {
                this2.$message.error(e)
            })
        },
        avatarUrl(id) {
            return 'avatar://'+id
        },
        qrUrl(id) {
            return 'qr://'+id
        }
    }
}
</script>