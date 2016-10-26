console.log('Imported window-editor Main');

const electron = require('electron');
const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.
const ipcMain = electron.ipcMain;

let createWindow = () => {

  // Create the browser window.
  var win = new BrowserWindow({
    width: 1200,
    height: 800,
    autoHideMenuBar: true,
    show: true,
    // frame: false,
    alwaysOnTop: true
  });
  // win.setPosition(10,10);

  // and load the index.html of the app.
  win.loadURL('file://' + __dirname + '/index.html');

  // Open the DevTools.
  win.webContents.openDevTools();

  // ${DEBUG_PREFIX}-lowlevelkeyboard-set-window-id
  win.webContents.on('did-finish-load', function() {

  });

  // Emitted when the window is closed.
  win.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
};

module.exports = {
   'createWindow': createWindow
}
