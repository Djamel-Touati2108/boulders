import { BrowserWindow, ipcMain } from "electron";
import App from "./app";
export default class Window {
  static win: BrowserWindow;
  static menubar: BrowserWindow;

  static create() {
    this.win = new BrowserWindow({
      // width: 348,
      // height: 483,
      width: 648,
      height: 683,
      autoHideMenuBar: true,
      transparent: true,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    });
    this.win.setResizable(true);
    this.win.loadURL(this.path);
    if (!App.isDev) return;
    this.win.blur();
    ipcMain.on("signIn",()=>{
       console.log(" user clicked button sign in ");
    })
  }

  static get path() {
    if (!App.isDev) return "app://./index.html";
    const port = process.argv[2];
    return `http://localhost:${port}/`;
  }

 
}
