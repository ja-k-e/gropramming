import { config } from "./config.js";

firebase.initializeApp(config);

export class Authentication {
  initialize(callback) {
    firebase.auth().onAuthStateChanged((user) => callback(user));
    firebase
      .auth()
      .getRedirectResult()
      .then(({ user, credential }) => callback(user, credential))
      .catch(window.console.warn);
  }

  signInAnonymous() {
    return firebase.auth().signInAnonymously();
  }

  signInGoogle() {
    return firebase
      .auth()
      .signInWithRedirect(new firebase.auth.GoogleAuthProvider());
  }

  signOut() {
    return firebase.auth().signOut();
  }
}
