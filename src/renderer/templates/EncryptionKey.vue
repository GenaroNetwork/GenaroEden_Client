<style scoped>
.content {
  width: 700px;
  margin: 100px auto;
  text-align: center;
  font-size: 16px;
}
.content img.explain-img {
  width: 200px;
  height: auto;
  margin: 40px auto;
}
.back-btn {
  left: 3px;
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
}
.navigation {
  position: relative;
}
h1 {
  font-weight: normal;
  font-size: 16px;
}
h2 {
  font-weight: normal;
  font-size: 20px;
}
.desc {
  margin: 2em auto;
}
.desc p {
  text-align: left;
  margin: 30px auto;
  color: #949494;
}
.main-area {
  padding: 0 60px;
}
div.key-area {
  background-color: #ececec;
  padding: 10px;
  border-radius: 4px;
  text-align: left;
}
.action-area {
  margin: 30px auto;
}
.key-action {
  margin-top: 10px;
  text-align: center;
}
</style>

<template>
    <div class="content">
        <el-card v-if="showPage === 'newOrReturn'">
            <div class="navigation clearfix" slot="header">
                <h1>Set Encryption Key</h1>
            </div>
            <div class='newOrReturn'>
                <img class="explain-img" src="~@/assets/img/key_generate.png">
                <br>
                <el-button type="primary" @click="gotoGenerate()" long>I'm a new user and I don't have an Encryption Key, generate now</el-button>
                <br>
                <el-button type="text" @click="gotoInput()" long>I already have an Encryption Key, go to input</el-button>
            </div>
        </el-card>
        <el-card v-if="showPage === 'generate'">
            <div class="navigation clearfix" slot="header">
                <el-button class="back-btn" type="text" @click="gotoNewOrReturn()" icon="el-icon-arrow-left">Back</el-button>
                <h1>Set Encryption Key</h1>
            </div>
            <div class='main-area'>
                <div class="desc">
                    <h2>Step 1.
                        <strong>Generate a new Encryption Key</strong>
                    </h2>
                    <p>The Encryption Key is used to encrypt/decrypt your files. Once it's lost, so are your files. Please keep it safe and secret!</p>
                </div>

                <div class="key-area">
                    <p>{{encryptionKey}}</p>
                    <div class="key-action">
                        <el-button-group>
                            <el-button @click="randomKey()" icon="el-icon-refresh" size="mini">ReGenarate Key</el-button>
                            <el-button @click="saveKey()" icon="el-icon-download" size="mini">download</el-button>
                            <el-button @click="copyKey()" size="mini">copy</el-button>
                        </el-button-group>
                    </div>
                </div>
                <div class="action-area">
                    <el-button type="primary" @click="gotoConfirmMatch()" long>I have written down my Encryption Key, Continue</el-button>
                </div>
            </div>
        </el-card>
        <el-card v-if="showPage === 'confirm'">
            <div class="navigation clearfix" slot="header">
                <el-button class="back-btn" type="text" @click="regenKey()" icon="el-icon-arrow-left">Back</el-button>
                <h1>Set Encryption Key</h1>
            </div>
            <div class="main-area">
                <div class="desc">
                    <h2>Step 2.
                        <strong>Confirm Your Encryption Key</strong>
                    </h2>
                    <p>Please Retype your encryption key to confirm</p>
                </div>
                <div class="key-area">
                    <el-input type="textarea" :rows="2" placeholder="Type your encryption key here to confirm" v-model="keyConfirm">
                    </el-input>
                </div>
                <div class="action-area">
                    <el-button type="primary" @click="validateKeyMatchAndSubmit()" long>Continue</el-button>
                </div>
            </div>
        </el-card>
        <el-card v-if="showPage === 'inputKey'">
            <div class="navigation clearfix" slot="header">
                <el-button class="back-btn" type="text" @click="gotoNewOrReturn()" icon="el-icon-arrow-left">Back</el-button>
                <h1>Set Encryption Key</h1>
            </div>
            <div class='main-area'>
                <div class="desc">
                    <h2>
                        <strong>input existing Encryption Key</strong>
                    </h2>
                    <p>Use existing Encryption Key to encrypt/decrypt files.</p>
                </div>
                <div class="key-area">
                    <el-input type="textarea" :rows="2" placeholder="Your encryption key" v-model="encryptionKey">
                    </el-input>
                </div>
                <div class="action-area">
                    <el-button type="primary" @click="confirm()" long>Continue</el-button>
                </div>
            </div>
        </el-card>

    </div>
