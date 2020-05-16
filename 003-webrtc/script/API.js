import { Authentication } from "./Authentication.js";
import { WebRTC } from "./WebRTC.js";

const auth = new Authentication();

export class API {
  constructor(userId, onData) {
    this.userId = userId;
    this.rtc = new WebRTC(this, onData);
    this.rtc.initialize();
  }

  clear() {
    firebase.database().ref(`messages/${this.userId}`).set(null);
  }

  send(to, payload) {
    const fullPayload = { ...payload, to, from: this.userId };
    firebase.database().ref(`messages/${this.userId}`).set(fullPayload);
  }

  setDataHandler(dataHandler) {
    this.dataHandler = dataHandler;
    firebase
      .database()
      .ref("messages")
      .once("value", () => (this.databaseInitialized = true));
    firebase
      .database()
      .ref("messages")
      .on("child_added", (data) => {
        if (!this.databaseInitialized) return;
        if (this.dataHandler) this.dataHandler(data.val());
      });
    firebase
      .database()
      .ref("messages")
      .on("child_changed", (data) => {
        if (!this.databaseInitialized) return;
        if (this.dataHandler) this.dataHandler(data.val());
      });
  }

  // Authentication functions

  static initialize(callback) {
    return auth.initialize(callback);
  }

  static signInAnonymous() {
    return auth.signInAnonymous();
  }

  static signInGoogle() {
    return auth.signInGoogle();
  }

  static signOut() {
    return auth.signOut();
  }
}
