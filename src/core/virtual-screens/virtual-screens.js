const electron = require('electron');
const {app, BrowserWindow} = electron;


// export class VirtualScreen {
//
// };

let t_printRect = (rect) => {
  let x = rect.x;
  let y = rect.y;
  let w = rect.width;
  let h = rect.height;
  let t = rect.top;
  let r = rect.right;
  let b = rect.bottom;
  let l = rect.left;

  let s1 = `x: ${x}, y: ${y}, w: ${w}, h: ${h}`;
  let s2 = `t: ${t}, r: ${r}, b: ${b}, l: ${l}`;
  console.log(`R: (${s1}) (${s2})`);
};


let _getAllScreensDisplayBounds = () => {
  // console.log('getAllScreensDisplayBounds');
  let {screen} = require('electron');
  let displays = screen.getAllDisplays();
  let display = screen.getPrimaryDisplay();
  let r = {};
  r.x = Math.min.apply(null, displays.map((d) => d.bounds.x));
  r.y = Math.min.apply(null, displays.map((d) => d.bounds.y));
  r.left = r.x;
  r.top = r.y;
  r.right = Math.max.apply(null, displays.map((d) => d.bounds.x+d.bounds.width));
  r.bottom = Math.max.apply(null, displays.map((d) => d.bounds.y+d.bounds.height));
  r.width = r.right - r.x;
  r.height = r.bottom - r.y;
  // console.log(r);
  return r;
};

let _getPrimaryVirtualDisplayBounds = () => {
  // console.log('getPrimaryVirtualDisplayBounds');
  let {screen} = require('electron');
  // let displays = screen.getAllDisplays();
  let display = screen.getPrimaryDisplay();
  // t_printRect(display.bounds);
  // console.log(display.bounds);


  let allScreensDisplayBounds = _getAllScreensDisplayBounds();
  // console.log(allScreensDisplayBounds);
  // t_printRect(allScreensDisplayBounds);

  let ret = {};
  ret.x = display.bounds.x - allScreensDisplayBounds.x;
  ret.y = display.bounds.y - allScreensDisplayBounds.y;
  ret.width = display.bounds.width;
  ret.height = display.bounds.height;
  ret.top = ret.y;
  ret.right = display.bounds.x - allScreensDisplayBounds.x + display.bounds.width;
  ret.bottom = display.bounds.y - allScreensDisplayBounds.y + display.bounds.height;
  ret.left = ret.x;
  // t_printRect(allScreensDisplayBounds);
  // console.log(`ret`);
  // t_printRect(ret);
  return ret;
};

let _getAllVirtualDisplaysBounds = () => {
  // console.log('getAllVirtualDisplaysBounds');
  let {screen} = require('electron');
  let displays = screen.getAllDisplays();
  let retList = [];
  for(let i = 0; i < displays.length; i++){
    // let display = screen.getPrimaryDisplay();
    let display = displays[i];
    // t_printRect(display.bounds);
    // console.log(display.bounds);


    let allScreensDisplayBounds = _getAllScreensDisplayBounds();
    // console.log(allScreensDisplayBounds);
    // t_printRect(allScreensDisplayBounds);

    let ret = {};
    ret.x = display.bounds.x - allScreensDisplayBounds.x;
    ret.y = display.bounds.y - allScreensDisplayBounds.y;
    ret.width = display.bounds.width;
    ret.height = display.bounds.height;
    ret.top = ret.y;
    ret.right = display.bounds.x - allScreensDisplayBounds.x + display.bounds.width;
    ret.bottom = display.bounds.y - allScreensDisplayBounds.y + display.bounds.height;
    ret.left = ret.x;
    // t_printRect(allScreensDisplayBounds);
    // console.log(`ret`);
    // t_printRect(ret);
    retList.push(ret);
  }
  return retList;
};

let virtualScreens = {
  getAllScreensDisplayBounds: _getAllScreensDisplayBounds,
  getPrimaryVirtualDisplayBounds: _getPrimaryVirtualDisplayBounds,
  getAllVirtualDisplaysBounds: _getAllVirtualDisplaysBounds
};

module.exports.virtualScreens = virtualScreens;
