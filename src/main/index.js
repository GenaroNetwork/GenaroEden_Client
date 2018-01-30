import { app, BrowserWindow, Menu } from 'electron'
import registerProtocals from './customProtocol'

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

function createWindow() {
    registerProtocals()
    /**
     * Initial window options
     */
    mainWindow = new BrowserWindow({
        height: 656,
        useContentSize: true,
        width: 1200,
    })

    /* set menu */
    let menuTemplate = [
        {
            label: "Application",
            submenu: [
                { label: "Quit", accelerator: "Command+Q", click: function () { app.quit(); } }
            ],
        },
        {
            label: "Edit",
            submenu: [
                { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
                { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
                { type: "separator" },
                { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
                { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
                { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
                { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" },
            ]
        }
    ]
    Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate))

    mainWindow.loadURL(winURL)
    // mainWindow.webContents.openDevTools()
    mainWindow.on('closed', () => {
        mainWindow = null
    })

    mainWindow.webContents.on('new-window', function (e, url) {
        e.preventDefault();
        require('electron').shell.openExternal(url);
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
