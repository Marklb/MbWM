import { Commands } from './commands';
import { Keyboard } from './keyboard';
import { UiWindows } from './ui-windows';
import { Workspaces } from './workspaces';

// import { virtualScreens } from './virtual-screens';
const virtualScreens = require('./virtual-screens');
console.log(virtualScreens);

const {app} = require('electron');

// const mbMouse = require(app.getAppPath()+'/src/mb-win-mouse');
// mbMouse.on('message', (args) => {
//   console.log(args);
// });

const mbMouse = require(app.getAppPath()+'/src/mb-win-mouse');
mbMouse.hook();
mbMouse.on('message', (args) => {
  // console.log(args);
});

export class Core {
  constructor() {
    console.log('Loading Core');
  }

  _init() {
    console.log('Init Core');
    this.commands = new Commands();
    this.keyboard = new Keyboard();
    this.uiWindows = new UiWindows();
    this.workspaces = new Workspaces();
  }


};

export default Core;
