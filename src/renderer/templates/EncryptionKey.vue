<style scoped>

</style>

<template>
    <div>
        <h1>Set Encryption Key</h1>
        <div class='newOrReturn' v-if="showPage === 'newOrReturn'">
            <Button type="primary" @click="gotoGenerate()" size="large" long>I'm a new user and I don't have an Encryption Key, generate now</Button>
            <Button type="primary" @click="gotoInput()" size="large" long>I already have an Encryption Key, goto input</Button>
        </div>
        <div class='generate' v-if="showPage === 'generate'">
            <p>
                <h2>Generate a new Encryption Key</h2>
                <p>The Encryption Key is used to encrypt/decrypt your files. Once it's lost, so are your files. Please keep it safe and secret!</p>
            </p>
            <Input v-model="encryptionKey" type="textarea" :rows="4" placeholder="Encryption Key" disabled></Input>
            <Button type="primary" @click="randomKey()" size="large" long>Genarate Key</Button>
            <Button type="primary" @click="confirm()" size="large" long>Continue</Button>
            <Button type="primary" @click="gotoNewOrReturn()" size="large" long>Back</Button>
        </div>
        <div class='inputKey' v-if="showPage === 'inputKey'">
            <p>
                <h2>input existing Encryption Key</h2>
                <p>The Encryption Key is used to encrypt/decrypt your files. Once it's lost, so are your files. Please keep it safe and secret!</p>
            </p>
            <Input v-model="encryptionKey" type="textarea" :rows="4" placeholder="Encryption Key"></Input>
            <Button type="primary" @click="confirm()" size="large" long>Continue</Button>
            <Button type="primary" @click="gotoNewOrReturn()" size="large" long>Back</Button>
        </div>
        <div class="confirm" v-if="showPage === 'confirm'">
            <p>Important: Your Encryption Key is below, please keep it safe and secret.</p>
            <p>{{encryptionKey}}</p>
            <Button type="primary" @click="saveKey()" size="large" long>Save Key as file..</Button>
            <Button type="primary" @click="copyKey()" size="large" long>Copy to Clipboard</Button>
            <Button type="primary" @click="regenKey()" size="large" long>Back to Regenerate</Button>
            <Button type="primary" @click="submitLogin()" size="large" long>Continue</Button>
        </div>
    </div>
</template>

<script>
import dbUtil from '../utils/DbUtil'
import router from '../router'
import bridgeApi from '../utils/StorjApiClient'
import iView from 'iview'

export default {
    name : 'encryption-key',
    data: function() {
        return {
            showPage: 'newOrReturn',
            encryptionKey: ''
        }
    },
    created: function () {
        this.checkKeyOkAndContinue()
    },
    methods:{
        checkKeyOkAndContinue() {
            dbUtil.getEncryptionKey().then((c) => {
                if(c) {
                    const name = this.$store.state.User.username
                    const pwd = this.$store.state.User.password
                    bridgeApi.setEnvironment(name, pwd, c)
                    router.push({ path: '/index'})
                } else {

                }
            })
        },
        confirm() {
            const valid = bridgeApi.mnemonicCheck(this.encryptionKey)
            if(valid) {
                console.log('good key')
                this.showPage = 'confirm'
            } else {
                console.error('bad key')
                iView.Modal.error({
                    title : 'Bad Key',
                    content: 'Not a valid Encryption Key',
                    okText: 'OK'
                })
            }
        },
        regenKey() {
            this.showPage = 'generate'
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
        submitLogin() {
            const this2 = this
            dbUtil.saveEncryptionKey(this.encryptionKey).then(()=>{
                this2.checkKeyOkAndContinue()
            }).catch(()=>{
                console.error('saveEncryptionKey failed')
            })
        },
        randomKey() {
            this.encryptionKey = bridgeApi.mnemonicGenerate(128)
        },
        saveKey() {
            const theKey = this.encryptionKey
            const {dialog} = require('electron').remote
            dialog.showSaveDialog({
                title: 'Save Key',
                defaultPath: './key'
            }, (path) => {
                if(path != undefined && path.length > 0) {
                    var fs = require('fs');
                    fs.writeFile(path, theKey, function(err) {
                        if(err) {
                            return console.log(err);
                        }
                        console.log("The key file was saved!");
                    }); 
                }
            })
        },
        copyKey() {
            const {clipboard} = require('electron')
            clipboard.writeText(this.encryptionKey)
        }
    }
}
</script> 