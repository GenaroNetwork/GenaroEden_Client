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
</style>

<template>
    <div id="wrap">
        <el-card class="box-card">
            <div class='login-center'>
                <span><img id="logo" src="~@/assets/img/logo.png"></span>
                <h1>{{ $t('common.reset') }}</h1>
            </div>
            <el-form ref="model" :model="model" :rules="ruleInline">
                <el-form-item prop="username">
                    <el-input type="text" v-model="model.username" :placeholder="$t('common.emailholder')">
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" v-model="model.password" :placeholder="$t('common.newpasswordholder')">
                    </el-input>
                </el-form-item>
                <el-form-item prop="passwordCheck">
                    <el-input type="password" v-model="model.passwordCheck" :placeholder="$t('common.newconfirmholder')">
                    </el-input>
                </el-form-item>
                <div class='login-center clearfix'>
                    <el-form-item>
                        <el-button type="primary" class="main-btn" @click="resetPwd()" :loading="processing">{{ $t("common.reset") }}</el-button>
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
import { resetPassword } from '../../bridge/users';

export default {
    name: 'password-reset',
    data: function () {
        return {
            processing: false,
            model: {
                username: '',
                password: '',
                passwordCheck: ''
            },
            ruleInline: {
                username: [
                    { required: true, message: this.$t('common.inputname'), trigger: 'blur' },
                    { type: 'email', message: this.$t('common.emailerr'), trigger: 'blur' }
                ],
                password: [
                    { required: true, message: this.$t('common.inputpwd'), trigger: 'blur' },
                    { type: 'string', min: 6, message: this.$t('common.pwdlength'), trigger: 'blur' }
                ],
                passwordCheck: [
                    {                        validator: (rule, value, callback) => {
                            if (value === '') {
                                callback(new Error(this.$t('common.inputpwdagain')));
                            } else if (value !== this.model.password) {
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
        resetPwd() {
            this.$refs['model'].validate((valid) => {
                if (valid) {
                    this.processing = true;
                    resetPassword(this.model.username, this.model.password).then(() => {
                        this.processing = false
                        this.$alert(this.$t('common.activateemail', {user: this.model.username}), this.$t('common.resetsuccess'), {
                            type: 'success',
                            confirmButtonText: this.$t('el.messagebox.confirm'),
                            callback: action => {
                                this.$router.push('/')
                            }
                        })
                    }).catch((e) => {
                        this.processing = false;
                        this.$message.error({message: e.response.data.error, showClose: true, duration: 0});
                    })
                }
            })
        }
    }
}
</script> 