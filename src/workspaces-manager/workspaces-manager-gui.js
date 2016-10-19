let fs = require('fs');

let _htmlTplFileContent = fs.readFileSync(__dirname+'/workspaces-manager-gui.html');
document.body.innerHTML += _htmlTplFileContent;

let workspacesManager = require(__dirname+'/workspaces-manager');

let css1 = fs.readFileSync(__dirname+'/workspaces-manager-gui.css');
let css2 = fs.readFileSync('./src/styles.css');
let css='<style>'+css1+css2+'</style>';

class WorkspacesManagerGui extends HTMLElement{
  createdCallback() {
    this.root = this.createShadowRoot();
    this.root.innerHTML += css;

    let tpl = document.querySelector('template#tpl-workspaces-manager-gui');
    let clone = document.importNode(tpl.content, true);
    this.root.appendChild(clone);

  }

  attachedCallback() {
    let displayElem = this.root.querySelector('.current-workspace-dispay');
    console.log(displayElem);
    setInterval(() =>{
      displayElem.innerHTML = global.core.workspacesManager.getCurrentWorkspace().getId();
    },10);
  }






}

document.registerElement('workspaces-manager-gui', WorkspacesManagerGui);

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
})('WorkspacesManagerGui', function () {

  // return the module's API
  return WorkspacesManagerGui;

});
