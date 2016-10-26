require(__dirname+'/workspace');
require(__dirname+'/workspaces-manager-gui');
const mbWinApi = require('../mb-win-api');

class Workspace {
  constructor(id) {
    this._id = id;
    this._processes = [];
    this._processesVkKeys = {};
  }

  getId() {
    return this._id;
  }

  addProcess(hwnd) {
    this._processes.push(hwnd);
  }

  toggleProcess(hwnd) {
    let ind = this._processes.indexOf(hwnd);
    // console.log(ind);
    if(ind == -1){
      this._processes.push(hwnd);
    }else{
      this._processes.splice(ind, 1);
      delete this._processesVkKeys[hwnd];
    }
    // console.log(this._processes);
  }

  getProcesses() {
    return this._processes;
  }

  getProcessKey(hwnd) {
    if(this._processesVkKeys[hwnd]){
      return this._processesVkKeys[hwnd];
    }
  }

  setProcessKey(hwnd, vkCode, keyText) {
    return this._processesVkKeys[hwnd] = {'vkCode': vkCode, 'keyText': keyText};
  }

}

class WorkspacesManager {
  constructor() {
    this.workspaces = [new Workspace(0)];
    this.currentWorkspaceIndex = 0;

    // let left = 44;
    // let right = 19;

    let left = 45;
    let right = 33;

    // mbWinApi.disableKeyLLKbHook(left);
    // mbWinApi.disableKeyLLKbHook(right);
    // mbWinApi.on('lowlevelkeyboard-msg', (evt) =>{
    //   // console.log('lowlevelkeyboard:');
    //   // console.log(evt);
    //   if(evt.msg == 256){
    //     if(evt.vkCode == left){
    //       this.prevWorkspace();
    //     }else if(evt.vkCode == right){
    //       this.nextWorkspace();
    //     }
    //     let procList = this.getCurrentWorkspace().getProcesses();
    //     for(let i = 0; i < procList.length; i++){
    //       let procKey = this.getCurrentWorkspace().getProcessKey(procList[i]);
    //       if(procKey){
    //         if(procKey.vkCode === evt.vkCode){
    //           console.log('Activate: ' + procList[i]);
    //           // mbWinApi.showWindow(procList[i], mbWinApi.SW_CMDS.SW_RESTORE);
    //           mbWinApi.setForegroundWindow(procList[i]);
    //         }
    //       }
    //     }
    //   }
    // });


  }

  getCurrentWorkspace() {
    return this.workspaces[this.currentWorkspaceIndex];
  }

  /*
  opts:
    index ()
    name ()
  */
  setCurrentWorspace(index) {
    this.currentWorkspaceIndex = index;
  }

  /*

  */
  nextWorkspace() {
    if(this.workspaces.length <= this.currentWorkspaceIndex+1){
      this.workspaces.push(new Workspace(this.currentWorkspaceIndex+1));
    }
    let procList = this.getCurrentWorkspace().getProcesses();
    for(let i = 0; i < procList.length; i++){
      mbWinApi.showWindow(procList[i], mbWinApi.SW_CMDS.SW_HIDE);
    }

    this.currentWorkspaceIndex++;
    let procList2 = this.getCurrentWorkspace().getProcesses();
    for(let i = 0; i < procList2.length; i++){
      mbWinApi.showWindow(procList2[i], mbWinApi.SW_CMDS.SW_SHOW);
    }

    let gui = document.querySelector('workspaces-manager-gui');
    let plistElem = gui.root.querySelector('processes-list');
    plistElem.refresh();
  }

  /*

  */
  prevWorkspace() {
    if(this.currentWorkspaceIndex > 0){
      let procList = this.getCurrentWorkspace().getProcesses();
      for(let i = 0; i < procList.length; i++){
        mbWinApi.showWindow(procList[i], mbWinApi.SW_CMDS.SW_HIDE);
      }

      this.currentWorkspaceIndex--;
      let procList2 = this.getCurrentWorkspace().getProcesses();
      for(let i = 0; i < procList2.length; i++){
        mbWinApi.showWindow(procList2[i], mbWinApi.SW_CMDS.SW_SHOW);
      }

      let gui = document.querySelector('workspaces-manager-gui');
      let plistElem = gui.root.querySelector('processes-list');
      plistElem.refresh();
    }
  }

  /*

  */
  isProcessOnAWorkspace(hwnd, includeCurrentWorkspace = true) {
    for(let i = 0; i < this.workspaces.length; i++){
      if(includeCurrentWorkspace === false && this.getCurrentWorkspace() == this.workspaces[i]){
        continue;
      }
      let procList = this.workspaces[i].getProcesses();
      for(let j = 0; j < procList.length; j++){
        if(procList[j] === hwnd){
          return true;
        }
      }
    }
    return false;
  }





}

module.exports = new WorkspacesManager();
