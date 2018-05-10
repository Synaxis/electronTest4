const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

// Set ENV 
process.env.NODE_ENV = 'production';

let mainWindow;
let addWindow;

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
  //Quit app when closed
  mainWindow.on('closed', function(){
    app.quit();
  });

  //Build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate); //now add to line 5 
  
  // Insert menu (Ovewrite the default boilerplate)
  Menu.setApplicationMenu(mainMenu);
});

//Handle create add window
// add another variable
function createAddWindow(){
//create the new window
addWindow = new BrowserWindow({
  width: 300,
  height: 200,
  title:'Add shopping list Item'
});
//Load html file as it was a website
addWindow.loadURL(url.format({
  pathname: path.join(__dirname, 'addWindow.html'),// now let's create the html
  protocol:'file',
  slashes: true
}));

  //Garbage collection handle
  addWindow.on('close', function(){
    addWindow = null;
  });

}// end of create window

//Catch Item:add
ipcMain.on('item:add',function(e, item){ //wtf
  //console.log(item);
  mainWindow.webContents.send('item:add', item);
  addWindow.close();
  //good now , send to mainWindow.html
});


// Create menu template 
//basically an array of objects
//will be called at line 21
const mainMenuTemplate = [
  {
    label:'File',
    submenu:[
      {
        label: 'Add Item', // don't forget comma/go to end of on('ready')
        click(){
          createAddWindow();
        }
      },
      {
        label: 'Clear Items',
        click(){; 
        mainWindow.webContents.send('item:clear');//we're just clearing . no data sent
        }
      },
      {
        label: 'Quit',
        //Add Hotkey
        accelerator: process.platform =='darwin' ? 'Command+Q' :
        'Ctrl+Q',
        click(){
          app.quit();
        }
      },
    ]
  }
];

//Tells everyone that MacOS sucks (fix mac issue)
if(process.platform == 'darwin'){
  mainMenuTemplate.unshift({});
}

// Add developer tools to non prod env
if(process.env.NODE_ENV !== 'production'){
  mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu: [
      {
        label: 'Toggle Devtools',
        accelerator: process.platform =='darwin' ? 'Command+I' :
        'Ctrl+I',
        click(item, focusedWindow){// we want the dev tools to appear on the current window 
          focusedWindow.toggleDevTools(); // is this an embedded func?
        }
      },
      {
        role: 'reload'
      },
    ]
  });
}