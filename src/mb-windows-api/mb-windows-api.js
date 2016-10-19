const addon = require('../../build/Release/mb-windows-api.node');

// const electron = require('electron');
// const BrowserWindow = ((process.type=='browser')? electron.BrowserWindow : electron.remote);
// const app = remote.require('app');

const {ipcMain} = require('electron');
const {ipcRenderer} = require('electron');

const DEBUG_PREFIX = 'MbWinApi';



const typeApiModule = ((process.type=='browser') ?
  require('./mb-windows-api-main') : require('./mb-windows-api-renderer')
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

api.getAllWindows = function() {
  return addon.getAllWindows();
}

api.getWindowText = function(hwnd) {
  return addon.getWindowText(hwnd);
}

api.on = function(channel, listener) {
  typeApiModule.on(channel, listener);
}

api.SW_CMDS = {
  'SW_FORCEMINIMIZE': 11,
  'SW_HIDE': 0,
  'SW_MAXIMIZE': 3,
  'SW_MINIMIZE': 6,
  'SW_RESTORE': 9,
  'SW_SHOW': 5,
  'SW_SHOWDEFAULT': 10,
  'SW_SHOWMAXIMIZED': 3,
  'SW_SHOWMINIMIZED': 2,
  'SW_SHOWMINNOACTIVE': 7,
  'SW_SHOWNA': 8,
  'SW_SHOWNOACTIVATE': 4,
  'SW_SHOWNORMAL': 1
};
api.showWindow = function(hwnd, nCmdShow) {
  addon.showWindow(hwnd, nCmdShow);
}
api.setForegroundWindow = function(hwnd) {
  addon.setForegroundWindow(hwnd);
}

if(process.type == 'browser') {
  api.disableKeyLLKbHook = typeApiModule.disableKeyLLKbHook;
  api.enableKeyLLKbHook = typeApiModule.enableKeyLLKbHook;
}

if(process.type == 'renderer') {
  api.hookLLKb = typeApiModule.hookLLKb;
  api.disableKeyLLKbHook = typeApiModule.disableKeyLLKbHook;
  api.enableKeyLLKbHook = typeApiModule.enableKeyLLKbHook;
}

module.exports = api;


// Print HWND as hex
// var h = ("000000000000000" + hwndList[i].toString(16)).substr(-16);
// var h = hwndList[i].toString(16).toUpperCase();
