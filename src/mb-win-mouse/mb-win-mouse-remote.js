const bindings = require('bindings');
const addon = bindings('mb-win-mouse');

// const electron = require('electron');
// const BrowserWindow = ((process.type=='browser')? electron.BrowserWindow : electron.remote);
// const app = remote.require('app');

const remote = require('electron').remote
const {ipcRenderer} = require('electron');

const DEBUG_PREFIX = 'MbWinMouse';
const IPC_PREFIX = 'mb-win-mouse';

let hookMouseListeners = [];

let on = (channel, listener) => {
  switch(channel){
    case `message`:
      hookMouseListeners.push(listener);
      let winId = remote.getCurrentWindow().id;
      ipcRenderer.send(`${IPC_PREFIX}-register`, {winId: winId});
      break;
    default:
      console.log('['+DEBUG_PREFIX+'] \'' + channel + '\' is not a valid channel');
      break;
  };
};


///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IPC
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
ipcRenderer.on(`${IPC_PREFIX}-message`, (event, arg) => {
  let n = hookMouseListeners.length;
  for(let i = 0; i < n; i++){
    hookMouseListeners[i](arg);
  }
});



///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
let api = {};
api.on=on;
// api.disableVkCodeKey=(args)=>ipcRenderer.send(`${IPC_PREFIX}-disable-vkcode-key`,args);
// api.enableVkCodeKey=(args)=>ipcRenderer.send(`${IPC_PREFIX}-enable-vkcode-key`,args);

module.exports = api;
