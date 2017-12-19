<style scoped>
</style>

<template>
    <div id="wrap">
        <router-link to="/">Back</router-link>
        <Card class="box-card">
            <div class='login_center'>
                <span><img id="logo" src="~@/assets/genaro_logo.png"></span>
                <h3>Genaro</h3>
                <h3>Reset Password</h3>
            </div>
            <Form ref="model" :model="model" :rules="ruleInline">
                <FormItem prop="username">
                    <Input type="text" v-model="model.username" placeholder="Your email">
                        <Icon type="ios-person-outline" slot="prepend"></Icon>
                    </Input>
                </FormItem>
                <FormItem prop="password">
                    <Input type="password" v-model="model.password" placeholder="Password">
                        <Icon type="ios-locked-outline" slot="prepend"></Icon>
                    </Input>
                </FormItem>
                <FormItem prop="passwordCheck">
                    <Input type="password" v-model="model.passwordCheck" placeholder="Confirm Your Password">
                        <Icon type="ios-locked-outline" slot="prepend"></Icon>
                    </Input>
                </FormItem>
                <div class='login_center'>
                    <FormItem>
                        <Button type="primary" @click="resetPwd()">Reset Password</Button>
                    </FormItem>
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
        },
    }
}
</script> 