'use babel';

console.log('Starting App');

import { Core } from './src/core';

// Init the global core
global.core = new Core();
core._init();













// const fs = require('fs');
// // console.log(fs);
//
// const electron = require('electron');
// const app = electron.app;  // Module to control application life.
// const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.
// const ipcMain = electron.ipcMain;
//
// const mbLLKb = require(__dirname+'/src/mb-win-ll-keyboard');
// mbLLKb.hook();
// mbLLKb.disableVkCodeKey(mbLLKb.CONSTANTS.VK_NUMPAD7);
// mbLLKb.on('message', (args) => {
//   console.log(args);
// });
//
// const mbMouse = require(__dirname+'/src/mb-win-Mouse');
// mbMouse.hook();
// // mbMouse.disableVkCodeKey(mbMouse.CONSTANTS.VK_NUMPAD7);
// mbMouse.on('message', (args) => {
//   console.log(args);
// });
//
//
//
//
// // Keep a global reference of the window object, if you don't, the window will
// // be closed automatically when the JavaScript object is garbage collected.
// var mainWindow = null;
// // var mainWindow2 = null;
//
// // Quit when all windows are closed.
// app.on('window-all-closed', function() {
//   // On OS X it is common for applications and their menu bar
//   // to stay active until the user quits explicitly with Cmd + Q
//   if (process.platform != 'darwin') {
//     app.quit();
//   }
// });
//
// // This method will be called when Electron has finished
// // initialization and is ready to create browser windows.
// app.on('ready', function() {
//   // Create the browser window.
//   mainWindow = new BrowserWindow({
//     width: 1000,
//     height: 600,
//     autoHideMenuBar: true,
//     show: true,
//     alwaysOnTop: true,
//     // fullscreen: true,
//     // frame: false,
//     transparent: true
//   });
//   // mainWindow.setIgnoreMouseEvents(true);
//
//   // and load the index.html of the app.
//   mainWindow.loadURL('file://' + __dirname + '/index.html');
//
//   // Open the DevTools.
//   mainWindow.webContents.openDevTools();
//
//   // ${DEBUG_PREFIX}-lowlevelkeyboard-set-window-id
//   mainWindow.webContents.on('did-finish-load', function() {
//
//     // const workspaceDisplay = require('./src/browser-windows/workspace-display');
//     // console.log(workspaceDisplay);
//     // workspaceDisplay.createWindow();
//
//     const windowEditor = require('./src/browser-windows/window-editor');
//     console.log(windowEditor);
//     windowEditor.createWindow();
//
//
//   });
//
//   // Emitted when the window is closed.
//   mainWindow.on('closed', function() {
//     // Dereference the window object, usually you would store windows
//     // in an array if your app supports multi windows, this is the time
//     // when you should delete the corresponding element.
//
//     mainWindow = null;
//     let wins = BrowserWindow.getAllWindows();
//     for(let i = 0; i < wins.length; i++){
//       wins[i].close();
//     }
//   });
//   global.mainWindow = mainWindow;
//
//
//
//
//
//
// });


// const WinMouse = require('win-mouse');
// let mouse = WinMouse();
// mouse.on('move', (x, y) => {
//     console.log(x, y);
// });


// You must have at least 3.10.8 version of NPM. This is critical.
// npm -g install npm@next
//
// Make sure Node globally uses the same version 2015
// npm config set msvs_version 2015 --global


// var bindings = require('bindings');
// var mbWinLLKb = bindings('mb-win-ll-keyboard');
// mbWinLLKb.hookLLKb(
//   (arg) => {
//     console.log(arg);
//     // console.log(`msg: ${arg.msg}`);
//     // console.log(`keyCode: ${arg.vkCode}`);
//     // ipcRenderer.send(`${DEBUG_PREFIX}-lowlevelkeyboard-msg-recieved`, arg);
//   }
// );
