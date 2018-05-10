const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow} = electron;

let mainWindow;

//Listen for the app to be ready
app.on('ready', function(){
  //create new window
  mainWindow = new BrowserWindow({});
  //Load html file as it was a website
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'mainWindow.html'),// its "," cuz it's not the end
    protocol:'file',
    slashes: true
  }));
});