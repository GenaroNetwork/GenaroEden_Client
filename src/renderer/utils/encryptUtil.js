var crypto = require('crypto')
var scrypt = require("scrypt");
var CryptoJS = require("crypto-js");

function encryptText2Json(word12, pass) {
    var salt = crypto.randomBytes(32)
    var scriptKey = scrypt.hashSync(new Buffer(pass), {"N":16384,"r":8,"p":1}, 64, salt);
    var ciphertext = CryptoJS.AES.encrypt(word12, scriptKey.toString()).toString();
    var mycipher = {
        ciphertext,
        salt: salt.toString('base64')
    }
    return (mycipher)
}

function decryptJson2Text(mycipher, pass) {
    var saltt = Buffer.from(mycipher.salt, 'base64')
    var scriptKey = scrypt.hashSync(new Buffer(pass), {"N":16384,"r":8,"p":1}, 64, saltt);

    var bytes  = CryptoJS.AES.decrypt(mycipher.ciphertext, scriptKey.toString());
    var plaintext = bytes.toString(CryptoJS.enc.Utf8);
    return plaintext
}

export {
    encryptText2Json,
    decryptJson2Text
}