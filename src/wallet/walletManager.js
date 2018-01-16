const fs = require('fs');
const path = require('path')
const os = require('os')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const keytar = require('keytar')
const Wallet = require('ethereumjs-wallet')

const KEYCHAIN_WALLET = 'network.genaro.eden.wallet'

var isFirstTime = false
const dbFolder = path.join(os.homedir(), ".eden")
if (!fs.existsSync(dbFolder)){
    fs.mkdirSync(dbFolder)
    isFirstTime = true
}

const dbPath = path.join(dbFolder, "wallets.json")
const adapter = new FileSync(dbPath)
const db = low(adapter)

db.defaults({ wallet: [] }).write()
/*
  {
      name: 'wallet 1',
      created: 1321321,
      address: '009b5109f8f0ef4d360f10bd51358e76f042d1a1' 
  }
*/
function loadWallet() {
    return new Promise((resolve, reject) => {
        const wallets = db.get('wallet').cloneDeep().sortBy(item => -item.created).value()
        let count = wallets.length
        if(count === 0) {
            resolve([])
        } else {
            wallets.forEach(w => {
                keytar.getPassword(KEYCHAIN_WALLET, w.address).then(v3str => {
                    count --
                    w.v3 = JSON.parse(v3str)
                    w.address = w.v3.address
                    if(count === 0) {
                        resolve(wallets)
                    }
                }).catch( e => reject(e) )
            })
        }
    })
}

function importFromV3Json(json, password, name) {
    return new Promise((resolve, reject) => {
        var w = Wallet.fromV3(json, password)
        const v3 = w.toV3(password)
        const addr = v3.address

        const found = db.get('wallet').find({ address: addr }).value()
        if(found) {
            reject({message: `address ${addr} already exists. Please delete it first.`})
            return
        }
        keytar.setPassword(KEYCHAIN_WALLET, v3.address, JSON.stringify(v3)).then(() => {
            db.get('wallet').push({
                name: name,
                created: Date.now(),
                address: v3.address
            }).write()
            debugger
            resolve()
        })
    })
}

function deleteWallet(address) {

}

export {
    loadWallet,
    importFromV3Json
}
  