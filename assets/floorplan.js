/* The building, drawn as a plan.
   Shared navigation for the gated wing: an architectural floor-plan where each
   room is a clickable poché you press to walk into it. Not gated — it's just
   links — so it loads on every building page (Annex, Lobby, room stubs).

   Usage:  window.renderFloorplan(mountElement, currentKey)
   keys:   annex | lobby | studio | pinup | modelshop | library | boardroom

   No dependencies, no build step, ES5 — same house style as rooms.js. */
(function () {
  var ROOMS = [
    { key: "studio",    num: "02", name: "Studio Floor", href: "studio.html",              x: 30,  y: 42,  w: 196, h: 356, seats: "both" },
    { key: "boardroom", num: "06", name: "The Boardroom", href: "boardroom.html",          x: 238, y: 42,  w: 250, h: 150, seats: "both" },
    { key: "pinup",     num: "03", name: "Pin-up Wall",  href: "pinup.html",               x: 500, y: 42,  w: 200, h: 150 },
    { key: "lobby",     num: "01", name: "The Lobby",    href: "lobby.html",               x: 238, y: 204, w: 250, h: 120, seats: "both" },
    { key: "modelshop", num: "04", name: "Model Shop",   href: "modelshop.html",           x: 500, y: 204, w: 200, h: 95  },
    { key: "library",   num: "05", name: "The Library",  href: "library.html",             x: 500, y: 311, w: 200, h: 87  },
    { key: "annex",     num: "IN", name: "The Annex",    href: "dialog-intelligence.html", x: 238, y: 336, w: 250, h: 62,  entry: true }
  ];

  var STYLE_ID = "fp-style";
  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var s = document.createElement("style");
    s.id = STYLE_ID;
    s.textContent =
      ".fp-wrap{max-width:730px;margin:26px auto 0;padding:0 16px;}" +
      ".fp-svg{display:block;width:100%;height:auto;}" +
      ".fp-room{cursor:pointer;}" +
      ".fp-room .cell{fill:#fbfaf7;stroke:#2b2a27;stroke-width:2;transition:fill .15s,stroke .15s;}" +
      ".fp-room .rname{fill:#2b2a27;font-weight:700;font-size:14px;letter-spacing:.01em;}" +
      ".fp-room .rnum{fill:#b3aea2;font-weight:800;font-size:11px;letter-spacing:.12em;}" +
      ".fp-room:hover .cell{fill:#fff8ec;stroke:#b45309;}" +
      ".fp-room:hover .rname{fill:#b45309;}" +
      ".fp-room.here .cell{fill:#fff1d6;stroke:#f59e0b;stroke-width:3;}" +
      ".fp-room.here .rname{fill:#b45309;}" +
      ".fp-room.entry .cell{fill:#f6f7ff;stroke-dasharray:5 4;}" +
      ".fp-room.entry.here .cell{fill:#fff1d6;stroke-dasharray:0;}" +
      ".fp-env{fill:none;stroke:#2b2a27;stroke-width:3.5;}" +
      ".fp-door{stroke:#2b2a27;stroke-width:1.4;fill:none;}" +
      ".fp-doorgap{stroke:#fbfaf7;stroke-width:4;}" +
      ".fp-here-tag{fill:#f59e0b;}" +
      ".fp-here-tag text{fill:#fff;font-size:10px;font-weight:800;letter-spacing:.1em;}" +
      ".fp-meta{fill:#8a8579;font-size:10.5px;font-weight:700;letter-spacing:.14em;}" +
      ".fp-n{fill:#8a8579;font-size:11px;font-weight:800;}" +
      ".fp-links{margin:12px auto 0;display:flex;gap:4px;flex-wrap:wrap;justify-content:center;}" +
      ".fp-links a{font-size:.72rem;font-weight:700;letter-spacing:.04em;padding:5px 10px;border-radius:20px;border:1px solid var(--line,#e7e4dd);color:#8a8579;text-decoration:none;}" +
      ".fp-links a:hover{border-color:#f59e0b;color:#b45309;}" +
      ".fp-links a.here{background:#fff1d6;color:#b45309;border-color:#f5c96b;}" +
      "@media(max-width:520px){.fp-room .rname{font-size:16px;}.fp-room .rnum{font-size:13px;}}";
    document.head.appendChild(s);
  }

  function esc(t){ return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }

  function roomSVG(r, current) {
    var here = r.key === current;
    var cls = "fp-room" + (r.entry ? " entry" : "") + (here ? " here" : "");
    var cx = r.x + r.w / 2;
    var g = '<a href="' + r.href + '" class="' + cls + '">';
    g += '<title>' + esc(r.name) + (here ? " — you are here" : "") + '</title>';
    g += '<rect class="cell" x="' + r.x + '" y="' + r.y + '" width="' + r.w + '" height="' + r.h + '" rx="2"/>';
    g += '<text class="rnum" x="' + (r.x + 12) + '" y="' + (r.y + 22) + '">' + esc(r.num) + '</text>';
    // room name (centered)
    var ny = r.y + r.h / 2 + (r.seats ? -2 : 5);
    g += '<text class="rname" x="' + cx + '" y="' + ny + '" text-anchor="middle">' + esc(r.name) + '</text>';
    // two-seat dots: amber (Shadi) + Cherenkov blue (Feynman)
    if (r.seats === "both") {
      var dy = ny + 18;
      g += '<circle cx="' + (cx - 8) + '" cy="' + dy + '" r="4.5" fill="#f59e0b"/>';
      g += '<circle cx="' + (cx + 8) + '" cy="' + dy + '" r="4.5" fill="#3fc6ff"/>';
    }
    // "you are here" tag for the current room
    if (here) {
      var tagW = 78, tagX = cx - tagW / 2, tagY = r.y + r.h - 22;
      g += '<g class="fp-here-tag"><rect x="' + tagX + '" y="' + tagY + '" width="' + tagW + '" height="15" rx="3"/>' +
           '<text x="' + cx + '" y="' + (tagY + 11) + '" text-anchor="middle">YOU ARE HERE</text></g>';
    }
    g += '</a>';
    return g;
  }

  function build(current) {
    var svg = '<svg class="fp-svg" viewBox="0 0 730 452" role="img" aria-label="Floor plan of the gated wing" xmlns="http://www.w3.org/2000/svg">';
    // building envelope
    svg += '<rect class="fp-env" x="18" y="30" width="694" height="380" rx="3"/>';
    // rooms
    for (var i = 0; i < ROOMS.length; i++) svg += roomSVG(ROOMS[i], current);
    // a couple of architectural doors (swing arcs) at the entry sequence
    // way in, through the bottom wall under the Annex
    svg += '<line class="fp-doorgap" x1="345" y1="410" x2="381" y2="410"/>';
    svg += '<path class="fp-door" d="M345 410 A36 36 0 0 1 381 410"/>';
    svg += '<line class="fp-door" x1="345" y1="410" x2="345" y2="410"/>';
    // Annex -> Lobby door
    svg += '<line class="fp-doorgap" x1="345" y1="336" x2="381" y2="336"/>';
    svg += '<path class="fp-door" d="M345 336 A34 34 0 0 0 345 302"/>';
    // north arrow (top-right, outside envelope)
    svg += '<g transform="translate(690,20)"><line class="fp-door" x1="0" y1="14" x2="0" y2="-6"/>' +
           '<path d="M0 -10 L4 0 L-4 0 Z" fill="#2b2a27"/><text class="fp-n" x="0" y="26" text-anchor="middle">N</text></g>';
    // title block
    svg += '<text class="fp-meta" x="20" y="436">INSIDE MY AI WORKFLOW &#183; THE GATED WING</text>';
    svg += '<text class="fp-meta" x="710" y="436" text-anchor="end">FLOOR PLAN &#183; N.T.S. &#183; v2026-07-07.1</text>';
    svg += '</svg>';
    return svg;
  }

  function links(current) {
    var h = '<div class="fp-links">';
    for (var i = 0; i < ROOMS.length; i++) {
      var r = ROOMS[i];
      h += '<a href="' + r.href + '"' + (r.key === current ? ' class="here"' : '') + '>' + esc(r.name) + '</a>';
    }
    return h + '</div>';
  }

  window.renderFloorplan = function (mount, current) {
    if (!mount) return;
    injectStyle();
    mount.className = (mount.className ? mount.className + " " : "") + "fp-wrap";
    mount.innerHTML = build(current) + links(current);
  };
})();
