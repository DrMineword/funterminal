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
