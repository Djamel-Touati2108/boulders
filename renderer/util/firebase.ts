import { FirebaseApp, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  Auth,
  getAuth,
  signInAnonymously,
  signInWithCredential,
  TwitterAuthProvider,
  User,
} from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  endAt,
  Firestore,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  QueryDocumentSnapshot,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { ITask, isEmpty } from "./task";

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
    const analytics = getAnalytics(this.firebase);
    this.auth.onAuthStateChanged((user) => {
      this.call("AUTH:CHANGE", user);


    });
  }

  static get isAuthenticated() {
    return Boolean(this.auth?.currentUser);
  }

  static get user(): User {
    return this.auth.currentUser;
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

  static authenticate(data: any) {
    return new Promise((res, rej) => {
      const credential = TwitterAuthProvider.credential(
        data.accessToken,
        data.accessTokenSecret
      );

      signInWithCredential(this.auth, credential)
        .then((result) => {
          res(result);
        })
        .catch(rej);
    });
  }

  static signInAnonymously() {
    return new Promise((res, rej) => {
      signInAnonymously(this.auth)
        .then(async (result) => {
          const users = collection(this.db, "users");
          const user = doc(users, result.user.uid);

          getDoc(user).then(async (doc) => {
            if (!doc.exists()) await setDoc(user, {});
            res(result);
          });
        })
        .catch(rej);
    });
  }

  static async update(task: ITask) {
    const taskQuery = doc(this.db, "users", this.user.uid, "tasks", task.id);
    delete task.id;
    if (isEmpty(task)) await deleteDoc(taskQuery);
    else await setDoc(taskQuery, task);
  }

  static async fetch() {
    return new Promise<QueryDocumentSnapshot[]>(async (res) => {
      const sunday = new Date();

      sunday.setDate(sunday.getDate() - sunday.getDay());
      sunday.setHours(0);
      sunday.setMinutes(0);
      sunday.setSeconds(0);

      const tasksRef = collection(this.db, "users", this.user.uid, "tasks");
      const tasksQuery = query(
        tasksRef,
        where("createdAt", ">", sunday),
        orderBy("createdAt", "desc")
      );
      const taskData = await getDocs(tasksQuery);

      res(taskData.docs);
    });
  }
}
