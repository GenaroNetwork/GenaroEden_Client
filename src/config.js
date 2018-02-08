
// production environment
// const bridgeApiUrl = 'http://101.132.159.197:8080';

// test environment
let BRIDGE_API_URL = 'http://47.100.33.60:8080';

const PASSWORD_RESET_REDIRECT = 'https://genaro.network/en/password-reset-success'
const REGISTER_REDIRECT = 'https://genaro.network/en/register-success'

const TASK_STATE = Object.freeze({
    INIT: 1,
    INPROGRESS: 2,
    ERROR: 3,
    SUCCESS: 4,
    PAUSE: 5,
    CANCEL: 6,
})

const TASK_TYPE = Object.freeze({
    NOTSET: 1,
    DOWNLOAD: 2,
    UPLOAD: 3
})

export {
    BRIDGE_API_URL,
    PASSWORD_RESET_REDIRECT,
    REGISTER_REDIRECT,
    TASK_STATE,
    TASK_TYPE
}