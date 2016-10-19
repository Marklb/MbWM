'use babel';

const fs = require('fs');
// console.log(fs);

const electron = require('electron');
const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.
const ipcMain = electron.ipcMain;

const mbWinApi = require('./src/mb-windows-api');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;
var mainWindow2 = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 10,
    height: 10,
    autoHideMenuBar: true,
    show: false
  });
  // mainWindow.setPosition(-1400,150);

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/kbhook.html');

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // ${DEBUG_PREFIX}-lowlevelkeyboard-set-window-id
  mainWindow.webContents.on('did-finish-load', function() {
  // ipcMain.on(`lowlevelkeyboard-done-hooking`, (event, arg) => {
    // console.log('Done loading');
    // mainWindow.webContents.executeJavaScript("starter();");

    // Create the browser window.
    mainWindow2 = new BrowserWindow({
      width: 1000,
      height: 600,
      autoHideMenuBar: true,
      show: false,
      alwaysOnTop: true,
      fullscreen: true,
      frame: false,
      transparent: true
    });
    // mainWindow2.setPosition(-1400,150);

    // and load the index.html of the app.
    mainWindow2.loadURL('file://' + __dirname + '/index.html');

    // Open the DevTools.
    mainWindow2.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow2.on('closed', function() {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      mainWindow2 = null;
      mainWindow.close();
    });
    global.mainWindow2 = mainWindow2;

    mainWindow2.webContents.on('did-finish-load', function() {
      mainWindow.webContents.executeJavaScript("starter();");
      mainWindow2.show();
    });
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
  global.mainWindow = mainWindow;






});


mbWinApi.on('lowlevelkeyboard-msg', (evt) =>{
  // console.log('lowlevelkeyboard:');
  // console.log(evt);
});
