'use babel';
let fs = require('fs');

// Electron imports
// const electron = require('electron');
// const remote = electron.remote;
// const app = remote.require('app');
// const BrowserWindow = remote.BrowserWindow;

// App imports
// const mblib = require(app.getAppPath()+'/src/mblib/mblib.js');
// const mblibCSS = mblib.css;
// const mblibElectron = mblib.electron;
const mbWinApi = require('../mb-windows-api');


// CSS files
// const CSS_FILES_LIST = [
//   '../css/mb-styles.css',
//   './processes-list.css'
// ];
let css1 = fs.readFileSync('./src/processes-list/processes-list.css');
let css2 = fs.readFileSync('./src/styles.css');
let css='<style>'+css1+css2+'</style>';


class ProcessesList extends HTMLElement {
  createdCallback() {
    this.root = this.createShadowRoot();
    this.root.innerHTML += css;

    this.listElement = document.createElement('div');
    this.listElement.classList.add('list-container');
    this.root.appendChild(this.listElement);

    this.selectedSetHwnd = null;
    this.selectedSetElem = null;

    window.addEventListener('keydown', (e) => {
      if(e.repeat == false){
        // console.log(e);
        if(this.selectedSetHwnd != null){
          core.workspacesManager.getCurrentWorkspace().setProcessKey(this.selectedSetHwnd, e.keyCode, e.code);
          this.refresh();
        }
      }
    },false);
  }

  attachedCallback() {
    this.refresh();

    mbWinApi.disableKeyLLKbHook(116);
    mbWinApi.on('lowlevelkeyboard-msg', (evt) =>{
      if(evt.msg == 256){
        if(evt.vkCode == 116){
          this.refresh();
        }
      }
    });
  }

  refresh() {
    this.selectedSetHwnd = null;
    this.selectedSetElem = null;


    this.listElement.innerHTML = '';
    let list = mbWinApi.getAllWindows();
    for(let i = 0; i < list.length; i++){
      let isOnAWorkspace = core.workspacesManager.isProcessOnAWorkspace(list[i], false)
      console.log(isOnAWorkspace);
      if(isOnAWorkspace === true){
        continue;
      }
      let item = {
        'hwnd': list[i],
        'caption': mbWinApi.getWindowText(list[i])
      };
      let itemElem = document.createElement('div');
      itemElem.classList.add('list-item');
      itemElem.classList.add('noselect');
      itemElem.innerHTML = item.caption;
      let key = core.workspacesManager.getCurrentWorkspace().getProcessKey(list[i]);
      if(key){
        itemElem.innerHTML += `[${key.vkCode}][${key.keyText}]`;
      }
      itemElem.userData = {
        'itemData': item
      };
      let procList = core.workspacesManager.getCurrentWorkspace().getProcesses();
      for(let i = 0; i < procList.length; i++){
        if(procList[i] === item.hwnd){
          itemElem.classList.add('selected');
          break;
        }
      }
      this.listElement.appendChild(itemElem);

      itemElem.addEventListener('mousedown', this.onClickItem.bind(this));
    }
  }

  onClickItem(evt) {
    let clickedElem = evt.target;
    if(evt.button === 0){// Left click
      let item = clickedElem.userData.itemData;
      console.log('Clicked: %s', item.caption);
      core.workspacesManager.getCurrentWorkspace().toggleProcess(item.hwnd);
      this.refresh();
    }else if(evt.button === 2){// Right click
      let item = clickedElem.userData.itemData;
      this.selectedSetHwnd = item.hwnd;
      if(this.selectedSetElem !== null){
        this.selectedSetElem.classList.remove('selected-set');
      }
      clickedElem.classList.add('selected-set');
      this.selectedSetElem = clickedElem;
    }
  }






}

document.registerElement('processes-list', ProcessesList);

(function (name, definition){
  if (typeof define === 'function'){ // AMD
    define(definition);
  } else if (typeof module !== 'undefined' && module.exports) { // Node.js
    module.exports = definition();
  } else { // Browser
    var theModule = definition(), global = this, old = global[name];
    theModule.noConflict = function () {
      global[name] = old;
      return theModule;
    };
    global[name] = theModule;
  }
})('ProcessesList', function () {

  // return the module's API
  return ProcessesList;

});
