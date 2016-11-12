require('./src/core');

const mbWinApi = require('./src/mb-win-api');
const mbLLKb = require(__dirname+'/src/mb-win-ll-keyboard');
mbLLKb.on('message', (args) => {
  console.log(args);
});

// const mbMouse = require(__dirname+'/src/mb-win-mouse');
// mbMouse.on('message', (args) => {
//   console.log(args);
// });




// let processesList = require();
require('./src/processes-list/processes-list');
require('./src/workspaces-manager/workspaces-manager-gui');

var containerElem = document.querySelector('#main-container');


let workspacesManagerGui = document.createElement('workspaces-manager-gui');
containerElem.appendChild(workspacesManagerGui);

const {BrowserWindow} = require('electron').remote;

let btn = document.createElement('div');
btn.style.width = '200px';
btn.style.height = '40px';
btn.style.backgroundColor = 'green';
containerElem.appendChild(btn);

btn.addEventListener('mousedown', () => {
  // mbWinApi.start(function() {
  //   console.log('Meh');
  // });
  let mainWindow3 = new BrowserWindow({
    width: 1000,
    height: 600,
    autoHideMenuBar: true,
    show: true,
    alwaysOnTop: true//,
    // fullscreen: true,
    // frame: false,
    // transparent: true
  });
  // mainWindow3.setPosition(-1400,150);

  // and load the index.html of the app.
  mainWindow3.loadURL('file://' + __dirname + '/src/win-overlay/win-overlay.html');

  // Open the DevTools.
  mainWindow3.webContents.openDevTools();
});



// mbWinApi.disableKeyLLKbHook(103);
// mbWinApi.disableKeyLLKbHook(104);

// window.addEventListener('mousemove', (e) => {
//   console.log('moving');
// });


// let win = require('electron').remote.getCurrentWindow();
// // let WM_MOUSEMOVE = 0x0200;
// let WM_MOUSEMOVE = 512;
// win.hookWindowMessage(WM_MOUSEMOVE, (e) => {
//   console.log('Moving');
// });
