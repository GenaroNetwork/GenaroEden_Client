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
                <h1>Register Genaro Account</h1>
            </div>
            <Form ref="register" :model="register" :rules="ruleInline">
                <FormItem prop="username">
                    <Input type="text" v-model="register.username" placeholder="Your email">
                        <Icon type="ios-person-outline" slot="prepend"></Icon>
                    </Input>
                </FormItem>
                <FormItem prop="password">
                    <Input type="password" v-model="register.password" placeholder="Password">
                        <Icon type="ios-locked-outline" slot="prepend"></Icon>
                    </Input>
                </FormItem>
                <FormItem prop="passwordCheck">
                    <Input type="password" v-model="register.passwordCheck" placeholder="Confirm Your Password">
                        <Icon type="ios-locked-outline" slot="prepend"></Icon>
                    </Input>
                </FormItem>
                <div class='login_center is-clearfix'>
                    <FormItem>
                        <Button type="primary" long @click="submitSignup()">Sign Up</Button>
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
import { register } from '../../bridge/users'

export default {
    name : 'login-view',
    created: function () {
        console.log('login-view init')
    },
    data: function() {
        return {
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
                    { validator: (rule, value, callback) => {
                        if (value === '') {
                            callback(new Error('Please enter your password again'));
                        } else if (value !== this.register.password) {
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
        submitSignup() {
            var this2 = this
            this.$refs['register'].validate((valid) => {
                if(valid) {
                    this2.$Spin.show()
                    var bridgeUser = this2.register.username
                    var bridgePass = this2.register.password
                    register(bridgeUser, bridgePass, function(result){
                        this2.$Spin.hide()
                        this2.$Modal.success({
                            title : 'Register Success',
                            content: 'A mail has been sent to &lt;' + bridgeUser + '&gt;, please follow the instructions in the email to activate your account before login.',
                            okText: 'OK'
                        })
                        console.log(result)
                    }, function(err){
                        this2.$Spin.hide()
                        this2.$Modal.info({
                            title : 'Register Error',
                            content: 'User already exists',
                            okText: 'OK'
                        })
                    })
                }
            })
        },
    }
}
</script> 