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
function resetPassword(email, password) {
  console.log(config)
  const url = config.bridgeApiUrl + '/users/' + email
  return axios.patch(url, {
    password: storj.utils.sha256(password),
    redirect: config.passwordResetRedirect
  })
}

function register(email, password) {
  const url = config.bridgeApiUrl + '/users'
  return axios.post(url, {
    email: email,
    password: storj.utils.sha256(password),
    redirect: config.registerRedirect
  })
}

export {
  resetPassword,
  register
}
