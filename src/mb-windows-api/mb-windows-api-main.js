const addon = require('../../build/Release/mb-windows-api.node');

const {BrowserWindow} = require('electron');
const {ipcMain} = require('electron');

const DEBUG_PREFIX = 'MbWinApi';

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

ipcMain.on(`${DEBUG_PREFIX}-lowlevelkeyboard-register-window-msg-add-win`,
  (event, arg) => {
  lowLevelKbHookVars.addListeningWindow(arg.winId);
  event.sender.send(`${DEBUG_PREFIX}-lowlevelkeyboard-register-window-msg-done`);
});

ipcMain.on(`${DEBUG_PREFIX}-lowlevelkeyboard-msg-recieved`, (event, arg) => {
  let n = lowLevelKbHookVars.windowsListening.length;
  for(let i = 0; i < n; i++){
    let winId = lowLevelKbHookVars.windowsListening[i];
    let win = BrowserWindow.fromId(winId);
    win.send(`${DEBUG_PREFIX}-lowlevelkeyboard-msg`, arg);
  }

  let n2 = lowLevelKbHookVars.listeners.length;
  for(let i = 0; i < n2; i++){
    lowLevelKbHookVars.listeners[i](arg);
  }
});


let on = (channel, listener) => {
  switch(channel){
    case 'lowlevelkeyboard-msg':
      // let win = BrowserWindow.fromId(lowLevelKbHookVars.winId);
      // win.send(`${DEBUG_PREFIX}-lowlevelkeyboard-hook`);
      lowLevelKbHookVars.addListener(listener);
      break;
    default:
      console.log('['+DEBUG_PREFIX+'] \'' + channel + '\' is not a valid channel');
      break;
  };
};

let disableKeyLLKbHook = (vkCode) => {
  let win = BrowserWindow.fromId(1);
  win.send(`${DEBUG_PREFIX}-lowlevelkeyboard-disableKeyLLKbHook`, vkCode);
};

let enableKeyLLKbHook = (vkCode) => {
  let win = BrowserWindow.fromId(1);
  win.send(`${DEBUG_PREFIX}-lowlevelkeyboard-enableKeyLLKbHook`, vkCode);
};

ipcMain.on(`${DEBUG_PREFIX}-lowlevelkeyboard-disableKeyLLKbHook`, (event, vkCode) => {
  let win = BrowserWindow.fromId(1);
  win.send(`${DEBUG_PREFIX}-lowlevelkeyboard-disableKeyLLKbHook2`, vkCode);
});

ipcMain.on(`${DEBUG_PREFIX}-lowlevelkeyboard-enableKeyLLKbHook`, (event, vkCode) => {
  let win = BrowserWindow.fromId(1);
  win.send(`${DEBUG_PREFIX}-lowlevelkeyboard-enableKeyLLKbHook2`, vkCode);
});

let api = {};
api.on = on;
api.disableKeyLLKbHook = disableKeyLLKbHook;
api.enableKeyLLKbHook = enableKeyLLKbHook;

module.exports = api;
