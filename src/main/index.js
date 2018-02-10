import { app, BrowserWindow, Menu, shell } from 'electron'
import registerProtocals from './customProtocol'
const defaultMenu = require('./appMenu');
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`

function addMenu() {
    // Get template for default menu 
    const menu = defaultMenu(app, shell);
 
    // Set top-level application menu, using modified template 
    Menu.setApplicationMenu(Menu.buildFromTemplate(menu));
}

function createWindow() {
    registerProtocals()
    addMenu()
    app.updateMenu = addMenu
    /**
     * Initial window options
     */
    mainWindow = new BrowserWindow({
        height: 656,
        useContentSize: true,
        width: 1200,
    })

    mainWindow.loadURL(winURL)
    // mainWindow.webContents.openDevTools()
    mainWindow.on('closed', () => {
        mainWindow = null
    })

    mainWindow.webContents.on('new-window', function (e, url) {
        e.preventDefault();
        shell.openExternal(url);
    });

}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
})
