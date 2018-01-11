const QRCode = require('qrcode')

const opts = {
  errorCorrectionLevel: 'H',
  type: 'image/jpeg',
  rendererOpts: {
    quality: 0.3
  }
}

function createQrCodeStr(val, callBack) {
    QRCode.toDataURL(val, opts, callBack)
}

export default {
    createQrCodeStr
}