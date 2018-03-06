var crypto = require('crypto')

function sha256hex(input, encoding) {
    return crypto.createHash('sha256').update(input, encoding).digest('hex')
}

export {
    sha256hex
}