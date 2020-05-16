# 003 - WebRTC

Free WebRTC using Firebase

- create a new app on firebase
- copy web app credentials to `script/config.js` (see `script/config.EXAMPLE.js` for example)
- enable "Anonymous" sign in method on firebase
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

Run simple http server on python 2.\* from this directory.

```shell
cd 003-webrtc/ # if necessary
python -m SimpleHTTPServer 3000
```

FYI:

- will work _anywhere_ as a static site, you just need to whitelist the domain in firebase auth settings.
