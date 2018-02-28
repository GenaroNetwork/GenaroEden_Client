

// prod
// const BRIDGE_API_URL = 'http://47.100.33.60:8080';

// develop
const BRIDGE_API_URL = 'http://101.132.159.197:8080';

// local
// const BRIDGE_API_URL = 'http://127.0.0.1:6382';

const PASSWORD_RESET_REDIRECT = 'https://genaro.network/en/password-reset-success';
const REGISTER_REDIRECT = 'https://genaro.network/en/register-success';

const GNX_PER_GB_BANDWIDTH = 5.0;
const GNX_PER_GB_HOUR_STORAGE = 0.002054795;

const AUTO_UPLOAD_URL = "http://eden-auto-update.oss-cn-shanghai.aliyuncs.com/update.json";

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
    TASK_TYPE,
    GNX_PER_GB_BANDWIDTH,
    GNX_PER_GB_HOUR_STORAGE,
    AUTO_UPLOAD_URL,
}