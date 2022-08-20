import { ipcMain } from "electron";
import { signIn } from "./twitter";
export default class Events {
  static listen() {
    ipcMain.on("signIn", signIn);
  }
}


