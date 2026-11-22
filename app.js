(() => {
  const C = window.SURPRISE_CONFIG;
  const $ = (s) => document.querySelector(s);
  const STORE = "sint-surprise-v1";

  const LEVELS = [
    { id: 1, titel: "GTA", icon: "🚗" },
    { id: 2, titel: "Rap", icon: "🎤" },
    { id: 3, titel: "Jargon", icon: "🏭" },
    { id: 4, titel: "Briefje", icon: "✉️" },
    { id: 5, titel: "Fortnite", icon: "🪂" },
  ];

  // ---------------- voortgang ----------------
  let done = load();
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
  const sint = (text, sec = 3.5) => g("sint_talk", `${text}|${sec}`);
  const lars = (text, sec = 3.0) => g("lars_talk", `${text}|${sec}`);
  const roast = () => C.roasts[Math.floor(Math.random() * C.roasts.length)];

  // ---------------- scènes (dialogen) + herhaal ----------------
  let sceneTimers = [];
  let lastScene = null;
  function cancelScene() { sceneTimers.forEach(clearTimeout); sceneTimers = []; }
  function playScene(lines) {
    cancelScene();
    lastScene = lines;
    let t = 0;
    for (const [who, text, sec] of lines) {
      sceneTimers.push(setTimeout(() => (who === "lars" ? lars : sint)(wrap(text), sec), t * 1000));
      t += sec + 0.7;
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
    $("#panel").hidden = true;
    document.body.classList.remove("has-panel");
  }

  function complete(id) {
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
  function stopRap() {
    clearInterval(rapTimer); rapTimer = null;
    audio.pause();
  }
  function rap() {
    openPanel(`<p class="step">Opdracht 2 · stap 1</p><h3>Rap battle</h3>
      <p>De Sint heeft een diss track gemaakt. Over jou. Luister goed — straks ben jij aan de beurt.</p>
      <div class="actions"><button class="btn btn-red" id="playRap">▶ Speel de diss track</button></div>
      <div class="lyrics" id="lyrics">${C.rapTekst.map((r) => `<p>${r}</p>`).join("")}</div>
      <div id="rapStep2" hidden>
        <p class="step">Stap 2</p>
        <p><b>Jouw beurt, ${C.naam}!</b> Rap minimaal 4 regels terug naar de Sint. De familie is de jury.</p>
        <div class="actions"><button class="btn btn-gold" id="juryOk">Jury: gehaald! 🔥</button></div>
      </div>`);
    const lines = [...document.querySelectorAll("#lyrics p")];
    const mark = (k) => {
      lines.forEach((p, n) => { p.className = n < k ? "past" : n === k ? "now" : ""; });
      if (lines[k]) lines[k].scrollIntoView({ block: "center", behavior: "smooth" });
    };
    const finish = () => { stopRap(); mark(lines.length); $("#rapStep2").hidden = false; };
    $("#juryOk").onclick = () => complete(2);

    $("#playRap").onclick = () => {
      stopRap();
      $("#playRap").textContent = "↻ Opnieuw";
      audio.src = C.rapAudio;
      audio.currentTime = 0;
      audio.play().then(() => {
        // met mp3: tekst gelijkmatig verdelen over de duur, Sint praat mee
        const dur = () => audio.duration || 120;
        let last = -1;
        rapTimer = setInterval(() => {
          const k = Math.min(lines.length - 1, Math.floor((audio.currentTime / dur()) * lines.length));
          if (k !== last) {
            last = k; mark(k);
            sint(wrap(C.rapTekst[k]), dur() / lines.length);
          }
        }, 250);
        audio.onended = finish;
      }).catch(() => {
        // zonder mp3: Sint leest elke regel voor in zijn tekstballon
        let k = 0;
        const next = () => {
          if (k >= lines.length) return finish();
          mark(k);
          sint(wrap(C.rapTekst[k]), 3.2);
          k++;
        };
        next();
        rapTimer = setInterval(next, 3400);
      });
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
    openPanel(`<p class="step">Opdracht 3</p><h3>Technische Bedrijfskunde</h3>
      <p>Leg deze termen uit aan de familie. Snappen ze er niks van maar moeten ze lachen? Dan heb je het goed gedaan.</p>
      <div class="terms">${C.jargon.map((j, n) => `<label class="term"><input type="checkbox" data-n="${n}"><span><b>${j.term}</b><small>${j.tip}</small></span></label>`).join("")}</div>
      <div class="actions"><button class="btn btn-gold" id="lachten" disabled>Ze lachten! 😂</button></div>`);
    const boxes = [...document.querySelectorAll(".term input")];
    boxes.forEach((b) => b.addEventListener("change", () => {
      if (b.checked) { cancelScene(); lars(wrap(C.jargon[b.dataset.n].term + "? Makkie."), 2.5); }
      $("#lachten").disabled = !boxes.every((x) => x.checked);
    }));
    $("#lachten").onclick = () => complete(3);
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
  const SFX = { tik: new Audio("audio/tik.wav"), scheet: new Audio("audio/scheet.wav") };
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
  });

  // ---------------- tekstballonnen (Godot stuurt via postMessage) ----------------
  const bubbleTimers = {};
  addEventListener("message", (e) => {
    const m = e.data;
    if (!m || m.type !== "speech") return;
    const el = m.who === "lars" ? $("#bubbleLars") : $("#bubbleSint");
    el.textContent = String(m.text).replace(/\s*\n\s*/g, " ");
    el.hidden = false;
    el.classList.remove("pop"); void el.offsetWidth; el.classList.add("pop");
    clearTimeout(bubbleTimers[m.who]);
    bubbleTimers[m.who] = setTimeout(() => (el.hidden = true), Math.max(1.5, +m.dur || 3) * 1000 + 600);
  });

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
  $("#replayBtn").onclick = () => (lastScene ? playScene(lastScene) : playIntro());
  $("#winClose").onclick = () => { $("#win").hidden = true; };
  $("#resetBtn").onclick = () => {
    if (confirm("Alle voortgang wissen en opnieuw beginnen?")) { done = []; save(); closePanel(); renderBoard(); }
  };
})();
