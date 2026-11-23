(() => {
  const C = window.SURPRISE_CONFIG;
  const $ = (s) => document.querySelector(s);
  const STORE = "sint-surprise-v1";

  const LEVELS = [
    { id: 1, titel: "GTA", icon: "🚗" },
    { id: 2, titel: "Rap", icon: "🎤" },
    { id: 3, titel: "Piet?!", icon: "🤷" },
    { id: 4, titel: "Briefje", icon: "✉️" },
    { id: 5, titel: "Fortnite", icon: "🪂" },
  ];

  // ---------------- voortgang ----------------
  // Bij elk laden van de site begint alles opnieuw (geen opgeslagen voortgang).
  let done = [];
  try { localStorage.removeItem(STORE); } catch {}
  function load() {
    try { return JSON.parse(localStorage.getItem(STORE)) || []; } catch { return []; }
  }
  function save() {
    try { localStorage.setItem(STORE, JSON.stringify(done)); } catch {}
  }
  const isDone = (id) => done.includes(id);
  const isUnlocked = (id) => id === 1 || isDone(id - 1);

  // ---------------- brug naar Godot (iframe) ----------------
  const frame = $("#game");
  const pending = [];
  let gameReady = false;
  function g(cmd, arg = "") {
    if (gameReady) send(cmd, arg); else pending.push([cmd, arg]);
  }
  function send(cmd, arg) {
    try { frame.contentWindow.godot_bridge(cmd, String(arg)); } catch (e) { /* game niet geladen */ }
  }
  function watchGame() {
    const t = setInterval(() => {
      try {
        if (frame.contentWindow && frame.contentWindow.godot_heads_ready) {
          gameReady = true; clearInterval(t);
          while (pending.length) send(...pending.shift());
          if (!lastScene) setTimeout(playIntro, 1200);
        }
      } catch {}
    }, 250);
  }
  const sint = (text, sec = 3.5, mouth = -1) => g("sint_talk", `${text}|${mouth}|${sec}`);
  const lars = (text, sec = 3.0, mouth = -1) => g("lars_talk", `${text}|${mouth}|${sec}`);
  const roast = () => C.roasts[Math.floor(Math.random() * C.roasts.length)];

  // ---------------- ingesproken stemmen (audio/stem/manifest.json) ----------------
  let VOICES = {};
  fetch("audio/stem/manifest.json", { cache: "no-cache" })
    .then((r) => (r.ok ? r.json() : {})).then((m) => (VOICES = m || {})).catch(() => {});
  const voiceFor = (who, text) => VOICES[VOICE.key(who, text)];
  const playing = { sint: null, lars: null };
  function speakVoice(who, text) {
    const v = voiceFor(who, text);
    if (!v) return 0;
    try { if (playing[who]) playing[who].pause(); } catch {}
    const a = new Audio("audio/stem/" + v.file);
    playing[who] = a;
    a.play().catch(() => {});
    g("mouth", `${who}|${v.dur}`);     // mond beweegt precies zo lang als de opname
    return v.dur;
  }

  // ---------------- scènes (dialogen) + herhaal ----------------
  let sceneTimers = [];
  let lastScene = null;
  let currentLevel = null;
  function cancelScene() { sceneTimers.forEach(clearTimeout); sceneTimers = []; }
  function playScene(lines) {
    cancelScene();
    lastScene = lines;
    let t = 0;
    for (const [who, text, sec] of lines) {
      const v = voiceFor(who, text);
      const len = v ? Math.max(sec, v.dur + 0.4) : sec;
      sceneTimers.push(setTimeout(() => (who === "lars" ? lars : sint)(wrap(text), len), t * 1000));
      t += len + 0.7;
    }
  }
  function playIntro() {
    const next = LEVELS.find((l) => !isDone(l.id));
    if (done.length === 0) playScene(C.intro);
    else if (next) playScene([["sint", `Welkom terug, ${C.naam}! Op naar vakje ${next.id}.`, 4]]);
  }

  async function startGame() {
    try {
      const r = await fetch("game/index.html", { method: "HEAD", cache: "no-store" });
      if (!r.ok) throw 0;
      frame.src = "game/index.html";
      watchGame();
    } catch {
      $("#stageFallback").hidden = false;
    }
  }

  // ---------------- UI ----------------
  function renderBoard() {
    const board = $("#board");
    board.innerHTML = "";
    const current = LEVELS.find((l) => !isDone(l.id));
    for (const l of LEVELS) {
      const b = document.createElement("button");
      const locked = !isUnlocked(l.id);
      b.className = "tile" + (locked ? " locked" : "") + (isDone(l.id) ? " done" : "") +
        (current && current.id === l.id ? " current" : "");
      b.disabled = locked;
      b.innerHTML = `<span class="lint"></span><span class="num">${isDone(l.id) ? "✓" : locked ? "🔒" : l.id}</span><span class="lbl">${l.icon} ${l.titel}</span>`;
      b.addEventListener("click", () => openLevel(l.id));
      board.appendChild(b);
    }
    $("#progressText").textContent = `${done.length} / 5`;
    $("#progressBar").style.width = `${done.length * 20}%`;
  }

  function openPanel(html) {
    $("#panelBody").innerHTML = html;
    $("#panel").hidden = false;
    document.body.classList.add("has-panel");
    $("#panel").scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function closePanel() {
    stopRap();
    currentLevel = null;
    $("#panel").hidden = true;
    document.body.classList.remove("has-panel");
  }

  function complete(id) {
    currentLevel = null;
    if (!isDone(id)) { done.push(id); save(); }
    g("level_complete", id);
    renderBoard();
    if (done.length === 5) setTimeout(win, 3500);
    else {
      openPanel(`<h3>Vakje ${id} is open! 🎉</h3><p>De Sint is (een beetje) onder de indruk. Op naar vakje ${id + 1}.</p>
        <div class="actions"><button class="btn btn-gold" id="nextBtn">Volgende opdracht</button></div>`);
      $("#nextBtn").onclick = () => openLevel(id + 1);
    }
  }

  function openLevel(id) {
    if (!isUnlocked(id)) return;
    stopRap();
    currentLevel = id;
    playScene(C.levelIntro[id]);
    ({ 1: () => quiz(1, "GTA", "GTA ken jij als je broekzak? Bewijs het maar.", C.gta),
       2: rap,
       3: jargon,
       4: briefje,
       5: () => quiz(5, "Fortnite", "Laatste kans! Fortnite is jouw wereld… toch?", C.fortnite) })[id]();
  }

  // ---------------- Level 1 + 5: quiz ----------------
  function quiz(id, titel, intro, vragen) {
    let i = 0, fouten = 0;
    const show = () => {
      const v = vragen[i];
      openPanel(`<p class="step">Opdracht ${id} · vraag ${i + 1} van ${vragen.length}</p>
        <h3>${titel}</h3><p>${intro}</p>
        <div class="quiz-q">${v.q}</div>
        <div class="options">${v.a.map((a, n) => `<button class="opt" data-n="${n}">${a}</button>`).join("")}</div>
        <div class="feedback" id="fb"></div>`);
      document.querySelectorAll(".opt").forEach((b) => b.addEventListener("click", () => answer(b)));
    };
    const answer = (b) => {
      const v = vragen[i], n = +b.dataset.n, fb = $("#fb");
      if (n === v.ok) {
        b.classList.add("right");
        fb.className = "feedback good"; fb.textContent = "Goed!";
        document.querySelectorAll(".opt").forEach((o) => (o.disabled = true));
        g("sint_nod");
        setTimeout(() => { i++; i < vragen.length ? show() : complete(id); }, 900);
      } else {
        fouten++; cancelScene();
        b.classList.add("wrong"); b.disabled = true;
        fb.className = "feedback bad"; fb.textContent = "Fout… probeer het nog eens.";
        sint(roast(), 3.5); g("punish");
        if (fouten === 3) setTimeout(() => lars("Wacht even...\ndat wist ik\necht wel...", 2.5), 700);
      }
    };
    show();
  }

  // ---------------- Level 2: rap ----------------
  let rapTimer = null;
  const audio = $("#rapAudio");
  let rapPlaying = false;
  function stopRap() {
    clearInterval(rapTimer); rapTimer = null;
    audio.pause();
    if (rapPlaying) { rapPlaying = false; g("rap_stop"); }
  }
  function rap() {
    openPanel(`<p class="step">Opdracht 2 · rap battle</p><h3>Sint vs ${C.naam}</h3>
      <p>Allebei een disrap. Eerst wordt er geloot wie mag beginnen.</p>
      <div class="toss" id="toss"><span id="tossName">?</span></div>
      <div class="actions"><button class="btn btn-gold" id="tossBtn">🎲 Loot wie begint</button></div>
      <div id="rapSint" hidden>
        <p class="step">Ronde 1 · de Sint</p>
        <div class="actions"><button class="btn btn-red" id="playRap">▶ Sint, drop de beat</button></div>
        <p class="rap-now" id="rapNow" hidden>🎵 De Sint rapt… luister goed.</p>
      </div>
      <div id="rapLars" hidden>
        <p class="step">Ronde 2 · ${C.naam}</p>
        <p><b>Jouw beurt, ${C.naam}!</b> Geef de Sint een disrap terug. Druk op <b>Klaar</b> als je klaar bent.</p>
        <div class="actions"><button class="btn btn-red" id="larsStart">🎤 Ik ga rappen</button>
        <button class="btn btn-gold" id="larsKlaar" hidden>Klaar! 🎤⬇</button></div>
      </div>`);

    // loting: draait tussen Sint en Lars, maar... de Sint wint altijd
    $("#tossBtn").onclick = () => {
      $("#tossBtn").disabled = true;
      const names = ["Sint", C.naam]; let n = 0, delay = 70;
      const spin = () => {
        $("#tossName").textContent = names[n++ % 2];
        delay *= 1.13;
        if (delay < 420 || n % 2 === 1) setTimeout(spin, delay);
        else {
          $("#tossName").textContent = "Sint";
          $("#toss").classList.add("won");
          playScene([["sint", "Ha! De Sint begint. Natuurlijk.", 3.2],
                     ["lars", "Dat is doorgestoken kaart!", 3.0],
                     ["sint", "Stil jij. DJ Piet, drop die beat!", 3.2]]);
          setTimeout(() => { $("#rapSint").hidden = false; $("#tossBtn").closest(".actions").hidden = true;
                             $("#rapSint").scrollIntoView({ behavior: "smooth", block: "start" }); }, 1200);
        }
      };
      spin();
    };

    const sintDone = () => {
      stopRap();
      $("#rapNow").hidden = true;
      playScene([["sint", `Boem. Jouw beurt, ${C.naam}. Als je durft.`, 3.5]]);
      $("#rapLars").hidden = false;
      $("#rapLars").scrollIntoView({ behavior: "smooth", block: "start" });
    };

    // Ronde 1: alleen de muziek. Sint en Lars draaien naar elkaar, armen over elkaar,
    // Sint zet zijn staf neer, ze deinen mee en Sint praat rustig mee (geen tekst/ballonnen).
    $("#playRap").onclick = () => {
      stopRap(); cancelScene();
      hideBubbles();
      $("#playRap").textContent = "↻ Opnieuw vanaf het begin";
      audio.src = C.rapAudio;
      audio.currentTime = 0;
      audio.play().then(() => {
        rapPlaying = true;
        $("#rapNow").hidden = false;
        g("rap_start", C.rapBpm || 91.34);
        audio.onended = sintDone;
      }).catch(() => {
        $("#rapNow").hidden = false;
        $("#rapNow").textContent = "De muziek kon niet starten. Tik nog een keer op de knop.";
      });
    };

    // Lars rapt live; zijn mond beweegt tot hij op Klaar drukt
    let larsTalk = null;
    $("#larsStart").onclick = () => {
      stopRap(); cancelScene();
      $("#larsStart").hidden = true; $("#larsKlaar").hidden = false;
      const keep = () => lars("", 4, 4);   // mond beweegt, geen tekstballon
      keep(); larsTalk = setInterval(keep, 3800);
    };
    $("#larsKlaar").onclick = () => {
      clearInterval(larsTalk);
      lars("Mic drop.", 2.0);
      setTimeout(() => complete(2), 1500);
    };
  }
  // tekstballon: regel afbreken op ~16 tekens
  function wrap(t, w = 16) {
    const out = []; let line = "";
    for (const word of t.split(" ")) {
      if ((line + " " + word).trim().length > w && line) { out.push(line); line = word; }
      else line = (line + " " + word).trim();
    }
    if (line) out.push(line);
    return out.join("\n");
  }

  // ---------------- Level 3: jargon ----------------
  function jargon() {
    openPanel(`<p class="step">Opdracht 3</p><h3>Piet snapt het niet</h3>
      <p>Piet snapt helemaal niks van Technische Bedrijfskunde. Leg hem deze termen uit, ${C.naam}.
      (De familie speelt Piet.) Snapt Piet het? Vink hem af.</p>
      <div class="terms">${C.jargon.map((j, n) => `<label class="term"><input type="checkbox" data-n="${n}"><span><b>${j.term}</b><small>${j.tip}</small></span></label>`).join("")}</div>
      <div class="actions"><button class="btn btn-gold" id="pietSnapt" disabled>Piet snapt het! 🎓</button></div>`);
    const boxes = [...document.querySelectorAll(".term input")];
    const reacties = ["Piet: 'Ahhh... nee.'", "Piet: 'Dus... pepernoten?'", "Piet: 'Ik snap het! ...denk ik.'"];
    boxes.forEach((b) => b.addEventListener("change", () => {
      if (b.checked) { cancelScene(); sint(wrap(reacties[b.dataset.n % reacties.length]), 3); }
      $("#pietSnapt").disabled = !boxes.every((x) => x.checked);
    }));
    $("#pietSnapt").onclick = () => complete(3);
  }

  // ---------------- Level 4: briefje ----------------
  function briefje() {
    openPanel(`<p class="step">Opdracht 4</p><h3>Het briefje</h3>
      <p>Ergens in huis ligt een briefje met een geheime code.</p>
      <p><i>${C.briefjeHint}</i></p>
      <div class="code-row"><input id="code" autocomplete="off" placeholder="CODE"><button class="btn btn-red" id="checkCode">Check</button></div>
      <div class="feedback" id="fb"></div>`);
    const check = () => {
      const v = $("#code").value.trim().toUpperCase();
      if (v === C.briefjeCode.toUpperCase()) { g("sint_nod"); complete(4); }
      else {
        $("#fb").className = "feedback bad"; $("#fb").textContent = "Dat is hem niet. Zoek verder!";
        cancelScene(); g("sint_say", "level4_fail"); g("punish");
      }
    };
    $("#checkCode").onclick = check;
    $("#code").addEventListener("keydown", (e) => e.key === "Enter" && check());
  }

  // ---------------- Winst ----------------
  function win() {
    g("win");
    $("#win").hidden = false;
    confetti();
  }
  function confetti() {
    const cv = $("#confetti"), ctx = cv.getContext("2d");
    const resize = () => { cv.width = innerWidth; cv.height = innerHeight; };
    resize(); addEventListener("resize", resize);
    const cols = ["#f2b632", "#b3151b", "#fff6e3", "#ffe08a", "#7d0d12"];
    const bits = Array.from({ length: 160 }, () => ({
      x: Math.random() * cv.width, y: -Math.random() * cv.height, r: 4 + Math.random() * 6,
      vy: 1.5 + Math.random() * 3, vx: -1 + Math.random() * 2, a: Math.random() * 6, c: cols[Math.floor(Math.random() * cols.length)],
    }));
    const tick = () => {
      if ($("#win").hidden) return;
      ctx.clearRect(0, 0, cv.width, cv.height);
      for (const b of bits) {
        b.y += b.vy; b.x += b.vx; b.a += 0.05;
        if (b.y > cv.height + 10) { b.y = -10; b.x = Math.random() * cv.width; }
        ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.a); ctx.fillStyle = b.c;
        ctx.fillRect(-b.r / 2, -b.r / 4, b.r, b.r / 2); ctx.restore();
      }
      requestAnimationFrame(tick);
    };
    tick();
  }

  // ---------------- geluidseffecten (Godot vraagt erom via postMessage) ----------------
  const SFX = { tik: new Audio("audio/tik.wav"), scheet: new Audio("audio/scheet.mp3") };
  Object.values(SFX).forEach((a) => (a.preload = "auto"));
  function unlockSfx() {   // telefoons: geluid moet eerst één keer binnen een klik gestart zijn
    for (const a of Object.values(SFX)) {
      a.muted = true;
      a.play().then(() => { a.pause(); a.currentTime = 0; a.muted = false; }).catch(() => { a.muted = false; });
    }
  }
  addEventListener("message", (e) => {
    const m = e.data;
    if (!m || m.type !== "sfx" || !SFX[m.name]) return;
    const a = SFX[m.name];
    a.currentTime = 0;
    a.play().catch(() => {});
    setTimeout(() => (m.name === "tik" ? lars("AU!", 1.6) : lars("BAH! Sint!!", 2.2)), 250);
  });

  // ---------------- tekstballonnen (Godot stuurt via postMessage) ----------------
  const bubbleTimers = {};
  addEventListener("message", (e) => {
    const m = e.data;
    if (!m || m.type !== "speech") return;
    const el = m.who === "lars" ? $("#bubbleLars") : $("#bubbleSint");
    if (!String(m.text).trim()) { el.hidden = true; return; }
    const vdur = speakVoice(m.who === "lars" ? "lars" : "sint", m.text);
    if (vdur) m.dur = Math.max(+m.dur || 0, vdur + 0.3);
    el.textContent = String(m.text).replace(/\s*\n\s*/g, " ");
    el.hidden = false;
    el.classList.remove("pop"); void el.offsetWidth; el.classList.add("pop");
    clearTimeout(bubbleTimers[m.who]);
    bubbleTimers[m.who] = setTimeout(() => (el.hidden = true), Math.max(1.5, +m.dur || 3) * 1000 + 600);
  });

  function hideBubbles() { $("#bubbleSint").hidden = true; $("#bubbleLars").hidden = true; }

  // ---------------- start ----------------
  document.querySelectorAll(".naam").forEach((n) => (n.textContent = C.naam));
  $("#startBtn").onclick = () => {
    unlockSfx();
    $("#intro").hidden = true;
    $("#app").hidden = false;
    startGame();
    renderBoard();
    if (done.length === 5) win();
  };
  $("#panelClose").onclick = closePanel;
  // Herhaal: het level waar je in zit opnieuw (dialoog + opdracht). Zit je niet in een level,
  // dan het volgende level; alleen helemaal aan het begin de openingsdialoog.
  $("#replayBtn").onclick = () => {
    if (currentLevel) return openLevel(currentLevel);
    const next = LEVELS.find((l) => !isDone(l.id));
    if (done.length === 0 && $("#panel").hidden) return playScene(C.intro);
    if (next) openLevel(next.id);
  };
  $("#winClose").onclick = () => { $("#win").hidden = true; };
  $("#resetBtn").onclick = () => {
    if (confirm("Alle voortgang wissen en opnieuw beginnen?")) { done = []; save(); closePanel(); renderBoard(); }
  };
})();
