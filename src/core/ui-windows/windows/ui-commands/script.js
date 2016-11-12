const fs = require('fs');
const less = require('less');
less.renderSync = function (input, options) {
    if (!options || typeof options != "object") options = {};
    options.sync = true;
    var css;
    this.render(input, options, function (err, result) {
        if (err) throw err;
        css = result.css;
    });
    return css;
};
const cssContent = less.renderSync(
  fs.readFileSync(__dirname+'/ui-commands.less','UTF-8'));
const css = `<style>${cssContent}</style>`;

// console.log(css);
document.getElementsByTagName('head')[0].innerHTML += css;

const electron = require('electron');
const {app} = require('electron').remote;
// const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.remote;  // Module to create native browser window.

const { virtualScreens } = require('../../../virtual-screens');

const FramelessWindowUtils = require(app.getAppPath()+'/src/frameless-window-utils');

(function(){
let win = BrowserWindow.getCurrentWindow();
let framelessWindowUtils = new FramelessWindowUtils(win);

// ----------------------------------------
let primaryVirtualScreenRect = virtualScreens.getPrimaryVirtualDisplayBounds();
let allScreensDispRect = virtualScreens.getAllScreensDisplayBounds();
// ----------------------------------------
// var testDiv = document.querySelector('.test-div');
// testDiv.innerHTML = 'Primary Display';
// testDiv.style.top = `${primaryVirtualScreenRect.top}px`;
// testDiv.style.left = `${primaryVirtualScreenRect.left}px`;
// testDiv.style.width = `${primaryVirtualScreenRect.width}px`;
// testDiv.style.height = `${primaryVirtualScreenRect.height}px`;
// ----------------------------------------
let allVirtualDispsBounds = virtualScreens.getAllVirtualDisplaysBounds();
// for(let i = 0; i < allVirtualDispsBounds.length; i++){
//   let bounds = allVirtualDispsBounds[i];
//   let tmpDiv = document.createElement('div');
//   tmpDiv.classList.add('test-div');
//   tmpDiv.innerHTML = `Display: ${i+1}`;
//   tmpDiv.style.top = `${bounds.top}px`;
//   tmpDiv.style.left = `${bounds.left}px`;
//   tmpDiv.style.width = `${bounds.width}px`;
//   tmpDiv.style.height = `${bounds.height}px`;
//   document.body.appendChild(tmpDiv);
// }
// ----------------------------------------

// ----------------------------------------
let uiCommandContainer = document.querySelector('.ui-command-container');
uiCommandContainer.style.top = `${primaryVirtualScreenRect.top}px`;
uiCommandContainer.style.left = `${primaryVirtualScreenRect.left}px`;
uiCommandContainer.style.width = `${primaryVirtualScreenRect.width}px`;
uiCommandContainer.style.height = `${primaryVirtualScreenRect.height}px`;
// ----------------------------------------

// ----------------------------------------
// Mouse Debugger
// ----------------------------------------
let mouseDebugElement = document.querySelector('.debug-panel.mouse-debug');
mouseDebugElement.style.top = `${allVirtualDispsBounds[2].top+10}px`;
mouseDebugElement.style.left = `${allVirtualDispsBounds[2].left+10}px`;
mouseDebugElement.style.width = `${300}px`;
mouseDebugElement.style.height = `${100}px`;

let mouseDebugPosElem = mouseDebugElement.querySelector('.mouse-pos');
// ----------------------------------------

// ----------------------------------------
// Hover Element Debugger
// ----------------------------------------
let hoverElemDebugElement = document.querySelector('.debug-panel.hover-elem-debug');
hoverElemDebugElement.style.top = `${allVirtualDispsBounds[2].top+10+100+10}px`;
hoverElemDebugElement.style.left = `${allVirtualDispsBounds[2].left+10}px`;
hoverElemDebugElement.style.width = `${300}px`;
hoverElemDebugElement.style.height = `${100}px`;

let hoverElemDebugPosTLElem = hoverElemDebugElement.querySelector('.pos-tl');
let hoverElemDebugPosBRElem = hoverElemDebugElement.querySelector('.pos-br');
// ----------------------------------------



let inputContainer = document.getElementsByClassName('input-container')[0];
inputContainer.addEventListener('mouseover', (e) => {
  console.log('mouseover');

  // win.setIgnoreMouseEvents(false);
});
inputContainer.addEventListener('mouseout', (e) => {
  console.log('mouseout');

  // win.setIgnoreMouseEvents(true);
});

framelessWindowUtils.registerInteractableElement(inputContainer);
framelessWindowUtils.registerInteractableElement(mouseDebugElement);
framelessWindowUtils.registerInteractableElement(hoverElemDebugElement);


let cmdsInputElement = document.body.querySelector('.commands-input');
console.log(cmdsInputElement);
// win.isVisible()

const mbMouse = require(app.getAppPath()+'/src/mb-win-mouse');
mbMouse.on('message', (args) => {
  if(args.msg === 513){
    console.log(`MouseDown: (${args.x}, ${args.y})`);
  }

  mouseDebugPosElem.innerHTML = `Mouse position: (${args.x}, ${args.y})`

  framelessWindowUtils.checkInteractableElements({x: args.x, y: args.y});
});
})();
