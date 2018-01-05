var QRCode = require('qrcode')

var opts = {
  errorCorrectionLevel: 'H',
  type: 'image/jpeg',
  rendererOpts: {
    quality: 0.3
  }
}

function createQrCodeStr(val, errorCallback, successCallback) {
    QRCode.toDataURL(val, opts, function (err, string) {
        if (err) {
            errorCallback(err)
            console.error('create-qrcode:' + err)
        }
        successCallback(string)
        console.log(string)
    })
}

export default {
    createQrCodeStr
}