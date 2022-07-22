import Twitter from "node-twitter-api";
import { BrowserWindow } from "electron";
import Window from "./window";

export function signIn(event) {
  //initialize twitter api using credentials
  const twitter = new Twitter({
    consumerKey: "v0pIJFP76DUxburDFQ0Too5Ia",
    consumerSecret: "J7FDtajvJU3dYnkHAl85ugMbuKnrhpILM6puHJZn1wrmGLXeaC",
    callback: "https://boulders-2f8f6.firebaseapp.com/__/auth/handler",
  });

  let authWindow = new BrowserWindow({
    width: 650,
    height: 800,
    show: false,
    parent: Window.menubar,
  });

  authWindow.center();

  authWindow.webContents.on("did-finish-load", function () {
    authWindow.show();
  });

  let closedByUser = true,
    isVerified = false;
  let auth_verifier,
    requestTokenSecret,
    requestToken,
    accessToken,
    accessTokenSecret;

  /* obtaining requestToken and secret.
    using requestToken, we can redirect to authorized url */

  twitter.getRequestToken((auth_error, token, tokenSecret) => {
    if (auth_error) {
      event.sender.send("signInResult", {
        error: "Something went wrong",
      });
    } else {
      requestToken = token;
      requestTokenSecret = tokenSecret;
      authWindow.loadURL(
        "https://twitter.com/oauth/authenticate?oauth_token=" + token
      );
    }
  });

  const handleUrl = function (url) {
    //getting verifier from authorized url
    let raw_auth_verifier = /oauth_verifier=([^&]*)/.exec(url) || null;
    auth_verifier =
      raw_auth_verifier && raw_auth_verifier.length > 1
        ? raw_auth_verifier[1]
        : null;

    let auth_denied = /denied=([^&]*)/.exec(url) || null;

    if (auth_verifier) {
      closedByUser = false;

      twitter.getAccessToken(
        requestToken,
        requestTokenSecret,
        auth_verifier,
        (auth_error, token, secret) => {
          if (auth_error) {
            console.log(auth_error);
          } else {
            accessToken = token;
            accessTokenSecret = secret;

            event.sender.send("signInResult", {
              accessToken,
              accessTokenSecret,
              auth_error,
            });
          }
        }
      );
      isVerified = true;
    }

    if (auth_denied || isVerified) {
      authWindow.close();
    }
  };

  authWindow.webContents.on("will-navigate", (event, url) => {
    handleUrl(url);
  });

  authWindow.on("close", () => {
    if (closedByUser) {
      event.sender.send("signInResult", {
        error: "Twitter Window Closed By User",
      });
    }
  });
}
