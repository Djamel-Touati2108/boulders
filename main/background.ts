import { menubar } from "menubar";
import serve from "electron-serve";
import App from "./util/app";
import Window from "./util/window";
import Events from "./util/events";
import Tray from "./util/tray";

const mb = menubar({
  index: Window.path,
  tooltip: "Boulders",
  browserWindow: {
    width: 348,
    height: 483,
    transparent: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  },
});

if (!App.isDev) {
  serve({ directory: "app" });
} else {
  mb.app.setPath("userData", `${mb.app.getPath("userData")} (development)`);
}

mb.on("ready", () => {
  Tray.update(mb.tray);
  Events.listen();
  Window.menubar = mb.window;

  if (App.isDev) Window.create();
});

mb.on("window-all-closed", () => {
  mb.app.quit();
});
