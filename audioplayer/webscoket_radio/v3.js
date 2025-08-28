// webradio.js
(() => {
  const SETTINGS_URL = "https://drmineword.github.io/funterminal/audioplayer/setting.json";

  let client, channel;
  let queue = [];
  let initialized = false;
  let ctx, nextStartTime = 0;
  const log = (...a) => console.log("[WEBSOCKET_RADIO]", ...a);

  async function init() {
    if (initialized) return;
    initialized = true;

    ctx = new (window.AudioContext || window.webkitAudioContext)();

    try {
      const res = await fetch(SETTINGS_URL);
      const s = await res.json();
      if (!s.script || !s.hash) throw new Error("settings.json incomplete");
      await import(s.script);

      client = new XanoClient({
        instanceBaseUrl: s.baseurl,
        realtimeConnectionHash: s.hash
      });
      channel = client.channel(s.channel || "main");
      channel.on(handleEvent);

      log("Connected to channel:", s.channel || "main");
    } catch (err) {
      log("Init error:", err);
    }
  }

  function handleEvent(evt) {
    if (evt?.payload?.data?.action === "play") {
      const song = evt.payload.data.song;
      if (!song) return;
      queue.push(song);
      log("Queued:", song.songname);
      processQueue();
    }
  }

  async function processQueue() {
    while (queue.length > 0) {
      const song = queue.shift();
      log("Decoding fragment:", song.songname);

      let buf;
      try {
        let arrayBuffer;
        if (song.fragment.startsWith("http")) {
          arrayBuffer = await fetch(song.fragment).then(r => r.arrayBuffer());
        } else {
          const binary = atob(song.fragment);
          const bytes = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
          arrayBuffer = bytes.buffer;
        }
        buf = await ctx.decodeAudioData(arrayBuffer);
      } catch (e) {
        log("Decode error:", e);
        continue;
      }

      schedulePlayback(buf, song.songname);
    }
  }

  function schedulePlayback(buf, name) {
    const source = ctx.createBufferSource();
    source.buffer = buf;
    source.connect(ctx.destination);

    // if we're "caught up", start immediately
    const startAt = Math.max(ctx.currentTime, nextStartTime);
    log(`Now playing: ${name} @${startAt.toFixed(2)}s, dur=${buf.duration.toFixed(2)}s`);

    source.start(startAt);
    nextStartTime = startAt + buf.duration;

    source.onended = () => {
      log(`Finished: ${name} @${ctx.currentTime.toFixed(2)}s`);
    };
  }

  ["click", "keydown", "touchstart"].forEach(e =>
    window.addEventListener(e, init, { once: true })
  );

  log("Ready, waiting for user interaction.");
})();
// now-playing.js
(async () => {
  const instanceBaseUrl = "https://x8ki-letl-twmt.n7.xano.io/";
  const realtimeConnectionHash = "wkO7JNFL4hP1M0G-oPROiRzz510";
  const channelName = "now-play";
  const timestamp = () => Math.floor(Date.now() / (1000 * 150)); // changes every 2.5 mins

  // 1. Dynamically fetch external websocket handler (you mentioned it's needed)
  await import(`https://drmineword.github.io/funterminal/audioplayer/webscoket_radio/alert/xano.live.websocket.js`);

  // 2. Load logic handlers dynamically with cache-busting
  let file1Module, file2Module;
  try {
    file1Module = await import(`https://drmineword.github.io/funterminal/audioplayer/webscoket_radio/alert/small.js`);
    file2Module = await import(`https://drmineword.github.io/funterminal/audioplayer/webscoket_radio/alert/big.js`);
  } catch (err) {
    console.error("Failed loading function files:", err);
    return;
  }

  // 3. Setup WebSocket connection
  try {
    const client = new XanoClient({
      instanceBaseUrl,
      realtimeConnectionHash,
    });

    const channel = client.channel(channelName);

    channel.on((action) => {
      console.log(`[Received] ${JSON.stringify(action)}`);
      const payload = action?.payload?.data;

      if (payload?.type === "small" && typeof window.file1func === "function") {
  window.file1func(payload.payload);
} else if (payload?.type === "big" && typeof window.file2func === "function") {
  window.file2func(payload.payload);
} else {
        console.warn("Unknown type or missing handler:", payload?.type);
      }
    });

    console.log("Connected to Xano realtime channel.");
  } catch (e) {
    console.error("Connection error:", e);
  }
})();
