let m = null;

if(process.type == 'browser'){
  m = require('./window-editor-main');
}

if(process.type == 'renderer'){
  m = require('./window-editor-remote');
}

module.exports = m;
