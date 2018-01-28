
// production environment
// const bridgeApiUrl = 'http://101.132.159.197:8080';

// test environment
const bridgeApiUrl = 'http://47.100.33.60:8080'
const passwordResetRedirect = 'https://genaro.network/en/password-reset-success'
const registerRedirect = 'https://genaro.network/en/register-success'
const paymentUrl = 'http://127.0.0.1:3000'

const TASKSTATE = Object.freeze({
  INIT: 1,
  INPROGRESS: 2,
  ERROR: 3,
  SUCCESS: 4,
  PAUSE: 5,
  CANCEL: 6,
})

const TASKTYPE = Object.freeze({
  NOTSET: 1,
  DOWNLOAD: 2,
  UPLOAD: 3
})

export default {
  bridgeApiUrl,
  paymentUrl,
  passwordResetRedirect,
  registerRedirect,
  TASKSTATE,
  TASKTYPE
}