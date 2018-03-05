<style scoped>
.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}

.box-card {
  width: 480px;
  position: relative;
  top: -100px;
  margin: 0px auto;
}

.login-center {
  width: 100%;
  text-align: center;
}

#wrap {
  position: fixed;
  top: 35%;
  left: 0;
  width: 100%;
}

#logo {
  width: 50px;
}

#login-form {
  width: 100%;
}

#a-forget {
  margin-left: 10px;
}

.otherlink {
  font-size: 12px;
}
h1 {
  padding: 10px;
}
.sign-in {
  width: 100%;
}
.pull-left {
  float: left;
}
.pull-right {
  float: right;
}
</style>
<template>
    <div id="wrap" @keyup.enter="submitLogin">
        <el-card class="box-card">
            <div class='login-center'>
                <span><img id="logo" src="~@/assets/img/logo.png"></span>
                <h1>Genaro</h1>
            </div>
            <el-form ref="login" :model="login" :rules="ruleInline">
                <el-form-item prop="username">
                    <el-input type="text" v-model="login.username" :placeholder="$t('common.usernameholder')">
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" v-model="login.password" :placeholder="$t('common.passwordholder')">
                    </el-input>
                </el-form-item>
                <div class='login-center clearfix'>
                    <el-form-item>
                        <el-button @click="submitLogin()" class="sign-in" type="primary" :loading="signing">{{ $t("common.signin") }}</el-button>
                    </el-form-item>
                    <router-link class="otherlink pull-left" to="register">{{ $t("common.signup") }}</router-link>
                    <router-link class="otherlink pull-right" to="password-reset">{{ $t("common.reset") }}</router-link>
                </div>
            </el-form>
        </el-card>
    </div>
</template>

<script> 
import { Storj, Bucket } from '../utils/storjApiClient'
import router from '../router'
import store from '../store'
import { resetPassword } from '../../bridge/users'
import { getCredentials, saveCredentials } from '../utils/dbUtil'



export default {
    name: 'login-view',
    created: function () {
        const this2 = this
        getCredentials().then((credentials) => {
            if (credentials) {
                store.commit('updateUsername', credentials.account)
                if (credentials.password) {
                    store.commit('updatePassword', credentials.password)
                    this2.checkEncryptionKeyAndLogin(credentials.account, credentials.password)
                } else {
                    this.login.username = credentials.account
                }
            }
        })
    },
    data: function () {
        return {
            login: {
                username: '',
                password: ''
            },
            ruleInline: {
                username: [
                    { required: true, message: this.$t("common.inputname"), trigger: 'blur' },
                    { type: 'email', message: this.$t("common.emailerr"), trigger: 'blur' }
                ],
                password: [
                    { required: true, message: this.$t("common.inputpwd"), trigger: 'blur' },
                    { type: 'string', min: 6, message: this.$t("common.pwdlength"), trigger: 'blur' }
                ]
            },
            signing: false
        }
    },
    methods: {
        checkEncryptionKeyAndLogin(bridgeUser, bridgePass) {
            store.commit('updateUsername', bridgeUser)
            store.commit('updatePassword', bridgePass)
            router.push({ path: '/encryption-key' })
        },
        submitLogin() {
            this.$refs['login'].validate((valid) => {
                if (valid) {
                    this.signing = true
                    var bridgeUser = this.login.username
                    var bridgePass = this.login.password
                    Storj.init({ bridgeUser, bridgePass });
                    Bucket.list()
                        .then(() => {
                            saveCredentials(bridgeUser, bridgePass);
                            this.checkEncryptionKeyAndLogin(bridgeUser, bridgePass);
                        })
                        .catch(err => {
                            console.log(err);
                            this.$message.error(this.$t("common.loginerr"));
                        });
                    this.signing = false;
                }
            })
        }
    }
}
</script>