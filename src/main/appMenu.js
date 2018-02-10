const {ipcMain} = require('electron')
const {localeMessages} = require('../renderer/i18n')
const i18n = require('../renderer/i18n')
function getLocaleMenu(lang) {
  return localeMessages.messages[lang].menu
}
let menu = getLocaleMenu(localeMessages.locale)
/**
 * Creates a default menu for electron apps
 *
 * @param {Object} app electron.app
 * @param {Object} shell electron.shell
 * @returns {Object}  a menu object to be passed to electron.Menu
 */

module.exports = function(app, shell) {

    const template = [
      {
        label: menu.edit.edit,
        submenu: [
          {
            label: menu.edit.undo,
            accelerator: 'CmdOrCtrl+Z',
            role: 'undo'
          },
          {
            label: menu.edit.redo,
            accelerator: 'Shift+CmdOrCtrl+Z',
            role: 'redo'
          },
          {
            type: 'separator'
          },
          {
            label: menu.edit.cut,
            accelerator: 'CmdOrCtrl+X',
            role: 'cut'
          },
          {
            label: menu.edit.copy,
            accelerator: 'CmdOrCtrl+C',
            role: 'copy'
          },
          {
            label: menu.edit.paste,
            accelerator: 'CmdOrCtrl+V',
            role: 'paste'
          },
          {
            label: menu.edit.selectall,
            accelerator: 'CmdOrCtrl+A',
            role: 'selectall'
          },
        ]
      },
      {
        label: menu.view.view,
        submenu: [
        //   {
        //     label: 'Reload',
        //     accelerator: 'CmdOrCtrl+R',
        //     click: function(item, focusedWindow) {
        //       if (focusedWindow)
        //         focusedWindow.reload();
        //     }
        //   },
          {
            label: menu.view.togglefullscreen,
            accelerator: (function() {
              if (process.platform === 'darwin')
                return 'Ctrl+Command+F';
              else
                return 'F11';
            })(),
            click: function(item, focusedWindow) {
              if (focusedWindow)
                focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
            }
          },
          {
            label: menu.view.toggledevelopertools,
            accelerator: (function() {
              if (process.platform === 'darwin')
                return 'Alt+Command+I';
              else
                return 'Ctrl+Shift+I';
            })(),
            click: function(item, focusedWindow) {
              if (focusedWindow)
                focusedWindow.toggleDevTools();
            }
          },
        ]
      },
      {
        label: menu.window.window,
        role: 'window',
        submenu: [
          {
            label: menu.window.minimize,
            accelerator: 'CmdOrCtrl+M',
            role: 'minimize'
          },
          {
            label: menu.window.close,
            accelerator: 'CmdOrCtrl+W',
            role: 'close'
          },
        ]
      },
      {
        label: menu.help.help,
        role: 'help',
        submenu: [
          {
            label: menu.help.learnmore,
            click: function() { shell.openExternal('http://genaro.network') }
          },
        ]
      },
      {
        label: menu.language.language,
        submenu: [
          {
            label: '中文',
            click: function(menuItem, browserWindow, event) { 
              browserWindow.webContents.send('locale-language', 'zh')
              menu = getLocaleMenu('zh')
              app.updateMenu()
            }
          },
          {
            label: 'English',
            click: function(menuItem, browserWindow, event) { 
              browserWindow.webContents.send('locale-language', 'en')
              menu = getLocaleMenu('en')
              app.updateMenu()
            }
          },
        ]
      },
    ];
  
    if (process.platform === 'darwin') {
      const name = app.getName();
      template.unshift({
        label: name,
        submenu: [
          {
            label: 'About ' + name,
            role: 'about'
          },
          {
            type: 'separator'
          },
          {
            label: 'Services',
            role: 'services',
            submenu: []
          },
          {
            type: 'separator'
          },
          {
            label: 'Hide ' + name,
            accelerator: 'Command+H',
            role: 'hide'
          },
          {
            label: 'Hide Others',
            accelerator: 'Command+Shift+H',
            role: 'hideothers'
          },
          {
            label: 'Show All',
            role: 'unhide'
          },
          {
            type: 'separator'
          },
          {
            label: 'Quit',
            accelerator: 'Command+Q',
            click: function() { app.quit(); }
          },
        ]
      });
      const windowMenu = template.find(function(m) { return m.role === 'window' })
      if (windowMenu) {
        windowMenu.submenu.push(
          {
            type: 'separator'
          },
          {
            label: 'Bring All to Front',
            role: 'front'
          }
        );
      }
    }
  
    return template;
  }