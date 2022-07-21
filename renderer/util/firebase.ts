import { FirebaseApp, initializeApp } from "firebase/app";
import {
  Auth,
  browserLocalPersistence,
  getAuth,
  setPersistence,
  signInAnonymously,
  User,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  Firestore,
} from "firebase/firestore/lite";

const config = {
  apiKey: "AIzaSyD8BJoCIxxUM2T7vmwn2ZAkz1I5CIJJj_A",
  authDomain: "boulders-2f8f6.firebaseapp.com",
  databaseURL:
    "https://boulders-2f8f6-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "boulders-2f8f6",
  storageBucket: "boulders-2f8f6.appspot.com",
  messagingSenderId: "102002937120",
  appId: "1:102002937120:web:3082758175d541b5de5b45",
  measurementId: "G-X7CMTBWX9D",
};

interface Listeners {
  "AUTH:CHANGE": (user: User) => void;
}

export default class Firebase {
  static firebase: FirebaseApp;
  static db: Firestore;
  static auth: Auth;

  static listeners: {
    [key: string]: any;
  } = {};

  static init() {
    this.firebase = initializeApp(config);
    this.auth = getAuth(this.firebase);
    this.db = getFirestore(this.firebase);

    this.auth.onAuthStateChanged((user) => {
      this.call("AUTH:CHANGE", user);
    });
  }

  static on(listener: keyof Listeners, callback: Listeners[typeof listener]) {
    if (!this.listeners[listener]) this.listeners[listener] = [callback];
    else this.listeners[listener].push(callback);
  }

  static off(listener: keyof Listeners, callback: Listeners[typeof listener]) {
    if (!this.listeners[listener]) return;
    this.listeners[listener] = this.listeners[listener].filter(
      (search: any) => search == callback
    );
  }

  static call(
    listener: keyof Listeners,
    ...args: Parameters<Listeners[typeof listener]>
  ) {
    if (!this.listeners[listener]) return;
    this.listeners[listener].forEach((callback: Listeners[typeof listener]) =>
      callback(...args)
    );
  }

  static signIn() {
    return new Promise((res, rej) => {
      setPersistence(this.auth, browserLocalPersistence)
        .then(() => {
          signInAnonymously(this.auth).then(res).catch(rej);
        })
        .catch(rej);
    });
  }
}
