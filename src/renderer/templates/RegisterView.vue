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
                <h1>Register Genaro Account</h1>
            </div>
            <el-form ref="register" :model="register" :rules="ruleInline">
                <el-form-item prop="username">
                    <el-input type="text" v-model="register.username" placeholder="Your email">
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" v-model="register.password" placeholder="Password">
                    </el-input>
                </el-form-item>
                <el-form-item prop="passwordCheck">
                    <el-input type="password" v-model="register.passwordCheck" placeholder="Confirm Your Password">
                    </el-input>
                </el-form-item>
                <div class='login-center clearfix'>
                    <el-form-item>
                        <el-button class="main-btn" type="primary" @click="submitSignup()" :loading="processing">Sign Up</el-button>
                    </el-form-item>
                    <router-link class="otherlink pulled-left" to="/">
                        <i class="el-icon-arrow-left"></i>Sign In</router-link>
                </div>
            </el-form>
        </el-card>
    </div>
</template>

<script> 
import STROJ_CLIENT from '../utils/storjApiClient'
import router from '../router'
import store from '../store'
import { register } from '../../bridge/users'

export default {
    name: 'login-view',
    created: function () {
        console.log('login-view init')
    },
    data: function () {
        return {
            processing: false,
            register: {
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
                            } else if (value !== this.register.password) {
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
        submitSignup() {
            var this2 = this
            this.$refs['register'].validate((valid) => {
                if (valid) {
                    this2.processing = true
                    var bridgeUser = this2.register.username
                    var bridgePass = this2.register.password
                    register(bridgeUser, bridgePass).then(result => {
                        this2.processing = false
                        this.$alert('A mail has been sent to <' + bridgeUser + '>, please follow the instructions in the email to activate your account before login.', 'Register Success', {
                            type: 'success',
                            confirmButtonText: 'OK',
                            callback: action => {
                                this2.$router.push('/')
                            }
                        })
                    }).catch(err => {
                        this2.processing = false
                        this.$alert('User already exists', 'Register Error', {
                            type: 'error',
                            confirmButtonText: 'OK'
                        })
                    })
                }
            })
        },
    }
}
</script> 