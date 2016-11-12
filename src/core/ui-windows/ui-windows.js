// const electron = require('electron');
// const app = electron.app;  // Module to control application life.
const {app} = require('electron');
const {BrowserWindow} = require('electron');
const {ipcMain} = require('electron');

// import { uiCommandsLoader } from './windows/ui-commands';
// console.log(uiCommandsLoader);

import { UiCommands } from './windows/ui-commands';
console.log(UiCommands);
import { UiWorkspaces } from './windows/ui-workspaces';
console.log(UiWorkspaces);

// import { Commands } from '../commands';
// import { Keyboard } from '../keyboard';


export class UiWindows {
  constructor() {
    console.log('Loading UiWindows');

    this.commandsWindow = null;
    this.workspacesWindow = null;
    app.on('ready', () => {
      this.commandsWindow = UiCommands.loadWindow();
      this.workspacesWindow = UiWorkspaces.loadWindow();
    });
    this.commandsWindowOpen = false;
    this.workspacesWindowOpen = false;

    // Register shortcuts
    global.core.keyboard.registerShortcut('ctrl+f12', () => {
      if(this.commandsWindowOpen === true){
        console.log('Core: Hide commands menu');
        this.commandsWindowOpen = false;
        this.commandsWindow.hide();
      }else{
        console.log('Core: Show commands menu');
        this.commandsWindowOpen = true;
        this.commandsWindow.show();
      }
    });

    global.core.keyboard.registerShortcut('ctrl+f10', () => {
      if(this.workspacesWindowOpen === true){
        console.log('Core: Hide workspaces menu');
        this.workspacesWindowOpen = false;
        this.workspacesWindow.hide();
      }else{
        console.log('Core: Show workspaces menu');
        this.workspacesWindowOpen = true;
        this.workspacesWindow.show();
      }
    });
  }

  // openWindow(windowName) {
  //   uiCommandsLoader();
  // }




}

export default UiWindows;
