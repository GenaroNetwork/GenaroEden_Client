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
        label: app.menuSetting.menu.edit.edit,
        submenu: [
          {
            label: app.menuSetting.menu.edit.undo,
            accelerator: 'CmdOrCtrl+Z',
            role: 'undo'
          },
          {
            label: app.menuSetting.menu.edit.redo,
            accelerator: 'Shift+CmdOrCtrl+Z',
            role: 'redo'
          },
          {
            type: 'separator'
          },
          {
            label: app.menuSetting.menu.edit.cut,
            accelerator: 'CmdOrCtrl+X',
            role: 'cut'
          },
          {
            label: app.menuSetting.menu.edit.copy,
            accelerator: 'CmdOrCtrl+C',
            role: 'copy'
          },
          {
            label: app.menuSetting.menu.edit.paste,
            accelerator: 'CmdOrCtrl+V',
            role: 'paste'
          },
          {
            label: app.menuSetting.menu.edit.selectall,
            accelerator: 'CmdOrCtrl+A',
            role: 'selectall'
          },
        ]
      },
      {
        label: app.menuSetting.menu.view.view,
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
            label: app.menuSetting.menu.view.togglefullscreen,
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
            label: app.menuSetting.menu.view.toggledevelopertools,
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
        label: app.menuSetting.menu.window.window,
        role: 'window',
        submenu: [
          {
            label: app.menuSetting.menu.window.minimize,
            accelerator: 'CmdOrCtrl+M',
            role: 'minimize'
          },
          {
            label: app.menuSetting.menu.window.close,
            accelerator: 'CmdOrCtrl+W',
            role: 'close'
          },
        ]
      },
      {
        label: app.menuSetting.menu.help.help,
        role: 'help',
        submenu: [
          {
            label: app.menuSetting.menu.help.learnmore,
            click: function() { shell.openExternal('http://genaro.network') }
          },
        ]
      },
      {
        label: app.menuSetting.menu.language.language,
        submenu: [
          {
            label: '中文',
            click: function(menuItem, browserWindow, event) { 
              browserWindow.webContents.send('locale-language', 'zh')
              app.menuSetting.setLocale('zh')
              app.menuSetting.updateMenu()
            }
          },
          {
            label: 'English',
            click: function(menuItem, browserWindow, event) { 
              browserWindow.webContents.send('locale-language', 'en')
              app.menuSetting.setLocale('en')
              app.menuSetting.updateMenu()
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
            label: app.menuSetting.menu.darwin.about + ' ' + name,
            role: 'about'
          },
          {
            type: 'separator'
          },
          {
            label: app.menuSetting.menu.darwin.services,
            role: 'services',
            submenu: []
          },
          {
            type: 'separator'
          },
          {
            label: app.menuSetting.menu.darwin.hide + ' ' + name,
            accelerator: 'Command+H',
            role: 'hide'
          },
          {
            label: app.menuSetting.menu.darwin.hideothers,
            accelerator: 'Command+Shift+H',
            role: 'hideothers'
          },
          {
            label: app.menuSetting.menu.darwin.showall,
            role: 'unhide'
          },
          {
            type: 'separator'
          },
          {
            label: app.menuSetting.menu.darwin.quit,
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
            label: app.menuSetting.menu.darwin.front,
            role: 'front'
          }
        );
      }
    }
  
    return template;
  }