require('./src/core');
const mbWinApi = require('./src/mb-windows-api');
// console.log(mbWinApi);
// mbWinApi.enableMouse();
// mbWinApi.disableMouse();

// var addon = require('bindings')('mb-windows-api');

// let processesList = require();
require('./src/processes-list/processes-list');
require('./src/workspaces-manager/workspaces-manager-gui');

var containerElem = document.querySelector('#main-container');


let workspacesManagerGui = document.createElement('workspaces-manager-gui');
containerElem.appendChild(workspacesManagerGui);

let processesList = document.createElement('processes-list');
containerElem.appendChild(processesList);




// let btn = document.createElement('div');
// btn.style.width = '200px';
// btn.style.height = '40px';
// btn.style.backgroundColor = 'green';
// containerElem.appendChild(btn);
//
// btn.addEventListener('mousedown', () => {
//   // mbWinApi.start(function() {
//   //   console.log('Meh');
//   // });
// });



mbWinApi.on('lowlevelkeyboard-msg', (evt) =>{
  // console.log('lowlevelkeyboard:');
  console.log(evt);
});

// mbWinApi.disableKeyLLKbHook(103);
// mbWinApi.disableKeyLLKbHook(104);
