const bindings = require('bindings');
const addon = bindings('mb-win-ll-keyboard');

// const electron = require('electron');
// const BrowserWindow = ((process.type=='browser')? electron.BrowserWindow : electron.remote);
// const app = remote.require('app');

const {BrowserWindow} = require('electron');
const {ipcMain} = require('electron');

const DEBUG_PREFIX = 'MbWinLLKb';
const IPC_PREFIX = 'mb-win-ll-kb';


let lowLevelKbHookVars = {
  windowsListening: [],
  addListeningWindow: (winId) => {
    if(lowLevelKbHookVars.windowsListening.indexOf(winId) == -1){
      lowLevelKbHookVars.windowsListening.push(winId);
    }
  },
  listeners: [],
  addListener: (listener) => {
    lowLevelKbHookVars.listeners.push(listener);
  }

};

let hook = () => {
  addon.hookLLKb((args) => {
    // console.log(`${DEBUG_PREFIX}: msg: ${args.msg}   vkCode: ${args.vkCode}   scanCode: ${args.scanCode}`);
    let listeners = lowLevelKbHookVars.listeners;
    let n = lowLevelKbHookVars.listeners.length;
    for(let i = 0; i < n; i++){
      listeners[i](args);
    }

    n = lowLevelKbHookVars.windowsListening.length;
    for(let i = 0; i < n; i++){
      let winId = lowLevelKbHookVars.windowsListening[i];
      let win = BrowserWindow.fromId(winId);
      win.send(`${IPC_PREFIX}-message`, args);
    }

  });
}

let on = (channel, listener) => {
  switch(channel){
    case `message`:
      lowLevelKbHookVars.addListener(listener);
      break;
    default:
      console.log('['+DEBUG_PREFIX+'] \'' + channel + '\' is not a valid channel');
      break;
  };
};


///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IPC
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
ipcMain.on(`${IPC_PREFIX}-register`, (event, args) => {
  lowLevelKbHookVars.addListeningWindow(args.winId);
});

ipcMain.on(`${IPC_PREFIX}-disable-vkcode-key`, (event, args) => {
  addon.disableVkCodeKey(args);
});

ipcMain.on(`${IPC_PREFIX}-enable-vkcode-key`, (event, args) => {
  addon.enableVkCodeKey(args);
});


///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
let api = {};
api.on=on;
api.hook=hook;
api.disableVkCodeKey=addon.disableVkCodeKey;
api.enableVkCodeKey=addon.enableVkCodeKey;

module.exports = api;
