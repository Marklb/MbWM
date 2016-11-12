const bindings = require('bindings');
const addon = bindings('mb-win-ll-keyboard');

// const electron = require('electron');
// const BrowserWindow = ((process.type=='browser')? electron.BrowserWindow : electron.remote);
// const app = remote.require('app');

const {ipcMain} = require('electron');
const {ipcRenderer} = require('electron');

const DEBUG_PREFIX = 'MbWinLLKb';

const CONSTANTS = require('./mb-win-ll-keyboard-contants');

const typeApiModule = ((process.type=='browser') ?
  require('./mb-win-ll-keyboard-main') : require('./mb-win-ll-keyboard-remote')
);

if(process.type == 'browser'){
  // ipcMain.on('asynchronous-message', (event, arg) => {
  //   console.log(arg);  // prints "ping"
  //   event.sender.send('asynchronous-reply', 'pong');
  // });
  //
  // ipcMain.on('lowlevelkeyboard-register-window-msg', (event, arg) => {
  //   console.log('[LLKb] Register Window:');
  //   console.log(arg);  // prints "ping"
  //   // event.sender.send('asynchronous-reply', 'pong');
  // });

}


if(process.type == 'renderer'){
  // ipcRenderer.on('asynchronous-reply', (event, arg) => {
  //   console.log(arg); // prints "pong"
  // });
  // ipcRenderer.send('asynchronous-message', 'ping');
  //
  // ipcRenderer.on('lowlevelkeyboard-msg', (event, arg) => {
  //   console.log(arg); // prints "pong"
  // });



}





/*



*/
var api = {};

api.on = function(channel, listener) {
  typeApiModule.on(channel, listener);
}


api.CONSTANTS = CONSTANTS;

if(process.type == 'browser') {
  api.hook = typeApiModule.hook;
  api.disableVkCodeKey = typeApiModule.disableVkCodeKey;
  api.enableVkCodeKey = typeApiModule.enableVkCodeKey;

  api.getAsyncKeyState = addon.getAsyncKeyState;
  // api.getDisabledVkCodeKeys = addon.getDisabledVkCodeKeys;
  api.pressedKeys = addon.pressedKeys;
  api.disabledVkCodes = addon.disabledVkCodes;
}

if(process.type == 'renderer') {
  api.disableVkCodeKey = typeApiModule.disableVkCodeKey;
  api.enableVkCodeKey = typeApiModule.enableVkCodeKey;
}

module.exports = api;


// Print HWND as hex
// var h = ("000000000000000" + hwndList[i].toString(16)).substr(-16);
// var h = hwndList[i].toString(16).toUpperCase();
