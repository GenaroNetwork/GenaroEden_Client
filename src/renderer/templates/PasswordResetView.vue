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
                <span><img id="logo" src="~@/assets/genaro_logo.png"></span>
                <h1>Reset Password</h1>
            </div>
            <el-form ref="model" :model="model" :rules="ruleInline">
                <el-form-item prop="username">
                    <el-input type="text" v-model="model.username" placeholder="Your email">
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" v-model="model.password" placeholder="New Password">
                    </el-input>
                </el-form-item>
                <el-form-item prop="passwordCheck">
                    <el-input type="password" v-model="model.passwordCheck" placeholder="Confirm Your New Password">
                    </el-input>
                </el-form-item>
                <div class='login-center clearfix'>
                    <el-form-item>
                        <el-button type="primary" class="main-btn" @click="resetPwd()" :loading="processing">Reset Password</el-button>
                    </el-form-item>
                    <router-link class="otherlink pulled-left" to="/">
                        <i class="el-icon-arrow-left"></i>Sign In</router-link>
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
                    { required: true, message: 'Please input username', trigger: 'blur' },
                    { type: 'email', message: 'Incorrect email format', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: 'Please input password', trigger: 'blur' },
                    { type: 'string', min: 6, message: 'Password length must not be less than 6 bits', trigger: 'blur' }
                ],
                passwordCheck: [
                    {                        validator: (rule, value, callback) => {
                            if (value === '') {
                                callback(new Error('Please enter your password again'));
                            } else if (value !== this.model.password) {
                                callback(new Error('The two input passwords do not match!'));
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
            var this2 = this
            this.$refs['model'].validate((valid) => {
                if (valid) {
                    const this2 = this
                    this2.processing = true
                    resetPassword(this.model.username, this.model.password).then(() => {
                        this2.processing = false
                        this.$alert('A mail has been sent to <' + this2.model.username + '>, please follow the instructions in the email to confirm.', 'Reset Success', {
                            type: 'success',
                            confirmButtonText: 'OK',
                            callback: action => {
                                this2.$router.push('/')
                            }
                        })
                    }).catch((e) => {
                        this2.processing = false
                        this.$alert(e, 'Reset Error', {
                            type: 'error',
                            confirmButtonText: 'OK'
                        })
                    })
                }
            })
        }
    }
}
</script> 