<style scoped>
.box-card {
  width: 480px;
  margin: 100px auto;
}
.login-center {
  width: 100%;
  text-align: center;
}
#wrap {
  position: fixed;
  width: 100%;
  height: 100%;
}
#logo {
  width: 50px;
}
.otherlink {
  font-size: 12px;
}

h1 {
  padding: 10px;
}
.main-btn {
  width: 100%;
}
.pulled-left {
  float: left;
}
a {
  color: #409eff;
}
</style>

<template>
    <div id="wrap">
        <el-card class="box-card">
            <div class='login-center'>
                <span><img id="logo" src="~@/assets/img/logo.png"></span>
                <h1>{{ $t("common.register") }}</h1>
            </div>
            <el-form ref="register" :model="register" :rules="ruleInline">
                <el-form-item prop="username">
                    <el-input type="text" v-model="register.username" :placeholder="$t('common.emailholder')">
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" v-model="register.password" :placeholder="$t('common.passwordholder')">
                    </el-input>
                </el-form-item>
                <el-form-item prop="passwordCheck">
                    <el-input type="password" v-model="register.passwordCheck" :placeholder="$t('common.confirmholder')">
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-checkbox :checked="agree" @change="value => agree = value">
                        {{ $t("common.agreeagreement1") }}
                        <a href="javascript:void(0);" @click="openAgreement">{{ $t("common.agreeagreement2") }}</a>
                    </el-checkbox>
                </el-form-item>
                <div class='login-center clearfix'>
                    <el-form-item>
                        <el-button :disabled="!agree" class="main-btn" type="primary" @click="submitSignup()" :loading="processing">{{ $t("common.signup") }}</el-button>
                    </el-form-item>
                    <router-link class="otherlink pulled-left" to="/">
                        <i class="el-icon-arrow-left"></i>{{ $t("common.signin") }}</router-link>
                </div>
            </el-form>
        </el-card>
    </div>
</template>

<script> 
import router from '../router';
import store from '../store';
import { register } from '../../bridge/users';
import { shell } from "electron";
import { GET_AGREEMENT } from "../../config";


export default {
    name: 'login-view',
    created: function () {
        console.log('login-view init')
    },
    data: function () {
        return {
            agree: false,
            processing: false,
            register: {
                username: '',
                password: '',
                passwordCheck: ''
            },
            ruleInline: {
                username: [
                    { required: true, message: this.$t('common.inputname'), trigger: 'blur' },
                    { type: 'email', message: this.$t("common.emailerr"), trigger: 'blur' }
                ],
                password: [
                    { required: true, message: this.$t("common.inputpwd"), trigger: 'blur' },
                    { type: 'string', min: 6, message: this.$t("common.pwdlength"), trigger: 'blur' }
                ],
                passwordCheck: [
                    {                        validator: (rule, value, callback) => {
                            if (value === '') {
                                callback(new Error(this.$t('common.inputpwdagain')));
                            } else if (value !== this.register.password) {
                                callback(new Error(this.$t('common.pwdmismatch')));
                            } else {
                                callback();
                            }
                        }, trigger: 'blur'                    }
                ]
            }
        }
    },
    methods: {
        submitSignup() {
            var this2 = this
            this.$refs['register'].validate((valid) => {
                if (valid) {
                    this2.processing = true
                    var bridgeUser = this2.register.username
                    var bridgePass = this2.register.password
                    register(bridgeUser, bridgePass).then(result => {
                        this2.processing = false
                        this.$alert(this.$t('common.activateemail', { user: bridgeUser }), this.$t('common.registersuccess'), {
                            type: 'success',
                            confirmButtonText: this.$t('el.messagebox.confirm'),
                            callback: action => {
                                this2.$router.push('/')
                            }
                        })
                    }).catch(err => {
                        this2.processing = false
                        this.$alert(this.$t('common.userexist'), this.$t('common.registererr'), {
                            type: 'error',
                            confirmButtonText: this.$t('el.messagebox.confirm')
                        })
                    })
                }
            })
        },
        openAgreement() {
            shell.openExternal(GET_AGREEMENT());
        },
    }
}
</script> 