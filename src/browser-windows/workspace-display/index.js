let m = null;

if(process.type == 'browser'){
  m = require('./workspace-display-main');
}

if(process.type == 'renderer'){
  m = require('./workspace-display-remote');
}

module.exports = m;
