/* The narrator v2 — a site-wide experience layer.
   Each page defines window.NARRATOR = {
     page, lines:[...], idle, scrollLine, poke, blur, revisit,   // hero monologue + reactions
     asides:[{h:'heading text match', t:'aside text'}, ...]      // typed margin-companion asides
   } before including this file. Pages with no `lines` (the home page has its own
   bespoke intro) still get reveal-on-scroll and asides. */
(function () {
  var cfg = window.NARRATOR || {};
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- injected style ---- */
  var css = document.createElement('style');
  css.textContent =
    '.nar-box{max-width:640px;margin:18px 0 0;min-height:52px;cursor:default;}' +
    '.nar-line{font-size:15.5px;line-height:1.6;color:#4a4844;margin:0 0 8px;opacity:0;transform:translateY(4px);transition:opacity .35s,transform .35s;}' +
    '.nar-line.on{opacity:1;transform:none;}' +
    '.nar-line.nar-aside{color:#8a8579;font-style:italic;font-size:14px;}' +
    '.nar-caret{display:inline-block;width:8px;height:1.05em;background:rgb(94,158,149);vertical-align:-2px;margin-left:2px;animation:narBlink 1s steps(1) infinite;}' +
    '@keyframes narBlink{50%{opacity:0;}}' +
    /* margin-companion asides */
    '.nar-pop{max-width:620px;margin:14px 0 22px;padding:11px 16px;border-left:3px solid rgb(94,158,149);background:rgba(94,158,149,.07);border-radius:0 12px 12px 0;font-size:14px;font-style:italic;color:#5d5a52;line-height:1.6;min-height:24px;opacity:0;transform:translateX(-6px);transition:opacity .4s,transform .4s;}' +
    '.nar-pop.on{opacity:1;transform:none;}' +
    /* reveal-on-scroll */
    '.rvl{opacity:0;transform:translateY(14px);transition:opacity .55s ease,transform .55s ease;}' +
    '.rvl.rvl-on{opacity:1;transform:none;}' +
    '@media (prefers-reduced-motion: reduce){.nar-line,.nar-pop,.rvl{transition:none;opacity:1;transform:none;}.nar-caret{animation:none;}}';
  document.head.appendChild(css);

  /* ---- shared typing helper ---- */
  function typeInto(el, txt, cb) {
    if (reduced) { el.textContent = txt; if (cb) cb(); return; }
    var caret = document.createElement('span'); caret.className = 'nar-caret'; el.appendChild(caret);
    var i = 0;
    (function tick() {
      if (el.__finish) { el.textContent = txt; if (cb) cb(); return; }
      if (i < txt.length) {
        el.insertBefore(document.createTextNode(txt.charAt(i)), caret); i++;
        setTimeout(tick, txt.charAt(i - 1) === '.' ? 80 : 16);
      } else { caret.remove(); if (cb) setTimeout(cb, 420); }
    })();
  }

  /* ============ PART 1: hero monologue + reactions (pages with `lines`) ============ */
  if (cfg.lines && cfg.lines.length) (function () {
    var mount = document.querySelector('.hero .container') || document.querySelector('.hero');
    if (!mount) return;
    var box = document.createElement('div');
    box.className = 'nar-box'; box.setAttribute('aria-live', 'polite');
    mount.appendChild(box);

    var visited = {};
    try { visited = JSON.parse(localStorage.getItem('wf-pages') || '{}'); } catch (e) {}
    var revisit = !!visited[cfg.page];
    var distinct = Object.keys(visited).length;
    visited[cfg.page] = (visited[cfg.page] || 0) + 1;
    try { localStorage.setItem('wf-pages', JSON.stringify(visited)); } catch (e) {}

    var lines = revisit
      ? [{ t: cfg.revisit || 'Back again. Everything is where you left it. I counted.' }]
      : cfg.lines.map(function (l) { return typeof l === 'string' ? { t: l } : l; });
    if (!revisit && distinct + 1 >= 3) {
      lines.push({ t: (distinct + 1) + ' pages in one sitting. You’re binging me. No notes — continue.', aside: true });
    }

    var idx = 0, finished = false, interjected = {};
    function addLine(txt, aside, instant, cb) {
      var p = document.createElement('p');
      p.className = 'nar-line' + (aside ? ' nar-aside' : '');
      box.appendChild(p);
      while (box.querySelectorAll('.nar-line').length > 4) box.querySelector('.nar-line').remove();
      requestAnimationFrame(function () { p.classList.add('on'); });
      if (instant || reduced) { p.textContent = txt; if (cb) setTimeout(cb, reduced ? 50 : 0); return; }
      if (finished) { p.textContent = txt; if (cb) cb(); return; }
      typeInto(p, txt, cb);
    }
    function next() {
      if (idx >= lines.length) { finished = true; return; }
      var l = lines[idx++]; addLine(l.t, l.aside, false, next);
    }
    function interject(key, txt) {
      if (!txt || interjected[key]) return;
      interjected[key] = true;
      addLine(txt, true, true, null);
    }
    var baseTitle = document.title;
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { document.title = 'Hey. Come back.'; }
      else { document.title = baseTitle; interject('blur', cfg.blur || 'You left. I noticed. Anyway—'); }
    });
    var idleTimer = setTimeout(function () { interject('idle', cfg.idle); }, 14000);
    ['mousemove', 'touchstart', 'keydown'].forEach(function (ev) {
      window.addEventListener(ev, function () { clearTimeout(idleTimer); }, { once: true, passive: true });
    });
    if (cfg.scrollLine) {
      window.addEventListener('scroll', function () {
        if (!finished) interject('scroll', cfg.scrollLine);
      }, { once: true, passive: true });
    }
    box.addEventListener('click', function () {
      if (!finished) {
        box.querySelectorAll('.nar-line').forEach(function (n) { n.__finish = true; });
        finished = true; return;
      }
      interject('poke', cfg.poke);
    });
    setTimeout(next, reduced ? 0 : 350);
  })();

  /* ============ PART 2: reveal-on-scroll (every page) ============ */
  (function () {
    if (reduced || !('IntersectionObserver' in window)) return;
    var els = document.querySelectorAll('.card,.step,.callout,.project,.arch-box,.diagram-step,.glossary-term,.skill-card,.table-wrap,.stat-tile,.prompt-block,.json-block');
    if (!els.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('rvl-on'); io.unobserve(en.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -4% 0px' });
    els.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight) return;      // already visible — don't hide it
      el.classList.add('rvl'); io.observe(el);
    });
  })();

  /* ============ PART 3: margin-companion asides (the narrator walks with you) ============ */
  (function () {
    var asides = cfg.asides;
    if (!asides || !asides.length) return;
    function findTarget(a) {
      if (a.sel) return document.querySelector(a.sel);
      if (!a.h) return null;
      var hs = document.querySelectorAll('h2,h3');
      var needle = a.h.toLowerCase();
      for (var i = 0; i < hs.length; i++) {
        if ((hs[i].textContent || '').toLowerCase().indexOf(needle) !== -1) return hs[i];
      }
      return null;
    }
    var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        var pop = en.target;
        pop.classList.add('on');
        typeInto(pop, pop.__text, null);
      });
    }, { threshold: 0.9 }) : null;
    asides.forEach(function (a) {
      var t = findTarget(a);
      if (!t) return;
      var pop = document.createElement('div');
      pop.className = 'nar-pop'; pop.__text = a.t;
      pop.addEventListener('click', function () { pop.__finish = true; });
      t.insertAdjacentElement('afterend', pop);
      if (io) io.observe(pop);
      else { pop.classList.add('on'); pop.textContent = a.t; }
    });
  })();
})();
