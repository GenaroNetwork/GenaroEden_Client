const {protocol} = require('electron')
const fs = require('fs')
const jdenticon = require("jdenticon")
const path = require('path')
const os = require('os')


const dbFolder = path.join(os.homedir(), ".eden")
if (!fs.existsSync(dbFolder)){
    fs.mkdirSync(dbFolder)
}

const avatarFolder = path.join(dbFolder, 'avatar')
if (!fs.existsSync(avatarFolder)){
    fs.mkdirSync(avatarFolder)
}

const qrFolder = path.join(dbFolder, 'qr')
if (!fs.existsSync(qrFolder)){
    fs.mkdirSync(qrFolder)
}

function registerAvatarProtocol() {
    protocol.registerBufferProtocol('avatar', (request, callback) => {
        const url = request.url
        const id = url.substring(9) // avatar://
        const avatarFilePath = path.join(avatarFolder, id + '.png')
        if (!fs.existsSync(avatarFilePath)){
            const png = jdenticon.toPng(id, 256)
            fs.writeFileSync(avatarFilePath, png)
        }
        fs.readFile(avatarFilePath,  (err, buf) => {
            callback({mimeType: 'image/png', data: buf})
        })
    }, (error) => {
        if (error) console.error('Failed to register protocol')
    })
}

function registerQrProtocol() {
    const QRCode = require('qrcode')
    protocol.registerBufferProtocol('qr', (request, callback) => {
        const url = request.url
        const id = url.substring(5) // qr://
        const filePath = path.join(qrFolder, id + '.png')
        if (!fs.existsSync(filePath)){
            QRCode.toFile(filePath, id, {}, err => {
                fs.readFile(filePath,  (err, buf) => {
                    callback({mimeType: 'image/png', data: buf})
                })
            })
        } else {
            fs.readFile(filePath,  (err, buf) => {
                callback({mimeType: 'image/png', data: buf})
            })
        }
    }, (error) => {
        if (error) console.error('Failed to register protocol')
    })
}

function registerProtocals() {
    registerAvatarProtocol()
    registerQrProtocol()
}

export default registerProtocals