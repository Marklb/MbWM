const {BrowserWindow} = require('electron');
const {ipcMain} = require('electron');


export const UiWorkspaces = {
  loadWindow: (function() {
    // restrict this function to the main process
    if(process.type == 'browser') {
      return () => {
        let win = new BrowserWindow({
          width: 1000,
          height: 600,
          autoHideMenuBar: true,
          show: false,
          alwaysOnTop: true,
          // fullscreen: true,
          frame: false,
          transparent: true
        });
        win.setIgnoreMouseEvents(true);

        // and load the index.html of the app.
        win.loadURL('file://' + __dirname + '/index.html');

        // Open the DevTools.
        win.webContents.openDevTools();

        // ${DEBUG_PREFIX}-lowlevelkeyboard-set-window-id
        win.webContents.on('did-finish-load', function() {
          const { virtualScreens } = require('../../../virtual-screens');
          let allScreensDispRect = virtualScreens.getAllScreensDisplayBounds();
          // console.log(`allScreensDispRect: x: ${allScreensDispRect.x}, y: ${allScreensDispRect.y}, w: ${allScreensDispRect.width}, h: ${allScreensDispRect.height}`);
          // console.log(allScreensDispRect);
          win.setPosition(allScreensDispRect.x, allScreensDispRect.y);
          win.setSize(allScreensDispRect.width, allScreensDispRect.height);
        });

        // Emitted when the window is closed.
        win.on('closed', function() {
          // Dereference the window object, usually you would store windows
          // in an array if your app supports multi windows, this is the time
          // when you should delete the corresponding element.

          // mainWindow = null;
          // let wins = BrowserWindow.getAllWindows();
          // for(let i = 0; i < wins.length; i++){
          //   wins[i].close();
          // }
        });
        return win;
      }
    }
    // if(process.type == 'renderer') {
    //   return
    // }
  })()


}


if(process.type == 'renderer') {

}









// var html = jade.renderFile('file://...');
// html = 'data:text/html,' + encodeURIComponent(html);
// window.loadUrl(html);
