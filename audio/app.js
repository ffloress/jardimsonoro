(function () {
  'use strict';
  var OWNER = 'nagualcode', TTL = 3600e3, BASE = '/audio/';
  var OSN = { mac: 'macOS', win: 'Windows', linux: 'Linux' };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- screen-filling words on the acid terms ---------- */
  var fb = $('#fixedBg'), box = $('.container', fb), curWord = null;
  function words(el) {
    if (curWord === el) return; curWord = el;
    box.innerHTML = el.dataset.words.split('|').map(function (w) { var s = document.createElement('span'); s.textContent = w; return s.outerHTML; }).join('');
    fb.classList.add('show');
  }
  function hideWords() { curWord = null; fb.classList.remove('show'); }
  document.addEventListener('click', hideWords);
  document.addEventListener('touchmove', hideWords, { passive: true });

  /* ---------- audio demos: one shared player, waveform scrubbing ---------- */
  var audio = new Audio(); audio.preload = 'none';
  var curDemo = null, raf = 0;
  function paintDemo() {
    if (!curDemo) return;
    var p = audio.duration ? audio.currentTime / audio.duration : 0;
    var w = $('.wave', curDemo);
    $('.prog', w).style.width = (p * 100) + '%';
    w.setAttribute('aria-valuenow', Math.round(p * 100));
    var t = $('.time', curDemo), s = Math.floor(audio.currentTime);
    if (t && !audio.paused) t.textContent = Math.floor(s / 60) + ':' + ('0' + s % 60).slice(-2);
    if (!audio.paused) raf = requestAnimationFrame(paintDemo);
  }
  function sizeProg(d) { var w = $('.wave', d); $('.prog svg', d).style.setProperty('--w', w.clientWidth + 'px'); }
  function selectDemo(d) {
    if (curDemo === d) return;
    if (curDemo) { curDemo.classList.remove('on'); $('.prog', curDemo).style.width = '0'; }
    curDemo = d; audio.src = d.dataset.src; sizeProg(d);
  }
  function playPause(d) {
    selectDemo(d);
    if (audio.paused) { var pr = audio.play(); if (pr && pr.catch) pr.catch(function () {}); } else audio.pause();
  }
  audio.addEventListener('play', function () { if (curDemo) curDemo.classList.add('on'); cancelAnimationFrame(raf); paintDemo(); });
  audio.addEventListener('pause', function () { if (curDemo) curDemo.classList.remove('on'); });
  audio.addEventListener('ended', function () { if (curDemo) { curDemo.classList.remove('on'); $('.prog', curDemo).style.width = '0'; } });
  addEventListener('resize', function () { if (curDemo) sizeProg(curDemo); });
  function seek(d, x) {
    selectDemo(d);
    var go = function () { audio.currentTime = x * audio.duration; paintDemo(); };
    if (audio.duration) go(); else audio.addEventListener('loadedmetadata', go, { once: true });
    if (audio.paused) { var pr = audio.play(); if (pr && pr.catch) pr.catch(function () {}); }
  }

  /* ---------- interface screenshots: full-screen view ---------- */
  var lightbox = $('#lightbox'), lbImg = lightbox && $('img', lightbox);
  if (lightbox) {
    lightbox.addEventListener('click', function () { lightbox.close(); });
    lightbox.addEventListener('close', function () { lbImg.removeAttribute('src'); });
  }

  /* ---------- downloads for the visitor's system ---------- */
  var REL = {};
  function osOf(n) {
    n = n.toLowerCase();
    if (/sha256|checksum|\.txt$|\.sig$|\.asc$/.test(n)) return null;
    if (/mac|darwin|osx|apple/.test(n)) return 'mac';
    if (/win/.test(n)) return 'win';
    if (/linux/.test(n)) return 'linux';
    return null;
  }
  function rank(n) { n = n.toLowerCase(); return /\.(pkg|dmg|exe|msi)$/.test(n) ? 0 : /\.zip$/.test(n) ? 1 : /\.(tar\.gz|tgz)$/.test(n) ? 2 : 3; }
  function kind(n) {
    var l = n.toLowerCase(), f = (l.match(/[-_](au|vst3|clap)[-_]/) || [])[1];
    var x = /\.(pkg|exe)$/.test(l) ? 'installer' : /\.dmg$/.test(l) ? '.dmg' : /\.(tar\.gz|tgz)$/.test(l) ? '.tar.gz' : /\.zip$/.test(l) ? '.zip' : 'file';
    return (f ? f.toUpperCase() + ' ' : '') + x;
  }
  /* Bundle repos (nautilus3000, rocketscience3000) carry one installer per plug-in:
     data-asset="riverrun" keeps riverrun-* files, plus the bundle zip as a fallback. */
  function group(d, asset, repo) {
    var g = { mac: [], win: [], linux: [] };
    d.assets.forEach(function (a) {
      var n = a.n.toLowerCase();
      if (asset && n.indexOf(asset + '-') !== 0 && n.indexOf(repo + '-') !== 0) return;
      var o = osOf(a.n); if (o) g[o].push(a);
    });
    var own = function (a) { return asset && a.n.toLowerCase().indexOf(asset + '-') === 0 ? 0 : 1; };
    Object.keys(g).forEach(function (o) { g[o].sort(function (a, b) { return own(a) - own(b) || rank(a.n) - rank(b.n); }); });
    return g;
  }
  function loadRelease(repo) {
    var key = 'js-audio-rel2:' + repo, c = null;
    try { c = JSON.parse(store.get(key)); } catch (e) {}
    if (c && Date.now() - c.t < TTL) return Promise.resolve(c.d);
    return fetch('https://api.github.com/repos/' + OWNER + '/' + repo + '/releases/latest', { headers: { Accept: 'application/vnd.github+json' } })
      .then(function (r) { if (!r.ok) throw r.status; return r.json(); })
      .then(function (j) {
        var d = { tag: j.tag_name, url: j.html_url, date: j.published_at, assets: (j.assets || []).map(function (a) { return { n: a.name, u: a.browser_download_url }; }) };
        store.set(key, JSON.stringify({ t: Date.now(), d: d })); return d;
      })
      .catch(function (e) { if (c) return c.d; throw e; });
  }
  function paintRelease(plug) {
    var d = REL[plug.dataset.repo];
    if (!d) return;
    var g = group(d, plug.dataset.asset, plug.dataset.repo);
    $$('.get .dl', plug).forEach(function (a) {
      var list = g[a.dataset.os];
      if (list.length) { a.href = list[0].u; a.title = d.tag + ' · ' + kind(list[0].n); a.classList.remove('na'); }
      else { a.href = d.url; a.title = 'No ' + OSN[a.dataset.os] + ' build in ' + d.tag; a.classList.add('na'); }
    });
    var v = $('[data-ver]', plug);
    if (v) v.textContent = d.tag + (d.date ? ' · released ' + new Date(d.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '');
  }
  function fetchRelease(plug) {
    var r = plug.dataset.repo;
    if (REL[r]) { paintRelease(plug); return; }
    loadRelease(r).then(function (d) { REL[r] = d; paintRelease(plug); }).catch(function () {});
  }

  /* ---------- wire a detail panel (on load, or after it is fetched) ---------- */
  function wire(plug) {
    var det = $('.detail', plug);
    if (!det || det.dataset.wired) return;
    det.dataset.wired = '1';
    $$('.loopCol[data-words]', det).forEach(function (el) {
      el.addEventListener('mouseenter', function () { words(el); });
      el.addEventListener('mouseleave', hideWords);
      el.addEventListener('click', function (e) { e.stopPropagation(); if (curWord === el) hideWords(); else words(el); });
    });
    $$('.demo', det).forEach(function (d) {
      $('.play', d).addEventListener('click', function (e) { e.stopPropagation(); playPause(d); });
      var w = $('.wave', d);
      w.addEventListener('click', function (e) { e.stopPropagation(); var r = w.getBoundingClientRect(); seek(d, Math.min(Math.max((e.clientX - r.left) / r.width, 0), 1)); });
      w.addEventListener('keydown', function (e) {
        if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); playPause(d); }
        if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && curDemo === d && audio.duration) { audio.currentTime += e.key === 'ArrowRight' ? 3 : -3; paintDemo(); }
      });
    });
    if (lightbox && lightbox.showModal) {
      $$('.zoom', det).forEach(function (b) {
        b.addEventListener('click', function (e) {
          e.stopPropagation();
          lbImg.src = b.dataset.full; lbImg.alt = $('img', b).alt;
          lightbox.showModal();
        });
      });
    }
    var close = $('.close', det);
    if (close) close.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
      e.preventDefault(); closeAll(true);
    });
    fetchRelease(plug);
  }

  /* ---------- the grid: one plug-in opens in place, with its own URL ---------- */
  var plugs = $$('.plug'), byId = {};
  plugs.forEach(function (p) { byId[p.id] = p; });
  var grid = $('#plugins');
  var indexTitle = grid.dataset.title || document.title, indexDesc = grid.dataset.desc;
  var pages = {};
  function fetchPage(id) {
    if (!pages[id]) {
      pages[id] = fetch(BASE + id + '/', { credentials: 'same-origin' })
        .then(function (r) { if (!r.ok) throw r.status; return r.text(); })
        .then(function (t) { return new DOMParser().parseFromString(t, 'text/html'); });
      pages[id].catch(function () { delete pages[id]; });
    }
    return pages[id];
  }
  function setMeta(title, desc) {
    document.title = title;
    var m = $('meta[name="description"]'); if (m && desc) m.content = desc;
    var c = $('link[rel="canonical"]'); if (c) c.href = location.href;
  }
  function closeAll(push) {
    plugs.forEach(function (p) {
      if (p.classList.contains('open')) {
        p.classList.remove('open');
        var a = $('.card', p); if (a) a.setAttribute('aria-expanded', 'false');
      }
    });
    document.body.classList.remove('has-open');
    if (push) history.pushState({ id: null }, '', BASE);
    setMeta(indexTitle, indexDesc);
  }
  function reveal(p) {
    p.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  }
  function open(id, push, scroll) {
    var p = byId[id]; if (!p) return;
    var ready = $('.detail', p) ? Promise.resolve(null) : fetchPage(id);
    p.classList.add('loading');
    ready.then(function (doc) {
      if (doc) {
        var det = doc.getElementById('d-' + id);
        if (!det) throw 'missing';
        p.appendChild(document.importNode(det, true));
        p.dataset.title = doc.title;
        var md = doc.querySelector('meta[name="description"]'); if (md) p.dataset.desc = md.content;
      }
      p.classList.remove('loading');
      plugs.forEach(function (q) {
        if (q !== p && q.classList.contains('open')) { q.classList.remove('open'); $('.card', q).setAttribute('aria-expanded', 'false'); }
      });
      p.hidden = false;
      p.classList.add('open');
      document.body.classList.add('has-open');
      $('.card', p).setAttribute('aria-expanded', 'true');
      wire(p);
      if (push) history.pushState({ id: id }, '', BASE + id + '/');
      setMeta(p.dataset.title || document.title, p.dataset.desc);
      if (scroll !== false) reveal(p);
    }).catch(function () { location.href = BASE + id + '/'; });
  }
  plugs.forEach(function (p) {
    var a = $('.card', p);
    a.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) return;
      e.preventDefault(); open(p.id, true);
    });
    // Warm the panel before the click lands.
    a.addEventListener('pointerenter', function () { if (!$('.detail', p)) fetchPage(p.id); }, { once: true });
    a.addEventListener('focus', function () { if (!$('.detail', p)) fetchPage(p.id); }, { once: true });
  });
  // The page this visit landed on (a plug-in's own URL arrives already open).
  var landed = $('.plug.open');
  if (landed) {
    landed.dataset.title = document.title;
    landed.dataset.desc = ($('meta[name="description"]') || {}).content;
    wire(landed);
    history.replaceState({ id: landed.id }, '', location.href);
    requestAnimationFrame(function () { reveal(landed); });
  } else {
    history.replaceState({ id: null }, '', location.href);
    // Old links: /audio/#tyrell80 → open it at its own address.
    var h = decodeURIComponent(location.hash.slice(1));
    if (byId[h]) { history.replaceState({ id: h }, '', BASE + h + '/'); open(h, false); }
  }
  addEventListener('popstate', function (e) {
    var id = e.state && e.state.id;
    if (!id) { var m = location.pathname.match(/\/audio\/([^\/]+)\/?$/); id = m && m[1]; }
    if (id && byId[id]) open(id, false); else closeAll(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    hideWords();
    if (document.body.classList.contains('has-open') && !(lightbox && lightbox.open)) closeAll(true);
  });

  /* ---------- filters ---------- */
  var chips = $$('.chip');
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      var cat = c.dataset.cat;
      chips.forEach(function (x) { var on = x === c; x.classList.toggle('on', on); x.setAttribute('aria-pressed', on ? 'true' : 'false'); });
      plugs.forEach(function (p) { p.hidden = !(cat === 'all' || p.dataset.cat === cat || p.classList.contains('open')); });
    });
  });
})();
