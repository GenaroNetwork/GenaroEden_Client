<style scoped>
  .box-card {
    width: 480px;
    top: 50%;
    transform: translate(0, -70%);
    margin:0px auto;
  }
  .login_center {
      width: 100%;
      text-align: center;
  }
  #wrap{
    position: fixed;
    width: 100%;
    height: 100%;
  }

  .otherlink {
      font-size: 12px
  }
  h1 {
      padding: 10px
  }
</style>

<template>
    <div id="wrap">
        <Card class="box-card">
            <div class='login_center'>
                <span><img id="logo" src="~@/assets/genaro_logo.png"></span>
                <h1>Reset Password</h1>
            </div>
            <Form ref="model" :model="model" :rules="ruleInline">
                <FormItem prop="username">
                    <Input type="text" v-model="model.username" placeholder="Your email">
                        <Icon type="ios-person-outline" slot="prepend"></Icon>
                    </Input>
                </FormItem>
                <FormItem prop="password">
                    <Input type="password" v-model="model.password" placeholder="New Password">
                        <Icon type="ios-locked-outline" slot="prepend"></Icon>
                    </Input>
                </FormItem>
                <FormItem prop="passwordCheck">
                    <Input type="password" v-model="model.passwordCheck" placeholder="Confirm Your New Password">
                        <Icon type="ios-locked-outline" slot="prepend"></Icon>
                    </Input>
                </FormItem>
                <div class='login_center is-clearfix'>
                    <FormItem>
                        <Button type="primary" long @click="resetPwd()">Reset Password</Button>
                    </FormItem>
                    <router-link class="otherlink is-pulled-left" to="/">Sign In</router-link>
                </div>
            </Form>
        </Card>
    </div>
</template>

<script> 
import STROJ_CLIENT from '../utils/StorjApiClient'
import router from '../router'
import store from '../store'
import iView from 'iview'
import { resetPassword } from '../../bridge/users'

export default {
    name : 'password-reset',
    created: function () {
        console.log('login-view init')
    },
    data: function() {
        return {
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
                    { validator: (rule, value, callback) => {
                        if (value === '') {
                            callback(new Error('Please enter your password again'));
                        } else if (value !== this.model.password) {
                            callback(new Error('The two input passwords do not match!'));
                        } else {
                            callback();
                        }
                    }, trigger: 'blur' }
                ]
            }
        }
    },
    methods:{
        resetPwd() {
            var this2 = this
            this.$refs['model'].validate((valid) => {
                if(valid) {
                    const this2 = this
                    this2.$Spin.show()
                    resetPassword(this.model.username, this.model.password, () => {
                        this2.$Spin.hide()
                        this2.$Modal.success({
                            title : 'Reset Success',
                            content: 'A mail has been sent to &lt;' + this2.model.username + '&gt;, please follow the instructions in the email to confirm.',
                            okText: 'OK',
                            onOk: () => {
                            this2.$router.push('/')
                            }
                        })
                    }, (e) => {
                        this2.$Spin.hide()
                        this2.$Modal.info({
                            title : 'Reset Error',
                            content: e,
                            okText: 'OK'
                        })
                    })
                }
            })
        }
    }
}
</script> 