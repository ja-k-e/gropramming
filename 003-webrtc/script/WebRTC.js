const onError = console.error;

export class WebRTC {
  constructor(api, onData) {
    this.onData = onData;

    this.api = api;
    this.api.setDataHandler(this.handleData.bind(this));
    this.streamId = undefined;
    this.connections = {};
    this.connectionConfig = {
      iceServers: [
        { urls: "stun:stun.stunprotocol.org:3478" },
        { urls: "stun:stun.l.google.com:19302" },
      ],
    };
    this.streams = {};
  }

  enableAudio(enabled) {
    this.streams[this.api.userId].getAudioTracks()[0].enabled = enabled;
  }
  enableVideo(enabled) {
    this.streams[this.api.userId].getVideoTracks()[0].enabled = enabled;
  }

  initialize() {
    const { mediaDevices } = navigator;
    if (mediaDevices && mediaDevices.getUserMedia) {
      mediaDevices
        .getUserMedia({ audio: true, video: true })
        .then((stream) => {
          this.streams[this.api.userId] = stream;
          this.onData({
            type: "connection",
            from: this.api.userId,
            to: this.api.userId,
          });
        })
        .catch(onError)
        .then(() => this.api.send("all", { type: "rtc.joined" }))
        .catch(onError);
    } else {
      alert("Your browser does not support getUserMedia API");
      this.onData({
        type: "connection",
        from: this.api.userId,
        to: this.api.userId,
      });
      this.api.send("all", { type: "rtc.joined" });
    }
  }

  initializePeer(peerId, initialCall = false) {
    this.connections[peerId] = new RTCPeerConnection(this.connectionConfig);
    this.connections[peerId].onicecandidate = (event) =>
      this.gotIceCandidate(event, peerId);
    this.connections[peerId].ontrack = (event) =>
      this.gotRemoteStream(event, peerId);
    this.connections[peerId].oniceconnectionstatechange = (event) =>
      this.monitorConnection(event, peerId);

    const stream = this.streams[this.api.userId];
    if (stream) {
      stream
        .getTracks()
        .forEach((track) => this.connections[peerId].addTrack(track, stream));
    }

    if (initialCall) {
      this.connections[peerId]
        .createOffer()
        .then((description) => this.gotDescription(description, peerId))
        .catch(onError);
    }
  }

  handleData(payload) {
    if (!payload) return;
    const { type, data, from, to } = payload;

    const fromSelf = from === this.api.userId;
    const toSelf = to === this.api.userId || to === "all";

    if (type.match("rtc") && (fromSelf || !toSelf)) return;

    if (type === "rtc.joined") {
      this.initializePeer(from);
      this.api.send(from, { type: "rtc.accepted" });
    } else if (type === "rtc.accepted") {
      this.initializePeer(from, true);
    } else if (type === "rtc.sdp" && data) {
      const d = JSON.parse(data);
      this.connections[from]
        .setRemoteDescription(new RTCSessionDescription(d))
        .then(() => {
          if (d && d.type === "offer") {
            this.connections[from]
              .createAnswer()
              .then((description) => this.gotDescription(description, from))
              .catch(onError);
          }
        })
        .catch(onError);
    } else if (type === "rtc.ice") {
      const d = JSON.parse(data);
      this.connections[from]
        .addIceCandidate(new RTCIceCandidate(d))
        .catch(onError);
    } else {
      this.onData(payload);
    }
  }

  gotIceCandidate(event, peerId) {
    if (event.candidate === null) return;
    const data = JSON.stringify(event.candidate);
    this.api.send(peerId, { type: "rtc.ice", data });
  }

  gotDescription(description, peerId) {
    this.connections[peerId]
      .setLocalDescription(description)
      .then(() => {
        const data = JSON.stringify(this.connections[peerId].localDescription);
        this.api.send(peerId, { type: "rtc.sdp", data });
      })
      .catch(onError);
  }

  gotRemoteStream(event, peerId) {
    this.streams[peerId] = event.streams[0];
    this.onData({ type: "connection", from: peerId, to: this.api.userId });
  }

  monitorConnection(event, peerId) {
    const state = this.connections[peerId].iceConnectionState;
    if (state === "failed" || state === "closed" || state === "disconnected") {
      delete this.connections[peerId];
      delete this.streams[peerId];
      this.onData({ type: "disconnection", from: peerId, to: this.api.userId });
    }
  }
}
