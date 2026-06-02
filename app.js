/* =====================================================================
   app.js — builds the desktop from data.js and runs the interactions
   (dragging, minimise/close, taskbar tabs, photo lightbox, clock).
   You usually don't need to edit this file. ♡
   ===================================================================== */

(function () {
  "use strict";

  const desktop = document.getElementById("desktop");
  const nav = document.getElementById("nav");
  const lightbox = document.getElementById("lightbox");
  let topZ = 10;

  /* ---------- small helpers ---------- */
  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };
  const esc = (s) =>
    String(s).replace(/[&<>"]/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])
    );

  /* A photo tile: real <img> if src is set, otherwise a cute placeholder. */
  function photoTile(p, hobbyEmoji) {
    const tile = el("div", "photo");
    if (p.src) {
      tile.innerHTML = `<img src="${esc(p.src)}" alt="${esc(p.caption || "")}">`;
    } else {
      tile.innerHTML =
        `<div class="ph"><span><span class="ph-icon">${hobbyEmoji}</span>add photo</span></div>`;
    }
    if (p.caption) tile.appendChild(el("div", "cap", esc(p.caption)));
    tile.addEventListener("click", () => openLightbox(p, hobbyEmoji));
    return tile;
  }

  /* ---------- window factory ---------- */
  // opts: { id, emoji, title, x, y, w, bodyNode }
  function makeWindow(opts) {
    const win = el("div", "window");
    win.id = "win-" + opts.id;
    win.style.left = opts.x + "px";
    win.style.top = opts.y + "px";
    if (opts.w) win.style.width = opts.w + "px";

    const bar = el("div", "title-bar");
    bar.innerHTML =
      `<span class="t-emoji">${opts.emoji || "✿"}</span>` +
      `<span class="t-name">${esc(opts.title)}</span>`;
    const controls = el("div", "win-controls");
    const bMin = el("button", null, "_");
    const bMax = el("button", null, "▢");
    const bClose = el("button", null, "✕");
    controls.append(bMin, bMax, bClose);
    bar.appendChild(controls);

    const body = el("div", "window-body");
    body.appendChild(opts.bodyNode);

    win.append(bar, body);
    desktop.appendChild(win);

    /* focus / bring-to-front */
    const focus = () => {
      document.querySelectorAll(".window.focused").forEach((w) => w.classList.remove("focused"));
      win.classList.add("focused");
      win.style.zIndex = ++topZ;
    };
    win.addEventListener("pointerdown", focus);

    /* controls */
    bMin.addEventListener("click", (e) => { e.stopPropagation(); win.classList.toggle("minimized"); });
    bClose.addEventListener("click", (e) => { e.stopPropagation(); win.style.display = "none"; });
    let big = false, prevW = "";
    bMax.addEventListener("click", (e) => {
      e.stopPropagation();
      big = !big;
      if (big) { prevW = win.style.width; win.style.width = "min(560px, 90vw)"; }
      else { win.style.width = prevW || (opts.w ? opts.w + "px" : ""); }
    });

    /* dragging (desktop only — CSS makes windows static on mobile) */
    let dragging = false, offX = 0, offY = 0;
    bar.addEventListener("pointerdown", (e) => {
      if (e.target.closest(".win-controls")) return;
      if (window.matchMedia("(max-width: 820px)").matches) return;
      dragging = true;
      const r = win.getBoundingClientRect();
      const d = desktop.getBoundingClientRect();
      offX = e.clientX - r.left;
      offY = e.clientY - r.top;
      win._dRect = d;
      bar.setPointerCapture(e.pointerId);
    });
    bar.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      const d = win._dRect;
      let x = e.clientX - d.left - offX;
      let y = e.clientY - d.top - offY;
      x = Math.max(0, Math.min(x, d.width - 60));
      y = Math.max(0, Math.min(y, d.height - 30));
      win.style.left = x + "px";
      win.style.top = y + "px";
    });
    const stop = (e) => { if (dragging) { dragging = false; try { bar.releasePointerCapture(e.pointerId); } catch (_) {} } };
    bar.addEventListener("pointerup", stop);
    bar.addEventListener("pointercancel", stop);

    /* taskbar tab that reopens + focuses this window */
    const tab = el("div", "tab", esc(opts.tab || opts.id));
    tab.addEventListener("click", () => {
      win.style.display = "";
      win.classList.remove("minimized");
      focus();
      win.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    nav.appendChild(tab);

    return win;
  }

  /* ---------- build the content nodes ---------- */
  function aboutNode() {
    const wrap = el("div", "about");
    const av = SITE.avatar
      ? `<img class="avatar" src="${esc(SITE.avatar)}" alt="me">`
      : `<div class="avatar">(◕‿◕)</div>`;
    wrap.innerHTML =
      av +
      `<div><h2>hi, i'm ${esc(SITE.ownerName)}</h2>` +
      `<p>${esc(SITE.aboutText)}</p></div>`;
    return wrap;
  }

  function galleryNode(hobby) {
    const wrap = el("div");
    if (hobby.blurb) wrap.appendChild(el("p", "blurb", esc(hobby.blurb)));
    const grid = el("div", "gallery");
    (hobby.photos || []).forEach((p) => grid.appendChild(photoTile(p, hobby.emoji)));
    wrap.appendChild(grid);
    return wrap;
  }

  function playerNode() {
    const np = SITE.nowPlaying || { track: "untitled", artist: "" };
    const wrap = el("div", "player");
    wrap.innerHTML =
      `<div class="screen">
         <div class="cloud" style="width:60px;height:22px;left:20px;top:18px"></div>
         <div class="cloud" style="width:46px;height:18px;left:120px;top:40px"></div>
         <div class="cloud" style="width:38px;height:16px;right:18px;top:14px"></div>
       </div>
       <div class="meta"><b>${esc(np.track)}</b><br>${esc(np.artist)}</div>
       <div class="progress"><span></span></div>
       <div class="controls">
         <button data-a="prev">◁◁</button>
         <button data-a="play">▶</button>
         <button data-a="next">▷▷</button>
       </div>`;
    // purely-decorative play/pause toggle
    wrap.querySelector('[data-a="play"]').addEventListener("click", function () {
      this.textContent = this.textContent === "▶" ? "❚❚" : "▶";
    });
    return wrap;
  }

  function connectNode() {
    const wrap = el("div");
    wrap.appendChild(el("p", "blurb", "let's be friends! ♡"));
    const ul = el("ul", "links");
    (SITE.links || []).forEach((l) => {
      const li = el("li");
      li.innerHTML =
        `<a href="${esc(l.url || "#")}" ${l.url && l.url.startsWith("http") ? 'target="_blank" rel="noopener"' : ""}>` +
        `<span class="lbl">${esc(l.label)}</span><span class="hnd">${esc(l.handle)}</span></a>`;
      ul.appendChild(li);
    });
    wrap.appendChild(ul);
    return wrap;
  }

  /* ---------- lightbox ---------- */
  function openLightbox(p, emoji) {
    const body = lightbox.querySelector(".lb-body");
    const cap = lightbox.querySelector(".lb-cap");
    body.innerHTML = p.src
      ? `<img src="${esc(p.src)}" alt="${esc(p.caption || "")}">`
      : `<div class="lb-ph"><span><span class="big">${emoji}</span><br>add a photo in data.js</span></div>`;
    cap.textContent = p.caption || "";
    lightbox.classList.add("open");
  }
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox || e.target.closest("[data-close]")) lightbox.classList.remove("open");
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") lightbox.classList.remove("open"); });

  /* ---------- live clock in the taskbar ---------- */
  function tickClock() {
    const c = document.getElementById("clock");
    if (!c) return;
    const d = new Date();
    let h = d.getHours();
    const m = String(d.getMinutes()).padStart(2, "0");
    const ap = h >= 12 ? "pm" : "am";
    h = h % 12 || 12;
    c.textContent = `♡ ${h}:${m} ${ap}`;
  }

  /* ---------- lay everything out ---------- */
  function build() {
    document.title = SITE.siteTitle || "my page";
    document.getElementById("logoName").textContent = SITE.siteTitle || SITE.ownerName;

    // Starting positions are auto-staggered so it looks like a tidy desktop.
    // On mobile, CSS ignores these and stacks the windows in order.
    let y = 30;
    const colL = 30, colR = 410;

    makeWindow({ id: "about", emoji: "✿", title: "welcome.exe", tab: "about",
      x: colL, y: y, w: 360, bodyNode: aboutNode() });

    makeWindow({ id: "music", emoji: "🎵", title: "mood.mp3", tab: "music",
      x: colR, y: y, w: 300, bodyNode: playerNode() });

    y += 230;

    // one window per hobby, alternating left / right columns
    SITE.hobbies.forEach((h, i) => {
      const left = i % 2 === 0;
      makeWindow({
        id: h.id, emoji: h.emoji, title: h.title, tab: h.id,
        x: left ? colL : colR,
        y: y + Math.floor(i / 2) * 300,
        w: 360,
        bodyNode: galleryNode(h),
      });
    });

    const lastRow = y + Math.ceil(SITE.hobbies.length / 2) * 300;
    makeWindow({ id: "connect", emoji: "✉", title: "connect.exe", tab: "connect",
      x: colL, y: lastRow, w: 360, bodyNode: connectNode() });

    // give the desktop enough height to hold all windows (desktop view)
    if (!window.matchMedia("(max-width: 820px)").matches) {
      desktop.style.minHeight = (lastRow + 360) + "px";
    }

    tickClock();
    setInterval(tickClock, 10000);
  }

  document.addEventListener("DOMContentLoaded", build);
})();
