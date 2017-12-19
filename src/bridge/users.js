import axios from 'axios'
import config from '../config'
const storj = require('storj-lib')

/*
  ['POST', '/users', this.getLimiter(limiter(5)), rawbody, this.createUser],
  ['POST', '/activations', this.getLimiter(limiter(5)), rawbody, this.reactivateUser],
  ['GET', '/activations/:token', this.getLimiter(limiter(5)), this.confirmActivateUser],
  ['DELETE', '/users/:id', this.getLimiter(limiter(5)), this._verify, this.destroyUser],
  ['GET', '/deactivations/:token', this.getLimiter(limiter(5)), this.confirmDestroyUser],
  ['PATCH', '/users/:id', this.getLimiter(limiter(5)), rawbody, this.createPasswordResetToken],
  ['GET', '/resets/:token', this.getLimiter(limiter(5)), this.confirmPasswordReset]
  
*/
function resetPassword(email, password, successcb, errorcb) {
  console.log(config)
  const url = config.bridgeApiUrl + '/users/' + email
  axios.patch(url, {
    password: storj.utils.sha256(password),
    redirect: config.passwordResetRedirect
  }).then((result)=>{
    console.log('reset password success: ')
    console.log(result)
    if(successcb) {
      successcb(result)
    }
  }).catch((ee)=>{
    console.log('reset password err: ')
    console.log(ee)
    if(errorcb) {
      errorcb(ee)
    }
  })
}

function register(email, password, successcb, errorcb) {
  const url = config.bridgeApiUrl + '/users'
  axios.post(url, {
    email: email,
    password: storj.utils.sha256(password),
    redirect: config.registerRedirect
  }).then((result)=>{
    console.log('register success: ')
    console.log(result)
    if(successcb) {
      successcb(result)
    }
  }).catch((ee)=>{
    console.log('register err: ')
    console.log(ee)
    if(errorcb) {
      errorcb(ee)
    }
  })
}

export {
  resetPassword,
  register
}
