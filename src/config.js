
// production environment
// const bridgeApiUrl = 'http://101.132.159.197:8080';

// test environment
const bridgeApiUrl = 'http://47.100.33.60:8080'
const passwordResetRedirect = 'https://genaro.network/en/password-reset-success'
const registerRedirect = 'https://genaro.network/en/register-success'

const TASKSTATE = {
  INIT: 0,
  INPROGRESS: 1,
  ERROR: 2,
  SUCCESS: 3,
  PAUSE: 4,
  CANCEL: 5,
}

export default {
  bridgeApiUrl,
  passwordResetRedirect,
  registerRedirect,
  TASKSTATE
}