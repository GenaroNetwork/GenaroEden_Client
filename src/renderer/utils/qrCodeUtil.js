const qrCode = require('qrcode');

const opts = {
    errorCorrectionLevel: 'H',
    type: 'png',
    rendererOpts: {
        quality: 0.3
    }
}

function createQrCodeStr(val, callBack) {
    qrCode.toDataURL(val, opts, callBack)
}

export {
    createQrCodeStr
}