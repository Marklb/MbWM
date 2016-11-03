'use babel';
let fs = require('fs');

// Electron imports
// const electron = require('electron');
// const remote = electron.remote;
// const app = remote.require('app');
// const BrowserWindow = remote.BrowserWindow;

// App imports
const mbWinApi = require(__dirname+'/../../../../mb-win-api');
// console.log(mbWinApi);

let _htmlTplFileContent = fs.readFileSync(__dirname+'/window-editor.html');
document.body.innerHTML += _htmlTplFileContent;

// CSS files
// const CSS_FILES_LIST = [
//   '../css/mb-styles.css',
//   './processes-list.css'
// ];
let css1 = fs.readFileSync(__dirname+'/window-editor.css');
let css2 = fs.readFileSync(__dirname+'/../../../../styles.css');
let css='<style>'+css1+css2+'</style>';



class WindowEditor extends HTMLElement {
  createdCallback() {
    this.root = this.createShadowRoot();
    this.root.innerHTML += css;

    let tpl = document.querySelector('template#tpl-window-editor');
    let clone = document.importNode(tpl.content, true);
    this.root.appendChild(clone);

    // this.listElement = document.createElement('div');
    // this.listElement.classList.add('list-container');
    // this.root.appendChild(this.listElement);

    this.selectedSetHwnd = null;
    this.selectedSetElem = null;

    window.addEventListener('keydown', (e) => {
      if(e.repeat == false){
        // console.log(e);
        if(this.selectedSetHwnd != null){
          // core.workspacesManager.getCurrentWorkspace().setProcessKey(this.selectedSetHwnd, e.keyCode, e.code);
          // this.refresh();
        }
      }
    },false);
  }

  attachedCallback() {
    this.listElement = this.root.querySelector('.procs-list');
    this.refresh();

    // mbWinApi.disableKeyLLKbHook(116);
    // mbWinApi.on('lowlevelkeyboard-msg', (evt) =>{
    //   if(evt.msg == 256){
    //     if(evt.vkCode == 116){
    //       this.refresh();
    //     }
    //   }
    // });
  }

  refresh() {
    this.selectedSetHwnd = null;
    this.selectedSetElem = null;


    this.listElement.innerHTML = '';
    let list = mbWinApi.getAllWindows();
    for(let i = 0; i < list.length; i++){
      let proc = list[i];

      let item = {
        'hwnd': list[i],
        'caption': mbWinApi.getWindowText(list[i])
      };
      let itemElem = document.createElement('div');
      itemElem.classList.add('list-item');
      itemElem.classList.add('noselect');
      itemElem.innerHTML = item.caption;
      itemElem.userData = {
        'itemData': item
      };
      this.listElement.appendChild(itemElem);

      itemElem.addEventListener('mousedown', this.onClickItem.bind(this));
    }
  }

