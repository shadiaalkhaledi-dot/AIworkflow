/* The building's shared room engine.
   Each room page sets <body data-room="studio|pinup|modelshop|library|boardroom">,
   loads assets/rooms-payload.js (window.ROOMS_PAYLOAD, AES-256-GCM, same knock
   as the Annex), then this file. No gate here — the knock belongs to the Annex
   door; if it isn't remembered, you get walked back. */
(function () {
  var STORAGE_KEY = "annex-knock";
  var room = document.body.getAttribute("data-room");

  /* ---- shared room styles ---- */
  var css = document.createElement("style");
  css.textContent =
    ".hairline{background:linear-gradient(90deg,#f59e0b 0%,#3fc6ff 48%,#4f46e5 78%,transparent 96%);}" +
    ".room-hero{text-align:center;padding-bottom:8px;}" +
    ".room-hero .eyebrow{color:#b45309;}" +
    ".room-hero p.lead{margin:0 auto;max-width:600px;}" +
    ".building-nav{display:flex;gap:4px;flex-wrap:wrap;justify-content:center;margin:26px auto 0;max-width:760px;}" +
    ".building-nav a{font-size:.78rem;font-weight:700;letter-spacing:.04em;padding:6px 12px;border-radius:20px;border:1px solid var(--line);color:#8a8579;text-decoration:none;}" +
    ".building-nav a:hover{border-color:#f59e0b;color:#b45309;}" +
    ".building-nav a.here{background:#fff1d6;color:#b45309;border-color:#f5c96b;}" +
    ".room-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px;max-width:860px;margin:36px auto 0;padding:0 24px;}" +
    "@media(max-width:680px){.room-grid{grid-template-columns:1fr;}}" +
    ".room-card{border-radius:16px;padding:22px;background:#fff;border:1px solid var(--line);}" +
    ".room-card.amber{border-color:#f5c96b;background:linear-gradient(180deg,#fffdf7,#fff8ec);}" +
    ".room-card.reserved{border-style:dashed;border-color:#c7d2fe;background:#fafbff;}" +
    ".room-card.ben{border-color:#8fd8f7;background:linear-gradient(180deg,#f7fdff,#e8f7ff);}" +
    ".room-card h3{margin:0 0 8px;font-size:1.1rem;}" +
    ".room-card p{font-size:.9rem;line-height:1.6;color:#5d5a52;margin:0 0 10px;}" +
    ".room-card p:last-child{margin-bottom:0;}" +
    ".rc-tag{display:inline-block;font-size:.7rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:4px 10px;border-radius:20px;margin-bottom:10px;margin-right:6px;}" +
    ".rc-tag.amber{background:#fff1d6;color:#b45309;}" +
    ".rc-tag.indigo{background:#eef2ff;color:#4f46e5;}" +
    ".rc-tag.green{background:#e3f7ee;color:#0a7d57;}" +
    ".rc-tag.gray{background:#f1efe9;color:#8a8579;}" +
    ".rc-tag.red{background:#fdeceb;color:#b3423a;}" +
    ".rc-tag.blue{background:#e8f7ff;color:#0b7cb5;}" +
    ".rc-label{display:block;font-size:.7rem;font-weight:700;letter-spacing:.09em;text-transform:uppercase;color:#b45309;margin:12px 0 3px;}" +
    ".pin-wall{max-width:860px;margin:36px auto 0;padding:0 24px;display:grid;grid-template-columns:1fr 1fr;gap:18px;}" +
    "@media(max-width:680px){.pin-wall{grid-template-columns:1fr;}}" +
    ".pin{border-radius:4px 16px 16px 16px;padding:20px;background:#fff;border:1px solid var(--line);position:relative;box-shadow:0 6px 18px rgba(43,42,39,0.06);}" +
    ".pin::before{content:\"\";position:absolute;top:-7px;left:22px;width:12px;height:12px;border-radius:50%;background:#f59e0b;box-shadow:0 1px 3px rgba(0,0,0,.3);}" +
    ".pin .stamp{font-size:.72rem;font-weight:800;letter-spacing:.14em;padding:3px 10px;border-radius:4px;display:inline-block;margin-bottom:10px;}" +
    ".pin .stamp.win{background:#e3f7ee;color:#0a7d57;border:1px solid #bfe8d4;}" +
    ".pin .stamp.fail{background:#fdeceb;color:#b3423a;border:1px solid #f5cdc9;}" +
    ".pin .pin-date{float:right;font-size:.75rem;color:#b3aea2;}" +
    ".pin p{font-size:.88rem;line-height:1.6;color:#5d5a52;margin:0 0 8px;}" +
    ".pin p b{color:#2b2a27;}" +
    ".freshness{max-width:860px;margin:14px auto 0;padding:0 24px;text-align:right;font-size:.78rem;color:#b3aea2;}" +
    ".shelf-list{max-width:760px;margin:36px auto 0;padding:0 24px;}" +
    ".shelf{display:flex;gap:16px;align-items:baseline;padding:16px 4px;border-bottom:1px solid var(--line);}" +
    ".shelf h3{margin:0;font-size:1rem;flex:0 0 240px;}" +
    "@media(max-width:680px){.shelf{flex-direction:column;gap:6px;}.shelf h3{flex:none;}}" +
    ".shelf p{margin:0;font-size:.88rem;line-height:1.55;color:#5d5a52;flex:1;}" +
    ".law{max-width:760px;margin:30px auto 0;padding:0 24px;}" +
    ".road{max-width:760px;margin:36px auto 0;padding:0 24px;}" +
    ".road-step{display:flex;gap:16px;padding:16px 4px;border-bottom:1px solid var(--line);align-items:baseline;}" +
    ".road-step .num{flex:0 0 34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:.9rem;background:#f1efe9;color:#8a8579;align-self:flex-start;}" +
    ".road-step.done .num{background:#e3f7ee;color:#0a7d57;}" +
    ".road-step.here .num{background:#f59e0b;color:#fff;box-shadow:0 0 0 4px #fff1d6;}" +
    ".road-step h3{margin:0 0 4px;font-size:1rem;}" +
    ".road-step p{margin:0;font-size:.88rem;line-height:1.55;color:#5d5a52;}" +
    ".you-are-here{display:inline-block;font-size:.68rem;font-weight:800;letter-spacing:.12em;background:#f59e0b;color:#fff;padding:2px 8px;border-radius:4px;margin-left:8px;vertical-align:2px;}" +
    ".room-note{max-width:640px;margin:34px auto 0;padding:14px 18px;border-left:3px solid #f59e0b;background:#fffaf0;border-radius:0 12px 12px 0;font-size:.9rem;font-style:italic;color:#5d5a52;line-height:1.6;}" +
    ".room-note.indigo{border-left-color:#4f46e5;background:#f6f7ff;}" +
    ".room-note.blue{border-left-color:#0b7cb5;background:#e8f7ff;}" +
    ".room-note .who{display:block;font-size:.68rem;font-style:normal;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:#0b7cb5;margin-bottom:5px;}" +
    "@media(max-width:480px){" +
      ".pin .pin-date{float:none;display:block;margin:-4px 0 8px;}" +
      ".road-step{flex-wrap:wrap;}" +
      ".road-step .num{flex:0 0 28px;height:28px;font-size:.8rem;}" +
      ".shelf h3{font-size:.95rem;}" +
      ".room-grid,.pin-wall{gap:14px;}" +
      ".room-card,.pin{padding:16px;}" +
      ".you-are-here{display:block;width:max-content;margin:6px 0 0;}" +
    "}";
  document.head.appendChild(css);

  /* ---- crypto ---- */
  function b64(b){ return Uint8Array.from(atob(b), function(c){return c.charCodeAt(0);}); }
  async function unlock(pw){
    try{
      var p = window.ROOMS_PAYLOAD;
      var base = await crypto.subtle.importKey("raw", new TextEncoder().encode(pw), {name:"PBKDF2"}, false, ["deriveKey"]);
      var key = await crypto.subtle.deriveKey({name:"PBKDF2", salt:b64(p.salt), iterations:p.iterations, hash:"SHA-256"}, base, {name:"AES-GCM", length:256}, false, ["decrypt"]);
      var buf = await crypto.subtle.decrypt({name:"AES-GCM", iv:b64(p.iv)}, key, b64(p.ciphertext));
      return JSON.parse(new TextDecoder().decode(buf));
    }catch(e){ return null; }
  }

  /* ---- tiny DOM helpers ---- */
  function el(tag, cls, text){ var e = document.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; return e; }
  function labeled(parent, label, text){ if (!text) return; parent.appendChild(el("span","rc-label",label)); parent.appendChild(el("p",null,text)); }

  /* ---- renderers ---- */
  var render = {
    studio: function (c, mount) {
      var grid = el("div","room-grid");
      c.desks.forEach(function(d){
        var ownerCls = d.owner === "amber" ? "amber" : d.owner === "ben" ? "ben" : "reserved";
        var tagCls = d.owner === "amber" ? "amber" : d.owner === "ben" ? "blue" : "indigo";
        var card = el("div","room-card " + ownerCls);
        var tag = el("span","rc-tag " + tagCls, d.tag);
        card.appendChild(tag);
        if (d.status) card.appendChild(el("span","rc-tag " + (d.status === "live" ? "green" : d.status === "evolving" ? "amber" : "gray"), d.status));
        card.appendChild(el("h3",null,d.name));
        labeled(card,"The annoyance",d.origin);
        labeled(card,"What it does",d.does);
        labeled(card,"Tuesday, before / after",d.tuesday);
        labeled(card,"What broke",d.broke);
        labeled(card,"Steal this",d.steal);
        grid.appendChild(card);
      });
      mount.appendChild(grid);
      if (c.note){ var n = el("div","room-note",c.note); mount.appendChild(n); }
    },

    pinup: function (c, mount) {
      var wall = el("div","pin-wall");
      c.pins.forEach(function(p){
        var pin = el("div","pin");
        pin.appendChild(el("span","stamp " + (p.stamp === "WIN" ? "win" : "fail"), p.stamp));
        pin.appendChild(el("span","pin-date",p.date));
        var t = el("p"); t.innerHTML = "<b>Tried:</b> "; t.appendChild(document.createTextNode(p.tried)); pin.appendChild(t);
        var h = el("p"); h.innerHTML = "<b>Happened:</b> "; h.appendChild(document.createTextNode(p.happened)); pin.appendChild(h);
        var v = el("p"); v.innerHTML = "<b>Verdict:</b> "; v.appendChild(document.createTextNode(p.verdict)); pin.appendChild(v);
        wall.appendChild(pin);
      });
      mount.appendChild(wall);
      var fresh = el("div","freshness","Last pinned: " + c.lastPinned + " — a stale wall is a dead wall, so hold us to this date.");
      mount.appendChild(fresh);
      if (c.note) mount.appendChild(el("div","room-note",c.note));
    },

    modelshop: function (c, mount) {
      var grid = el("div","room-grid");
      c.models.forEach(function(m){
        var card = el("div","room-card" + (m.status === "abandoned" ? "" : m.status === "in progress" ? " amber" : ""));
        var cls = m.status === "in progress" ? "amber" : m.status === "promoted" ? "green" : m.status === "abandoned" ? "red" : "gray";
        card.appendChild(el("span","rc-tag " + cls, m.status));
        card.appendChild(el("h3",null,m.name));
        labeled(card,"Proposes",m.proposes);
        labeled(card,"Needs to become real",m.needs);
        labeled(card,"Why it's still here",m.why);
        grid.appendChild(card);
      });
      mount.appendChild(grid);
      if (c.note) mount.appendChild(el("div","room-note",c.note));
    },

    library: function (c, mount) {
      var law = el("div","law");
      var callout = el("div","room-note indigo",c.rule);
      law.appendChild(callout);
      mount.appendChild(law);
      var list = el("div","shelf-list");
      c.shelves.forEach(function(s){
        var row = el("div","shelf");
        var head = el("h3",null,s.name + " ");
        head.appendChild(el("span","rc-tag " + (s.status === "connected" ? "green" : s.status === "sampled" ? "amber" : "gray"), s.status));
        row.appendChild(head);
        row.appendChild(el("p",null,s.lives + " Asking it looks like: " + s.asking));
        list.appendChild(row);
      });
      mount.appendChild(list);
      if (c.note) mount.appendChild(el("div","room-note",c.note));
    },

    boardroom: function (c, mount) {
      var grid = el("div","room-grid");
      var caseCard = el("div","room-card amber");
      caseCard.appendChild(el("span","rc-tag amber","the numbers, honest"));
      caseCard.appendChild(el("h3",null,"The case so far"));
      c.numbers.forEach(function(n){ caseCard.appendChild(el("p",null,"— " + n)); });
      grid.appendChild(caseCard);
      var riskCard = el("div","room-card");
      riskCard.appendChild(el("span","rc-tag indigo","the risk answer"));
      riskCard.appendChild(el("h3",null,"How this stays safe"));
      c.risk.forEach(function(r){ riskCard.appendChild(el("p",null,"— " + r)); });
      grid.appendChild(riskCard);
      mount.appendChild(grid);

      var road = el("div","road");
      var rh = el("h2",null,c.roadmapTitle); rh.style.textAlign = "center"; rh.style.margin = "44px 0 6px";
      road.appendChild(rh);
      c.roadmap.forEach(function(s, i){
        var step = el("div","road-step" + (s.state === "done" ? " done" : s.state === "here" ? " here" : ""));
        step.appendChild(el("span","num",String(i+1)));
        var body = el("div");
        var h = el("h3",null,s.name);
        if (s.state === "here") h.appendChild(el("span","you-are-here","YOU ARE HERE"));
        body.appendChild(h);
        body.appendChild(el("p",null,s.text));
        step.appendChild(body);
        road.appendChild(step);
      });
      mount.appendChild(road);
      if (c.ask) mount.appendChild(el("div","room-note",c.ask));
      if (c.reservedNote) mount.appendChild(el("div","room-note indigo",c.reservedNote));
    }
  };

  /* ---- boot ---- */
  function boot(content){
    var c = content[room];
    if (!c){ document.body.innerHTML = ""; window.location.replace("dialog-intelligence.html"); return; }
    document.title = c.h1 + " — Inside My AI Workflow";
    var eb = document.getElementById("heroEyebrow"), h1 = document.getElementById("heroH1"), ld = document.getElementById("heroLead");
    if (eb) eb.textContent = c.eyebrow;
    if (h1) h1.textContent = c.h1;
    if (ld) ld.textContent = c.lead;
    /* building nav */
    var navMount = document.getElementById("buildingNav");
    if (navMount){
      if (window.renderFloorplan){
        window.renderFloorplan(navMount, room);
      } else if (content.building){
        content.building.forEach(function(b){
          var a = el("a", b.href === (room + ".html") ? "here" : null, b.name);
          a.href = b.href;
          navMount.appendChild(a);
        });
      }
    }
    var mount = document.getElementById("roomMount");
    render[room](c, mount);
    /* Feynman's blue co-note — the second voice, appended to any room that carries one. */
    if (c.coNote){
      var cn = el("div","room-note blue");
      cn.appendChild(el("span","who","Ben's — Feynman"));
      cn.appendChild(document.createTextNode(c.coNote));
      mount.appendChild(cn);
    }
    document.getElementById("app").style.display = "block";
  }

  var remembered = null;
  try{ remembered = localStorage.getItem(STORAGE_KEY); }catch(e){}
  if (!remembered){ window.location.replace("dialog-intelligence.html"); return; }
  unlock(remembered).then(function(content){
    if (content) boot(content);
    else window.location.replace("dialog-intelligence.html");
  });
})();
