
const mbLLKb = require(__dirname+'/../../mb-win-ll-keyboard');
// mbLLKb.hook();
// // mbLLKb.disableVkCodeKey(mbLLKb.CONSTANTS.VK_NUMPAD7);
// mbLLKb.on('message', (args) => {
//   console.log(args);
// });

const {BrowserWindow} = require('electron');
const {ipcMain} = require('electron');

let ACCELERATOR_LABELS = {
  'f1': mbLLKb.CONSTANTS.VK_F1,
  'f2': mbLLKb.CONSTANTS.VK_F2,
  'f3': mbLLKb.CONSTANTS.VK_F3,
  'f4': mbLLKb.CONSTANTS.VK_F4,
  'f5': mbLLKb.CONSTANTS.VK_F5,
  'f6': mbLLKb.CONSTANTS.VK_F6,
  'f7': mbLLKb.CONSTANTS.VK_F7,
  'f8': mbLLKb.CONSTANTS.VK_F8,
  'f9': mbLLKb.CONSTANTS.VK_F9,
  'f10': mbLLKb.CONSTANTS.VK_F10,
  'f11': mbLLKb.CONSTANTS.VK_F11,
  'f12': mbLLKb.CONSTANTS.VK_F12
};

export class AcceleratorKey {
  static keysLookupTable = {
    'ctrl': [mbLLKb.CONSTANTS.VK_CONTROL,
      mbLLKb.CONSTANTS.VK_LCONTROL,
      mbLLKb.CONSTANTS.VK_RCONTROL],
    'lctrl': [mbLLKb.CONSTANTS.VK_LCONTROL],
    'rctrl': [mbLLKb.CONSTANTS.VK_RCONTROL],

    'alt': [mbLLKb.CONSTANTS.VK_MENU,
      mbLLKb.CONSTANTS.VK_LMENU,
      mbLLKb.CONSTANTS.VK_RMENU],
    'lalt': [mbLLKb.CONSTANTS.VK_LMENU],
    'ralt': [mbLLKb.CONSTANTS.VK_RMENU],

    'shift': [mbLLKb.CONSTANTS.VK_SHIFT,
      mbLLKb.CONSTANTS.VK_LSHIFT,
      mbLLKb.CONSTANTS.VK_RSHIFT],
    'lshift': [mbLLKb.CONSTANTS.VK_LSHIFT],
    'rshift': [mbLLKb.CONSTANTS.VK_RSHIFT],

    'f1': [mbLLKb.CONSTANTS.VK_F1],
    'f2': [mbLLKb.CONSTANTS.VK_F2],
    'f3': [mbLLKb.CONSTANTS.VK_F3],
    'f4': [mbLLKb.CONSTANTS.VK_F4],
    'f5': [mbLLKb.CONSTANTS.VK_F5],
    'f6': [mbLLKb.CONSTANTS.VK_F6],
    'f7': [mbLLKb.CONSTANTS.VK_F7],
    'f8': [mbLLKb.CONSTANTS.VK_F8],
    'f9': [mbLLKb.CONSTANTS.VK_F9],
    'f10': [mbLLKb.CONSTANTS.VK_F10],
    'f11': [mbLLKb.CONSTANTS.VK_F11],
    'f12': [mbLLKb.CONSTANTS.VK_F12]
  };

  constructor(key) {
    this._matches = AcceleratorKey.keysLookupTable[key];
    this.enable();
  }

  enable() {
    for(var i = 0; i < this._matches.length; i++){
      mbLLKb.disableVkCodeKey(this._matches[i]);
    }
  }

  disable() {
    for(var i = 0; i < this._matches.length; i++){
      mbLLKb.enableVkCodeKey(this._matches[i]);
    }
  }

  isDown() {
    for(var i = 0; i < this._matches.length; i++){
      if(mbLLKb.pressedKeys[this._matches[i]] === true){
        return true;
      }
    }
    return false;
  }


}


export class Accelerator {
  static DELIMITER = '+';

  constructor(identifierStr) {
    this._keys = [];
    let a = identifierStr.split(Accelerator.DELIMITER);
    for(let i = 0; i < a.length; i++){
      this._keys.push(new AcceleratorKey(a[i]));
    }

    this.identifierStr = identifierStr;
  }

  isActive() {
    for(let i = 0; i < this._keys.length; i++){
      if(this._keys[i].isDown() === false){
        return false;
      }
    }
    return true;
  }

  getString() {
    return this.identifierStr;
  }


}


export class Keyboard {
  static ACCELERATOR_DELIMITER = '+';
  constructor() {
    console.log('Loading Keyboard');
    this._registeredShortcuts = [];

    // Hook the low level keyboard windows message
    mbLLKb.hook();
    // Listen for low level keyboard messages
    mbLLKb.on('message', (args) => {
      // 256 -> key up    257 -> key down
      if(args.msg === mbLLKb.CONSTANTS.WM_KEYDOWN && args.isRepeat == false){
        // Check if key pressed is a disabled key before _attemptExecShorcut
        if(mbLLKb.disabledVkCodes[args.vkCode] == true){
          this._attemptExecShorcut();
        }
      }

      if(args.msg === mbLLKb.CONSTANTS.WM_KEYUP){

      }

      // args.scanCode = 9999; // Can be read in the addon after fn->Call()
    });



  }

  registerShortcut(accelerator, callback, winId = null) {
    this._registeredShortcuts.push({
      accelerator: new Accelerator(accelerator),
      callback: callback,
      winId: winId
    });
  }

  _attemptExecShorcut() {
    for(let shortcut of this._registeredShortcuts){
      if(shortcut.accelerator.isActive() === true){
        if(shortcut.winId === null){
          shortcut.callback();
        }else{
          let win = BrowserWindow.fromId(shortcut.winId);
          win.send('app-shortcut', shortcut.accelerator.getString());
        }
        return;
      }
    }
  }


}

export default Keyboard;