</template>

<script>
import { getEncryptionKey, saveEncryptionKey } from '../utils/dbUtil'
import router from '../router'
import { Storj, mnemonicCheck, mnemonicGenerate } from '../utils/storjApiClient'
import walletManager from '../../wallet/walletManager'

export default {
    name: 'encryption-key',
    data: function () {
        return {
            showPage: 'newOrReturn',
            encryptionKey: '',
            keyConfirm: ''
        }
    },
    created: function () {
        this.checkKeyOkAndContinue()
    },
    methods: {
        checkKeyOkAndContinue() {
            const name = this.$store.state.User.username
            const pwd = this.$store.state.User.password
            getEncryptionKey(pwd).then((key) => {
                if (key) {
                    Storj.init(name, pwd, key);
                    router.push({ path: '/index' })
                } else {
                    console.log('no key found')
                }
            })
        },
        generateWalletThenLogin(mnemonic, password) {
            // generate an HD wallet
            walletManager.importFromMnemonic(mnemonic, password).then(() => {
                this.submitLogin()
            }).catch((e) => {
                console.error(e)
                if (e.code === 1) {
                    this.submitLogin()
                } else {
                    this.$message.error('generate wallet error, ' + e.message || e)
                }
            })
        },
        confirm() {
            const this2 = this
            const valid = mnemonicCheck(this.encryptionKey)
            const pwd = this.$store.state.User.password
            if (valid) {
                this.generateWalletThenLogin(this.encryptionKey, pwd)
            } else {
                console.error('bad key')
                this.$message.error('Not a valid Encryption Key')
            }
        },
        regenKey() {
            this.showPage = 'generate'
        },
        gotoConfirmMatch() {
            this.showPage = 'confirm'
        },
        gotoGenerate() {
            this.randomKey()
            this.showPage = 'generate'
        },
        gotoInput() {
            this.encryptionKey = ''
            this.showPage = 'inputKey'
        },
        gotoNewOrReturn() {
            this.showPage = 'newOrReturn'
        },
        validateKeyMatchAndSubmit() {
            if (this.keyConfirm === this.encryptionKey) {
                const pwd = this.$store.state.User.password
                this.generateWalletThenLogin(this.encryptionKey, pwd)
            } else {
                this.$message.error('Your key does not match');
            }
        },
        submitLogin() {
            const this2 = this
            const pwd = this.$store.state.User.password
            saveEncryptionKey(this.encryptionKey, pwd).then(() => {
                this2.checkKeyOkAndContinue()
            }).catch((e) => {
                console.error(e)
            })
        },
        randomKey() {
            this.encryptionKey = mnemonicGenerate(128)
        },
        saveKey() {
            const theKey = this.encryptionKey
            const { dialog } = require('electron').remote
            dialog.showSaveDialog({
                title: 'Save Key',
                defaultPath: './key'
            }, (path) => {
                if (path != undefined && path.length > 0) {
                    var fs = require('fs');
                    fs.writeFile(path, theKey, function (err) {
                        if (err) {
                            return console.log(err);
                        }
                        console.log("The key file was saved!");
                    });
                }
            })
        },
        copyKey() {
            const { clipboard } = require('electron')
            clipboard.writeText(this.encryptionKey)
        }
    }
}
</script> 