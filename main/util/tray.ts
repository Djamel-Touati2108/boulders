import { Tray as ElectronTray } from "electron";
import path from "path";
import App from "./app";

export default class Tray {
  static update(tray: ElectronTray) {
    tray.setImage(this.icon);
  }

  static get icon() {
    return path.join(
      __dirname,
      App.isDev ? ".." : "../..",
      "assets",
      "icons",
      "png",
      "48x48.png"
    );
  }
}
