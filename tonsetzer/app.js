/* Tonsetzer: a small Web Audio synth (FM, saw, square, acid, percussion) and the rebuilt interface. */
(() => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── 1. Synthesizer Engine (Web Audio API) ── */
  let ctx = null;
  let master = null;
  let delaySend = null;
  let soundEnabled = true;
  let ledTimer = null;

  const soundToggle = document.getElementById("soundToggle");

  function getAudio() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();

      master = ctx.createGain();
      master.gain.value = 0.26;
      master.connect(ctx.destination);

      delaySend = ctx.createGain();
      delaySend.gain.value = 0.24;

      const delay = ctx.createDelay(1.0);
      delay.delayTime.value = 0.28;

      const fb = ctx.createGain();
      fb.gain.value = 0.3;

      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 2400;

      delaySend.connect(delay);
      delay.connect(lp);
      lp.connect(master);
      lp.connect(fb);
      fb.connect(delay);
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function makeNoise(ac, dur) {
    const len = Math.floor(ac.sampleRate * dur);
    const buf = ac.createBuffer(1, len, ac.sampleRate);
    const ch = buf.getChannelData(0);
    for (let i = 0; i < len; i++) ch[i] = Math.random() * 2 - 1;
    return buf;
  }

  const presets = {
    saw(freq) {
      const ac = getAudio();
      if (!ac) return;
      const now = ac.currentTime;

      const filt = ac.createBiquadFilter();
      filt.type = "lowpass";
      filt.Q.value = 4.2;
      filt.frequency.setValueAtTime(freq * 7, now);
      filt.frequency.exponentialRampToValueAtTime(Math.max(180, freq * 1.3), now + 0.55);

      const amp = ac.createGain();
      amp.gain.setValueAtTime(0.0001, now);
      amp.gain.linearRampToValueAtTime(0.38, now + 0.012);
      amp.gain.exponentialRampToValueAtTime(0.0001, now + 0.72);

      filt.connect(amp);
      amp.connect(master);
      amp.connect(delaySend);

      [-0.6, 0.6].forEach((detune) => {
        const osc = ac.createOscillator();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(freq + detune, now);
        osc.connect(filt);
        osc.start(now);
        osc.stop(now + 0.78);
      });
    },

    square(freq) {
      const ac = getAudio();
      if (!ac) return;
      const now = ac.currentTime;

      const filt = ac.createBiquadFilter();
      filt.type = "lowpass";
      filt.frequency.setValueAtTime(freq * 4.5, now);
      filt.frequency.exponentialRampToValueAtTime(freq * 1.4, now + 0.45);

      const amp = ac.createGain();
      amp.gain.setValueAtTime(0.0001, now);
      amp.gain.linearRampToValueAtTime(0.32, now + 0.008);
      amp.gain.exponentialRampToValueAtTime(0.0001, now + 0.58);

      const main = ac.createOscillator();
      main.type = "square";
      main.frequency.setValueAtTime(freq, now);

      const sub = ac.createOscillator();
      sub.type = "triangle";
      sub.frequency.setValueAtTime(freq * 0.5, now);

      main.connect(filt);
      sub.connect(filt);
      filt.connect(amp);
      amp.connect(master);
      amp.connect(delaySend);

      main.start(now);
      sub.start(now);
      main.stop(now + 0.62);
      sub.stop(now + 0.62);
    },

    fmbell(freq) {
      const ac = getAudio();
      if (!ac) return;
      const now = ac.currentTime;

      const car = ac.createOscillator();
      const mod = ac.createOscillator();
      const modGain = ac.createGain();
      const amp = ac.createGain();

      car.type = "sine";
      mod.type = "sine";
      car.frequency.setValueAtTime(freq, now);
      mod.frequency.setValueAtTime(freq * 2.756, now);

      modGain.gain.setValueAtTime(freq * 1.8, now);
      modGain.gain.exponentialRampToValueAtTime(1, now + 0.55);

      amp.gain.setValueAtTime(0.0001, now);
      amp.gain.linearRampToValueAtTime(0.42, now + 0.004);
      amp.gain.exponentialRampToValueAtTime(0.0001, now + 1.45);

      mod.connect(modGain);
      modGain.connect(car.frequency);
      car.connect(amp);
      amp.connect(master);
      amp.connect(delaySend);

      car.start(now);
      mod.start(now);
      car.stop(now + 1.5);
      mod.stop(now + 1.5);
    },

    rhodes(freq) {
      const ac = getAudio();
      if (!ac) return;
      const now = ac.currentTime;

      const car = ac.createOscillator();
      const mod = ac.createOscillator();
      const modGain = ac.createGain();
      const amp = ac.createGain();

      car.type = "sine";
      mod.type = "sine";
      car.frequency.setValueAtTime(freq, now);
      mod.frequency.setValueAtTime(freq * 1.0, now);

      modGain.gain.setValueAtTime(freq * 0.9, now);
      modGain.gain.exponentialRampToValueAtTime(freq * 0.08, now + 0.4);

      amp.gain.setValueAtTime(0.0001, now);
      amp.gain.linearRampToValueAtTime(0.46, now + 0.008);
      amp.gain.exponentialRampToValueAtTime(0.0001, now + 1.35);

      mod.connect(modGain);
      modGain.connect(car.frequency);
      car.connect(amp);
      amp.connect(master);
      amp.connect(delaySend);

      car.start(now);
      mod.start(now);
      car.stop(now + 1.4);
      mod.stop(now + 1.4);
    },

    acid(freq) {
      const ac = getAudio();
      if (!ac) return;
      const now = ac.currentTime;

      const osc = ac.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freq, now);

      const filt = ac.createBiquadFilter();
      filt.type = "lowpass";
      filt.Q.value = 11;
      filt.frequency.setValueAtTime(freq * 10, now);
      filt.frequency.exponentialRampToValueAtTime(freq * 1.2, now + 0.24);

      const amp = ac.createGain();
      amp.gain.setValueAtTime(0.0001, now);
      amp.gain.linearRampToValueAtTime(0.32, now + 0.006);
      amp.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);

      osc.connect(filt);
      filt.connect(amp);
      amp.connect(master);
      amp.connect(delaySend);

      osc.start(now);
      osc.stop(now + 0.42);
    },

    chime(freq) {
      const ac = getAudio();
      if (!ac) return;
      const now = ac.currentTime;

      const car = ac.createOscillator();
      const mod = ac.createOscillator();
      const mg = ac.createGain();
      const amp = ac.createGain();

      car.frequency.setValueAtTime(freq, now);
      mod.frequency.setValueAtTime(freq * 1.414, now);
      mg.gain.setValueAtTime(freq * 0.7, now);
      mg.gain.exponentialRampToValueAtTime(2, now + 0.35);

      amp.gain.setValueAtTime(0.0001, now);
      amp.gain.linearRampToValueAtTime(0.24, now + 0.003);
      amp.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);

      mod.connect(mg);
      mg.connect(car.frequency);
      car.connect(amp);
      amp.connect(master);
      amp.connect(delaySend);

      car.start(now);
      mod.start(now);
      car.stop(now + 0.9);
      mod.stop(now + 0.9);
    },

    tom(freq) {
      const ac = getAudio();
      if (!ac) return;
      const now = ac.currentTime;

      const osc = ac.createOscillator();
      const amp = ac.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq * 1.85, now);
      osc.frequency.exponentialRampToValueAtTime(freq, now + 0.09);

      amp.gain.setValueAtTime(0.001, now);
      amp.gain.linearRampToValueAtTime(0.65, now + 0.005);
      amp.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);

      osc.connect(amp);
      amp.connect(master);
      amp.connect(delaySend);
      osc.start(now);
      osc.stop(now + 0.45);
    },

    kick() {
      const ac = getAudio();
      if (!ac) return;
      const now = ac.currentTime;
      const osc = ac.createOscillator();
      const amp = ac.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(145, now);
      osc.frequency.exponentialRampToValueAtTime(42, now + 0.09);
      amp.gain.setValueAtTime(0.001, now);
      amp.gain.linearRampToValueAtTime(0.85, now + 0.004);
      amp.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);
      osc.connect(amp);
      amp.connect(master);
      osc.start(now);
      osc.stop(now + 0.35);
    },

    snare() {
      const ac = getAudio();
      if (!ac) return;
      const now = ac.currentTime;
      const src = ac.createBufferSource();
      src.buffer = makeNoise(ac, 0.2);
      const bp = ac.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = 1800;
      const ng = ac.createGain();
      ng.gain.setValueAtTime(0.45, now);
      ng.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
      src.connect(bp);
      bp.connect(ng);
      ng.connect(master);
      ng.connect(delaySend);
      src.start(now);
    },

    rim() {
      const ac = getAudio();
      if (!ac) return;
      const now = ac.currentTime;
      const osc = ac.createOscillator();
      const mod = ac.createOscillator();
      const mg = ac.createGain();
      const amp = ac.createGain();
      osc.frequency.setValueAtTime(520, now);
      mod.frequency.setValueAtTime(1480, now);
      mg.gain.setValueAtTime(420, now);
      mg.gain.exponentialRampToValueAtTime(8, now + 0.04);
      amp.gain.setValueAtTime(0.4, now);
      amp.gain.exponentialRampToValueAtTime(0.0001, now + 0.065);
      mod.connect(mg);
      mg.connect(osc.frequency);
      osc.connect(amp);
      amp.connect(master);
      osc.start(now);
      mod.start(now);
      osc.stop(now + 0.08);
      mod.stop(now + 0.08);
    }
  };

  function play(spec, el) {
    if (el && !el.closest("svg")) {
      el.classList.remove("is-struck");
      void el.offsetWidth;
      el.classList.add("is-struck");
    }
    if (!soundEnabled || !spec) return;

    const [name, arg] = spec.split(":");
    if (presets[name]) {
      presets[name](arg ? parseFloat(arg) : undefined);
    }

    if (soundToggle) {
      soundToggle.classList.add("is-ringing");
      clearTimeout(ledTimer);
      ledTimer = setTimeout(() => soundToggle.classList.remove("is-ringing"), 320);
    }
  }

  document.querySelectorAll("[data-sound]").forEach((el) => {
    el.addEventListener("click", () => play(el.dataset.sound, el));
  });

  if (soundToggle) {
    soundToggle.addEventListener("click", () => {
      soundEnabled = !soundEnabled;
      soundToggle.setAttribute("aria-pressed", String(soundEnabled));
      if (soundEnabled) play("rim", null);
    });
  }

  /* ── 2. Kinetic Scroll Choreography ── */
  const kineticGroups = Array.from(document.querySelectorAll(".kinetic"));
  document.querySelectorAll("[data-drift-x], [data-drift-y], [data-rot]").forEach((el) => {
    if (el.dataset.driftX) el.style.setProperty("--dx", `${el.dataset.driftX}px`);
    if (el.dataset.driftY) el.style.setProperty("--dy", `${el.dataset.driftY}px`);
    if (el.dataset.rot) el.style.setProperty("--drot", `${el.dataset.rot}deg`);
  });

  if (!prefersReducedMotion && kineticGroups.length) {
    let ticking = false;
    const update = () => {
      const vh = window.innerHeight || 1;
      kineticGroups.forEach((g) => {
        const r = g.getBoundingClientRect();
        const center = r.top + r.height * 0.5;
        const p = Math.max(-1.2, Math.min(1.2, (vh * 0.5 - center) / (vh * 0.65)));
        g.style.setProperty("--p", p.toFixed(4));
      });
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
  }

  /* ── 3. Restrained Scroll Reveal ── */
  const reveals = document.querySelectorAll(".reveal");
  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("is-visible");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -32px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  /* ── 4. Native Interactive Controls ── */
  const notTabs = document.querySelectorAll("[data-notview]");
  const notPanels = document.querySelectorAll("[data-notpanel]");
  notTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const v = tab.dataset.notview;
      notTabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle("is-on", active);
        t.setAttribute("aria-selected", String(active));
      });
      notPanels.forEach((p) => p.classList.toggle("is-active", p.dataset.notpanel === v));
    });
  });

  /* The writing bar: one note value at a time; dot, triplet, rest, tie and the eraser toggle;
     one accidental at a time (again: off), as in the app. */
  const bar = document.querySelector(".selbar");
  if (bar) {
    const values = bar.querySelectorAll("[data-value]");
    const alters = bar.querySelectorAll("[data-alter]");
    values.forEach((b) => b.addEventListener("click", () => values.forEach((v) => v.classList.toggle("is-on", v === b))));
    alters.forEach((b) => b.addEventListener("click", () => {
      const on = !b.classList.contains("is-on");
      alters.forEach((a) => a.classList.toggle("is-on", on && a === b));
    }));
    bar.querySelectorAll("[data-toggle]").forEach((b) => b.addEventListener("click", () => b.classList.toggle("is-on")));
  }

  /* ── 5. The interface moving (no sound: only the shapes on the paper sing). ── */
  if (!prefersReducedMotion) {
    const seen = new Set();
    const watch = document.querySelectorAll("[data-anim]");
    if ("IntersectionObserver" in window) {
      const io2 = new IntersectionObserver((es) => es.forEach((e) => (e.isIntersecting ? seen.add(e.target) : seen.delete(e.target))), { threshold: 0.05 });
      watch.forEach((el) => io2.observe(el));
    } else {
      watch.forEach((el) => seen.add(el));
    }

    // The score: the playhead runs through bar 1 to 8, the first system then the second.
    const scoreFig = document.querySelector('[data-anim="score"]');
    const scoreSvg = scoreFig && scoreFig.querySelector("svg[data-span]");
    const span = scoreSvg ? parseFloat(scoreSvg.dataset.span) : 0;
    const ph = scoreSvg ? [scoreSvg.querySelector('.ph[data-sys="1"]'), scoreSvg.querySelector('.ph[data-sys="2"]')] : [];

    // SONG: the playhead goes through the Sätze; the open tab follows, passed links take colour.
    const songFig = document.querySelector('[data-anim="song"]');
    const blocks = songFig ? Array.from(songFig.querySelectorAll(".fb[data-bars]")) : [];
    const songPh = songFig && songFig.querySelector(".song-ph");
    const tabs = songFig ? Array.from(songFig.querySelectorAll(".tab")) : [];
    const chains = songFig ? Array.from(songFig.querySelectorAll(".chain")) : [];
    const totalBars = blocks.reduce((n, b) => n + parseFloat(b.dataset.bars), 0);

    // Mix: the automation playhead moves the Drums fader; the meters breathe.
    const mixFig = document.querySelector('[data-anim="mix"]');
    const auto = mixFig && mixFig.querySelector(".auto-svg");
    const autoPh = auto && auto.querySelector("#autoPh");
    const autoVal = auto && auto.querySelector("#autoVal");
    const pts = auto ? auto.dataset.pts.split(" ").map((p) => p.split(",").map(Number)) : [];
    const aw = auto ? parseFloat(auto.dataset.w) : 1;
    const ah = auto ? parseFloat(auto.dataset.h) : 1;
    const fader = mixFig && mixFig.querySelector("#drumsFader");
    const meters = mixFig ? Array.from(mixFig.querySelectorAll(".meters")) : [];
    const yAt = (x) => {
      for (let k = 1; k < pts.length; k++) {
        if (x <= pts[k][0]) {
          const [x0, y0] = pts[k - 1];
          const [x1, y1] = pts[k];
          return y0 + (y1 - y0) * ((x - x0) / Math.max(1e-6, x1 - x0));
        }
      }
      return pts.length ? pts[pts.length - 1][1] : 0;
    };

    const BAR = 1.6; // seconds per bar
    const t0 = performance.now();
    const frame = (now) => {
      const t = (now - t0) / 1000;
      if (scoreSvg && seen.has(scoreFig)) {
        const f = (t / BAR) % 8;
        const first = f < 4;
        ph[0].style.opacity = first ? 1 : 0;
        ph[1].style.opacity = first ? 0 : 1;
        ph[first ? 0 : 1].setAttribute("transform", `translate(${((f % 4) / 4) * span} 0)`);
      }
      if (songFig && seen.has(songFig) && totalBars > 0) {
        const f = (t / (BAR * 0.6)) % totalBars;
        songPh.style.left = `${(f / totalBars) * 100}%`;
        let acc = 0;
        let now_k = 0;
        blocks.forEach((b) => {
          const n = parseFloat(b.dataset.bars);
          if (f >= acc) now_k = parseInt(b.dataset.k, 10);
          acc += n;
        });
        tabs.forEach((tb) => tb.classList.toggle("is-open", parseInt(tb.dataset.k, 10) === now_k));
        chains.forEach((c) => c.classList.toggle("passed", parseInt(c.dataset.k, 10) < now_k));
      }
      if (auto && seen.has(mixFig)) {
        const x = ((t / (BAR * 8)) % 1) * aw;
        const y = yAt(x);
        autoPh.setAttribute("transform", `translate(${x} 0)`);
        const norm = 1 - y / ah;
        const db = norm < 0.02 ? "−∞" : (norm * 66 - 60).toFixed(1);
        autoVal.textContent = `${db === "−∞" ? db : (db > 0 ? "+" : "") + db} dB`;
        if (fader) fader.style.top = `${8 + (y / ah) * 80}%`;
        meters.forEach((m, i) => {
          const base = parseFloat(m.dataset.level || "60");
          const gain = i === 0 ? norm : 1;
          m.querySelectorAll("i").forEach((bar, j) => {
            const v = base * gain * (0.78 + 0.22 * Math.abs(Math.sin(t * (5.3 + i * 0.7) + j * 1.9))) * (0.9 + 0.1 * Math.sin(t * 13.1 + i + j));
            bar.style.height = `${Math.max(0, Math.min(100, v))}%`;
          });
        });
      }
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }
})();
