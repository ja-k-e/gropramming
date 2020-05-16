import { API } from "./script/API.js";

class App {
  constructor() {
    this.$app = document.getElementById("app");
    this.$auth = document.getElementById("auth");
    this.$auth.addEventListener("click", API.signInAnonymous());

    API.initialize((user) => {
      if (!user) return;
      this.user = user;
      this.userId = user.uid;
      this.api = new API(this.userId, this.handleData.bind(this));
      this.$auth.remove();
    });
  }

  handleData(payload) {
    if (!["connection", "disconnection"].includes(payload.type)) return;
    this.render();
  }

  render() {
    this.$app.innerText = "";
    for (const key in this.api.rtc.streams) {
      const stream = this.api.rtc.streams[key];
      const video = document.createElement("video");
      video.autoplay = true;
      video.srcObject = stream;
      if (key === this.userId) video.muted = true;
      this.$app.appendChild(video);
    }
  }
}

new App();
