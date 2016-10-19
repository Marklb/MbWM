const remote = require('electron').remote
const {ipcRenderer} = require('electron');

var mbWinApi = require('./src/mb-windows-api');
console.log(mbWinApi);


let starter = () => {
  // setTimeout(() => {
  //   console.log('About to hook LLKb');
  //   // mbWinApi.hookLLKb(function() {
  //   //   console.log('Meh');
  //   // });
  //   mbWinApi.hookLLKb();
  //   // mbWinApi.setLLKbHookWindow(remote.getCurrentWindow().id);
  // }, 1000);
  // mbWinApi.setLLKbHookWindow(remote.getCurrentWindow().id);

  setTimeout(() => {
    mbWinApi.hookLLKb();
  },1000);
}