  refreshEdittingBox() {
    if(!this.selectedSetHwnd) return;
    this.edittingBoxSet = true;
    // console.log('refreshEdittingBox');
    let hWnd = this.selectedSetHwnd;
    // console.log(hWnd);
    let winCaptionElem = this.root.querySelector('.window-caption');
    winCaptionElem.innerHTML = mbWinApi.getWindowText(hWnd);

    let winPos = mbWinApi.getWindowCoordinates(hWnd);

    let winPosGrpElem = this.root.querySelector('.window-position');
    let inputLeft  = winPosGrpElem.querySelector('input[name="win-left"]');
    let inputTop  = winPosGrpElem.querySelector('input[name="win-top"]');
    let inputRight  = winPosGrpElem.querySelector('input[name="win-right"]');
    let inputBottom  = winPosGrpElem.querySelector('input[name="win-bottom"]');
    inputLeft.value = winPos.left;
    inputTop.value = winPos.top;
    inputRight.value = winPos.right;
    inputBottom.value = winPos.bottom;
    if(!this.edittingBoxSet){
      let winPosSetBtn = winPosGrpElem.querySelector('.set-position');
      winPosSetBtn.addEventListener('mousedown', (e) => {
        // console.log(`Set | left: ${inputLeft.value}, top: ${inputTop.value}, right: ${inputRight.value}, bottom: ${inputBottom.value}`);

        mbWinApi.setWindowPos(hWnd, null, inputLeft.value, inputTop.value,
          (inputRight.value-inputLeft.value), (inputBottom.value-inputTop.value),
          mbWinApi.CONSTANTS.SWP_ASYNCWINDOWPOS | mbWinApi.CONSTANTS.SWP_DEFERERASE);

        this.refreshEdittingBox();
      });
    }

    let grpToggles = this.root.querySelector('.option-group.toggle');
    let isTopMostToggleBtn = this.root.querySelector('.btn.is-top-most');

    let isTopMost = (mbWinApi.getWindowLongPtr(hWnd,
      mbWinApi.CONSTANTS.GWL_EXSTYLE) & mbWinApi.CONSTANTS.WS_EX_TOPMOST)
      ? 'TRUE' : 'FALSE';
    isTopMostToggleBtn.innerHTML = `IsTopMost[${isTopMost}]`;
    if(!this.edittingBoxSet){
      isTopMostToggleBtn.addEventListener('mousedown', (e) => {

        let dwStyle = mbWinApi.getWindowLongPtr(hWnd, mbWinApi.CONSTANTS.GWL_EXSTYLE);

        if(dwStyle & mbWinApi.CONSTANTS.WS_EX_TOPMOST){
          mbWinApi.setWindowPos(hWnd,mbWinApi.CONSTANTS.HWND_NOTOPMOST,0,0,0,0,
            mbWinApi.CONSTANTS.SWP_NOMOVE | mbWinApi.CONSTANTS.SWP_NOSIZE);
        }else{
          mbWinApi.setWindowPos(hWnd,mbWinApi.CONSTANTS.HWND_TOPMOST,0,0,0,0,
            mbWinApi.CONSTANTS.SWP_NOMOVE | mbWinApi.CONSTANTS.SWP_NOSIZE);
        }

        this.refreshEdittingBox();
      });
    }

    let hasCaptionToggleBtn = this.root.querySelector('.btn.has-caption');

    let hasCaption = (mbWinApi.getWindowLongPtr(hWnd,
      mbWinApi.CONSTANTS.GWL_STYLE) & mbWinApi.CONSTANTS.WS_CAPTION)
      ? 'TRUE' : 'FALSE';
    let hasBorder = (mbWinApi.getWindowLongPtr(hWnd,
      mbWinApi.CONSTANTS.GWL_STYLE) & mbWinApi.CONSTANTS.WS_BORDER)
      ? 'TRUE' : 'FALSE';
    hasCaptionToggleBtn.innerHTML = `HasCaption[${hasCaption}][${hasBorder}]`;
    if(!this.edittingBoxSet){
      hasCaptionToggleBtn.addEventListener('mousedown', (e) => {

        let dwStyle = mbWinApi.getWindowLongPtr(hWnd, mbWinApi.CONSTANTS.GWL_STYLE);
        mbWinApi.setWindowLongPtr(hWnd, mbWinApi.CONSTANTS.GWL_STYLE,
          dwStyle ^ mbWinApi.CONSTANTS.WS_BORDER
          ^ mbWinApi.CONSTANTS.WS_CAPTION
          ^ mbWinApi.CONSTANTS.WS_THICKFRAME);

        mbWinApi.setWindowPos(hWnd,null,0,0,0,0,mbWinApi.CONSTANTS.SWP_NOMOVE
          | mbWinApi.CONSTANTS.SWP_NOSIZE | mbWinApi.CONSTANTS.SWP_NOZORDER
          | mbWinApi.CONSTANTS.SWP_FRAMECHANGED);

        this.refreshEdittingBox();
      });
    }

    // mbWinApi.getRgnBox(hWnd);

  }

  onClickItem(evt) {
    let clickedElem = evt.target;
    if(evt.button === 0){// Left click
      let item = clickedElem.userData.itemData;
      console.log('Clicked: %s', item.caption);
      this.selectedSetHwnd = item.hwnd;
      this.refreshEdittingBox();
      // core.workspacesManager.getCurrentWorkspace().toggleProcess(item.hwnd);
      // this.refresh();
    }else if(evt.button === 2){// Right click
      // let item = clickedElem.userData.itemData;
      // this.selectedSetHwnd = item.hwnd;
      // if(this.selectedSetElem !== null){
      //   this.selectedSetElem.classList.remove('selected-set');
      // }
      // clickedElem.classList.add('selected-set');
      // this.selectedSetElem = clickedElem;
    }
  }






}

document.registerElement('window-editor', WindowEditor);

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
})('WindowEditor', function () {

  // return the module's API
  return WindowEditor;

});
