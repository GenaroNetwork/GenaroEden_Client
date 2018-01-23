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

function registerAvatarProtocol() {
    //registerStreamProtocol is not supported for 1.7.x electron
    protocol.registerBufferProtocol('avatar', (request, callback) => {
        const url = request.url
        const id = url.substring(9)
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

function registerProtocals() {
    registerAvatarProtocol()
}

export default registerProtocals