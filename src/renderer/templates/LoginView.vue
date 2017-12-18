<template>
    <div id="wrap">
        <Card class="box-card">
            <div class='login_center'>
                <span><img id="logo" src="~@/assets/genaro_logo.png"></span>
                <h3>Genaro</h3>
            </div>
            <Form ref="login" :model="login" :rules="ruleInline">
                <FormItem prop="username">
                    <Input type="text" v-model="login.username" placeholder="Username">
                        <Icon type="ios-person-outline" slot="prepend"></Icon>
                    </Input>
                </FormItem>
                <FormItem prop="password">
                    <Input type="password" v-model="login.password" placeholder="Password">
                        <Icon type="ios-locked-outline" slot="prepend"></Icon>
                    </Input>
                </FormItem>
                <div class='login_center'>
                    <FormItem>
                        <Button type="primary" @click="submitLogin()">Sign In</Button>
                        <Button type="ghost" class="signup" @click="submitSignup()" style="margin-left: 8px">Sign Up</Button>
                    </FormItem>
                </div>
                <!-- <a id="a_forget">Redister Now!</a> -->
            </Form>
        </Card>
    </div>
</template>

<script> 
    import STROJ_CLIENT from '../utils/StorjApiClient'
    import router from '../router'
    import store from '../store'
    import iView from 'iview'

    export default {
        name : 'login-view',
        created: function () {
            console.log('login-view init')
        },
        data: function() {
            return {
                login: {
                    username: '',
                    password: ''
                },
                ruleInline: {
                    username: [
                        { required: true, message: 'Please input username', trigger: 'blur' },
                        { type: 'email', message: 'Incorrect email format', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: 'Please input password', trigger: 'blur' },
                        { type: 'string', min: 6, message: 'Password length must not be less than 6 bits', trigger: 'blur' }
                    ]
                }
            }
        },
        methods:{
            submitLogin() {
                this.$refs['login'].validate((valid) => {
                    if(valid) {
                        this.$Spin.show()
                        var bridgeUser = this.login.username
                        var bridgePass = this.login.password
                        STROJ_CLIENT.getBucketList(bridgeUser, bridgePass, (err) => {
                            iView.Spin.hide()
                            iView.Modal.error({
                                title : 'Login Error',
                                content: 'Username Or Password Error',
                                okText: 'OK'
                            })
                        }, function(result) {
                            iView.Spin.hide()
                            store.commit('updateUsername', bridgeUser)
                            store.commit('updatePassword', bridgePass)
                            router.push({ path: '/index'})
                        });
                    }
                })
            },
            submitSignup() {
                var this2 = this
                this.$refs['login'].validate((valid) => {
                    if(valid) {
                        this2.$Spin.show()
                        var bridgeUser = this2.login.username
                        var bridgePass = this2.login.password
                        STROJ_CLIENT.register(bridgeUser, bridgePass, function(err){
                            this2.$Spin.hide()
                            this2.$Modal.info({
                                title : 'Register Error',
                                content: 'User already exists',
                                okText: 'OK'
                            })
                        }, function(result){
                            this2.$Spin.hide()
                            this2.$Modal.success({
                                title : 'Register Success',
                                content: 'A mail has been sent to &lt;' + bridgeUser + '&gt;, please follow the instructions in the email to activate your account before login.',
                                okText: 'OK'
                            })
                            console.log(result)
                        })
                    }
                })
            }
        }
    }
</script>

<style>
  .text {
    font-size: 14px;
  }

  .item {
    padding: 18px 0;
  }

  .box-card {
    width: 480px;
    position:relative;
    top:-100px;
    margin:0px auto;
  }

  .login_center {
      width: 100%;
      text-align: center;
  }

  #wrap{
    position:fixed;
    top:35%;
    left:0;
    width:100%;
  }

  #login_form {
      width: 100%;
  }

  #a_forget {
      margin-left:10px;
  }

</style>