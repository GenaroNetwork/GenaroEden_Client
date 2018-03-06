import axios from 'axios'
import { BRIDGE_API_URL, PASSWORD_RESET_REDIRECT, REGISTER_REDIRECT } from '../config'
import { sha256hex } from '../lib/cryptUtil'
axios.defaults.adapter = require('axios/lib/adapters/http')

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
    const url = BRIDGE_API_URL + '/users/' + email
    return axios.patch(url, {
        password: sha256hex(password),
        redirect: PASSWORD_RESET_REDIRECT
    })
}

function register(email, password) {
    const url = BRIDGE_API_URL + '/users'
    return axios.post(url, {
        email: email,
        password: sha256hex(password),
        redirect: REGISTER_REDIRECT
    })
}

export {
    resetPassword,
    register
}
