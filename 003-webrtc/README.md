# 003 - WebRTC

Free WebRTC using Firebase

Running simple http server on python 2.\* from this directory.

```shell
cd 003-webrtc/ # if necessary
python -m SimpleHTTPServer 3000
```

- create new app on firebase
- copy web app credentials to `script/config.js`
- enable google and anonymous sign in methods on firebase
- go to firebase realtime database console (not firestore)
- set the following rules for the database:

```
{
  "rules": {
    ".read": "auth !== null",
    ".write": false,
    "messages": {
      "$uid": {
    		".write": "$uid === auth.uid",
      }
    }
  }
}
```
