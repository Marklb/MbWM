const {BrowserWindow} = require('electron');
const {ipcMain} = require('electron');

export class Commands {
  constructor() {
    console.log('Loading Commands');
    this.registeredCommands = {};

  }

  registerCommand(selector, callback, winId = null) {
    this.registeredCommands[selector] = {
      winId: winId,
      callback: callback
    };
  }

  execCommand(selector) {
    let command = this.registeredCommands[selector];
    if(command === undefined){
      // TODO: Show error
      console.log(`Command ${selector} is undefined`);
    }

    if(command.winId === null){
      command.callback();
    }else{
      let win = BrowserWindow.fromId(command.winId);
      win.send('app-command', selector);
    }

  }


}

export default Commands;
