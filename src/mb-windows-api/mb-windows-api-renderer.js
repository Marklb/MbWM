const addon = require('../../build/Release/mb-windows-api.node');

const remote = require('electron').remote
const {ipcRenderer} = require('electron');

const DEBUG_PREFIX = 'MbWinApi';


let hookLLKbListeners = [];

let hookLLKb = (winId) => {
  // return addon.hookLLKb((arg) => {
  addon.hookLLKb((arg) => {
    // console.log(`msg: ${arg.msg}`);
    // console.log(`keyCode: ${arg.vkCode}`);
    ipcRenderer.send(`${DEBUG_PREFIX}-lowlevelkeyboard-msg-recieved`, arg);
  });
  setTimeout(() => {
    ipcRenderer.send(`lowlevelkeyboard-done-hooking`, arg);
  }, 100);
}

ipcRenderer.on(`${DEBUG_PREFIX}-lowlevelkeyboard-register-window-msg-done`,
  (event, arg) => {
  // ipcRenderer.on(`${DEBUG_PREFIX}-lowlevelkeyboard-register-window-msg`, (event, arg) => {
  //   console.log('[LLKb] Register Window Msg:');
  //   console.log(arg);
  // });
});

ipcRenderer.on(`${DEBUG_PREFIX}-lowlevelkeyboard-msg`, (event, arg) => {
  let n = hookLLKbListeners.length;
  for(let i = 0; i < n; i++){
    hookLLKbListeners[i](arg);
  }
});

let on = (channel, listener) => {
  switch(channel){
    case 'lowlevelkeyboard-msg':
      hookLLKbListeners.push(listener);
      ipcRenderer.send(`${DEBUG_PREFIX}-lowlevelkeyboard-register-window-msg-add-win`,{
        winId: remote.getCurrentWindow().id
      });

      break;
    default:
      console.log('['+DEBUG_PREFIX+'] \'' + channel + '\' is not a valid channel');
      break;
  };
};

let disableKeyLLKbHook = (vkCode) => {
  if(remote.getCurrentWindow().id != 1){
    ipcRenderer.send(`${DEBUG_PREFIX}-lowlevelkeyboard-disableKeyLLKbHook`, vkCode);
  }else{
    addon.disableKeyLLKbHook(vkCode);
  }
};

let enableKeyLLKbHook = (vkCode) => {
  if(remote.getCurrentWindow().id != 1){
    ipcRenderer.send(`${DEBUG_PREFIX}-lowlevelkeyboard-disableKeyLLKbHook`, vkCode);
  }else{
    addon.enableKeyLLKbHook(vkCode);
  }
};

ipcRenderer.on(`${DEBUG_PREFIX}-lowlevelkeyboard-disableKeyLLKbHook2`, (event, vkCode) => {
  disableKeyLLKbHook(vkCode);
});

ipcRenderer.on(`${DEBUG_PREFIX}-lowlevelkeyboard-enableKeyLLKbHook2`, (event, vkCode) => {
  enableKeyLLKbHook(vkCode);
});


let api = {};
api.on=  on;
api.hookLLKb = hookLLKb;
api.disableKeyLLKbHook = disableKeyLLKbHook;
api.enableKeyLLKbHook = enableKeyLLKbHook;

module.exports = api;
