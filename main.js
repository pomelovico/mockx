
const {app, BrowserWindow,ipcMain,Menu,Notification} = require('electron');

const ServerManager = require('./server/ServerManager');
const service = require('./server/service');

let mainWindow
function createWindow () {
  mainWindow = new BrowserWindow({
    width:1280, 
    height: 800,
    center:true,
    title:"MockMe",
    titleBarStyle:'customButtonsOnHover',
    autoHideMenuBar: true
  });

  const serverManager = new ServerManager(service);

  let webContents = mainWindow.webContents;
  
  mainWindow.loadFile('./build/index.html');
  // webContents.on('did-finish-load',()=>{
  //   //使用webContents向渲染进程发送消息
  //   webContents.send('msg',"This is a msg from main process");
  // })
  mainWindow.on('closed', function () {
    mainWindow = null
  });
  mainWindow.webContents.openDevTools();
}

app.on('ready', createWindow)
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
