console.log(__dirname);
global.core = {
  'workspacesManager': require(__dirname+'/workspaces-manager/workspaces-manager')
};
