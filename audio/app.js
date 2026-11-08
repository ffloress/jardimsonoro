(function () {
  'use strict';
  var OWNER = 'nagualcode', TTL = 3600e3;
  var OSN = { mac: 'macOS', win: 'Windows', linux: 'Linux' };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- backdrop: gradient at the top, then one photograph per plug-in ---------- */
  /* [Experimento: desativada a exibição das fotos de background por seção/plugin]
  var stage = $('.stage'), grad = $('.layer.grad'), layers = {};
  function layerFor(sec) {
    var r = sec.dataset.repo;
    if (!layers[r]) {
      var d = document.createElement('div'); d.className = 'layer';
      stage.insertBefore(d, $('.tint', stage)); layers[r] = d;
    }
    if (!layers[r].style.backgroundImage) layers[r].style.backgroundImage = 'url("' + sec.dataset.bg + '")';
    return layers[r];
  }
  function show(sec) {
    var target = sec ? layerFor(sec) : grad;
    $$('.layer', stage).forEach(function (l) { l.classList.toggle('on', l === target); });
  }
  var plugs = $$('.plug');
  if ('IntersectionObserver' in window) {
    var active = null;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (en.isIntersecting) { active = en.target; show(active); }
        else if (en.target === active && en.boundingClientRect.top > 0) { active = null; show(null); }
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    plugs.forEach(function (s) { io.observe(s); });
    var calm = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { active = null; show(null); } }); }, { rootMargin: '-45% 0px -45% 0px' });
    $$('.menu, .about, .outro, .bottom').forEach(function (s) { calm.observe(s); });
    // warm the next photograph before it is needed
    var pre = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { layerFor(en.target); pre.unobserve(en.target); } }); }, { rootMargin: '60% 0px' });
    plugs.forEach(function (s) { pre.observe(s); });
  }
  */

  /* ---------- screen-filling words on the acid terms ---------- */
  var fb = $('#fixedBg'), box = $('.container', fb), cur = null;
  function words(el) {
    if (cur === el) return; cur = el;
    box.innerHTML = el.dataset.words.split('|').map(function (w) { var s = document.createElement('span'); s.textContent = w; return s.outerHTML; }).join('');
    fb.classList.add('show');
  }
  function hide() { cur = null; fb.classList.remove('show'); }
  $$('.loopCol[data-words]').forEach(function (el) {
    el.addEventListener('mouseenter', function () { words(el); });
    el.addEventListener('mouseleave', hide);
    el.addEventListener('focus', function () { words(el); });
    el.addEventListener('blur', hide);
    el.addEventListener('click', function (e) { e.stopPropagation(); if (cur === el) hide(); else words(el); });
  });
  document.addEventListener('click', hide);
  document.addEventListener('touchmove', hide, { passive: true });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') hide(); });


  /* ---------- audio demos: one shared player, waveform scrubbing ---------- */
  (function () {
    var demos = $$('.demo'); if (!demos.length) return;
    var audio = new Audio(); audio.preload = 'none';
    var cur = null, raf = 0;
    function paint() {
      if (!cur) return;
      var p = audio.duration ? audio.currentTime / audio.duration : 0;
      var w = $('.wave', cur);
      $('.prog', w).style.width = (p * 100) + '%';
      w.setAttribute('aria-valuenow', Math.round(p * 100));
      var t = $('.time', cur), s = Math.floor(audio.currentTime);
      if (t && !audio.paused) t.textContent = Math.floor(s / 60) + ':' + ('0' + s % 60).slice(-2);
      if (!audio.paused) raf = requestAnimationFrame(paint);
    }
    function sizeProg(d) { var w = $('.wave', d); $('.prog svg', d).style.setProperty('--w', w.clientWidth + 'px'); }
    function select(d) {
      if (cur === d) return;
      if (cur) { cur.classList.remove('on'); $('.prog', cur).style.width = '0'; }
      cur = d; audio.src = d.dataset.src; sizeProg(d);
    }
    function toggle(d) {
      select(d);
      if (audio.paused) { var pr = audio.play(); if (pr && pr.catch) pr.catch(function () {}); } else audio.pause();
    }
    audio.addEventListener('play', function () { if (cur) cur.classList.add('on'); cancelAnimationFrame(raf); paint(); });
    audio.addEventListener('pause', function () { if (cur) cur.classList.remove('on'); });
    audio.addEventListener('ended', function () { if (cur) { cur.classList.remove('on'); $('.prog', cur).style.width = '0'; } });
    function seek(d, x) {
      select(d);
      var go = function () { audio.currentTime = x * audio.duration; paint(); };
      if (audio.duration) go(); else audio.addEventListener('loadedmetadata', go, { once: true });
      if (audio.paused) { var pr = audio.play(); if (pr && pr.catch) pr.catch(function () {}); }
    }
    demos.forEach(function (d) {
      $('.play', d).addEventListener('click', function (e) { e.stopPropagation(); toggle(d); });
      var w = $('.wave', d);
      w.addEventListener('click', function (e) { e.stopPropagation(); var r = w.getBoundingClientRect(); seek(d, Math.min(Math.max((e.clientX - r.left) / r.width, 0), 1)); });
      w.addEventListener('keydown', function (e) {
        if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(d); }
        if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && cur === d && audio.duration) { audio.currentTime += e.key === 'ArrowRight' ? 3 : -3; paint(); }
      });
    });
    addEventListener('resize', function () { if (cur) sizeProg(cur); });
  })();


  /* ---------- interface screenshots: full-screen view ---------- */
  (function () {
    var box = $('#lightbox'); if (!box || !box.showModal) return;
    var img = $('img', box);
    $$('.zoom').forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.stopPropagation();
        img.src = b.dataset.full; img.alt = $('img', b).alt;
        box.showModal();
      });
    });
    box.addEventListener('click', function () { box.close(); });
    box.addEventListener('close', function () { img.removeAttribute('src'); });
  })();

  /* ---------- downloads for the visitor's system ---------- */
  function detect() {
    var ua = navigator.userAgent || '', p = ((navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || '').toLowerCase();
    if (/win/.test(p) || /Windows/.test(ua)) return 'win';
    if (/linux|x11|cros/.test(p) || (/Linux/.test(ua) && !/Android/.test(ua))) return 'linux';
    return 'mac';
  }
  var OS = detect(), REL = {};
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
  function group(d) {
    var g = { mac: [], win: [], linux: [] };
    d.assets.forEach(function (a) { var o = osOf(a.n); if (o) g[o].push(a); });
    Object.keys(g).forEach(function (o) { g[o].sort(function (a, b) { return rank(a.n) - rank(b.n); }); });
    return g;
  }
  function load(repo) {
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
  function paint(sec) {
    var d = REL[sec.dataset.repo];
    if (!d) return;
    var g = group(d);
    $$('.get .dl', sec).forEach(function (a) {
      var list = g[a.dataset.os];
      if (list.length) { a.href = list[0].u; a.title = d.tag + ' · ' + kind(list[0].n); a.classList.remove('na'); }
      else { a.href = d.url; a.title = 'No ' + OSN[a.dataset.os] + ' build in ' + d.tag; a.classList.add('na'); }
    });
    var v = $('[data-ver]', sec);
    if (v) v.textContent = d.tag + (d.date ? ' · released ' + new Date(d.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '');
  }
  plugs.forEach(paint);

  function fetchFor(sec) {
    var r = sec.dataset.repo; if (REL[r] || sec._loading) return; sec._loading = true;
    load(r).then(function (d) { REL[r] = d; paint(sec); }).catch(function () {});
  }
  if ('IntersectionObserver' in window) {
    var near = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { fetchFor(en.target); near.unobserve(en.target); } }); }, { rootMargin: '150% 0px' });
    plugs.forEach(function (s) { near.observe(s); });
  } else plugs.forEach(fetchFor);
})();
