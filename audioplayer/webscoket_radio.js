// webradio.js
(() => {
  const SETTINGS_URL = "https://drmineword.github.io/funterminal/audioplayer/setting.json";
  const audio = new Audio();
  audio.crossOrigin = "anonymous";

  let client, channel;
  let queue = [];
  let initialized = false;

  // prefix logger
  const log = (...args) => console.log("[WEBSOCKET_RADIO]", ...args);

  async function init() {
    if (initialized) return;
    initialized = true;

    // Unlock audio context via gesture
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === "suspended") await ctx.resume();
      log("AudioContext unlocked");
    } catch (err) {
      log("AudioContext unlock failed:", err);
    }

    try {
      const settingsRes = await fetch(SETTINGS_URL);
      const settings = await settingsRes.json();

      if (!settings.script || !settings.hash) {
        throw new Error("settings.json missing script/hash");
      }

      log("Loading script:", settings.script);
      await import(settings.script);

      client = new XanoClient({
        instanceBaseUrl: settings.baseurl,
        realtimeConnectionHash: settings.hash
      });

      const channelName = settings.channel || "main";
      channel = client.channel(channelName);
      channel.on(handleEvent);

      log("Connected to channel:", channelName);
    } catch (err) {
      log("Init error:", err);
    }
  }

  function handleEvent(evt) {
    log("WS Event:", evt);

    if (evt?.payload?.data?.action === "play" && evt.payload.data.song) {
      queue.push(evt.payload.data.song);
      log("Queued:", evt.payload.data.song.songname);
      playNext();
    }
  }

  function playNext() {
    if (!audio.paused || queue.length === 0) return;

    const song = queue.shift();
    log("Now playing:", song.songname);

    if (song.fragment.startsWith("http")) {
      audio.src = song.fragment;
    } else {
      try {
        const byteChars = atob(song.fragment);
        const byteNumbers = new Array(byteChars.length).fill(0).map((_, i) => byteChars.charCodeAt(i));
        const blob = new Blob([new Uint8Array(byteNumbers)], { type: "audio/mp3" });
        audio.src = URL.createObjectURL(blob);
      } catch (err) {
        log("Error decoding fragment:", err);
        playNext();
        return;
      }
    }

    audio.currentTime = 0;
    audio.play().catch(err => log("Playback error:", err));
  }

  // When a track ends, start next
  audio.addEventListener("ended", playNext);
  audio.addEventListener("error", e => log("Audio error:", audio.error));
  audio.addEventListener("stalled", () => log("Audio stalled"));
  audio.addEventListener("waiting", () => log("Buffering…"));

  // Wait for first user interaction
  ["click", "keydown", "touchstart"].forEach(evt =>
    window.addEventListener(evt, init, { once: true })
  );

  log("Ready. Waiting for user interaction to init.");
})();
