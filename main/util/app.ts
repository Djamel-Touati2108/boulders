import electron from "electron";

export default class App {
  static get isDev() {
    const isEnvSet = "ELECTRON_IS_DEV" in process.env;
    const getFromEnv = Number.parseInt(process.env.ELECTRON_IS_DEV, 10) === 1;
    return isEnvSet ? getFromEnv : !electron.app.isPackaged;
  }
}
