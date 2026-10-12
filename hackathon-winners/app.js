(() => {
  const H = window.HACKS, M = window.META;
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const money = n => '$' + (n >= 1e6 ? (n / 1e6).toFixed(n % 1e6 ? 2 : 0) + 'M' : n >= 1e4 ? Math.round(n / 1e3) + 'K' : n.toLocaleString());
  const local = h => h.cur === '$' ? '' : ` (${h.cur}${h.amt_local.toLocaleString()})`;
  let saved = new Set();
  try { saved = new Set(JSON.parse(localStorage.getItem('hk-saved') || '[]')); } catch {}
  const state = { saved: false, q: '', deploy: 'all', cat: '', fmt: '', year: '', sort: 'usd-desc', view: 'hackathons', wsort: ['usd', -1] };

  // header
  const allW = H.flatMap(h => h.winners.map(w => ({ ...w, h })));
  $('#lede').textContent = M.lede;
  $('#asof').textContent = M.asof;
  const nDeploy = H.filter(h => h.deploy === 'deploy').length;
  $('#stats').innerHTML = [
    [H.length, 'hackathons analysed'],
    [money(H.reduce((a, h) => a + h.usd, 0)), 'combined prize pools'],
    [allW.length, 'winning projects analysed'],
    [allW.filter(w => w.vnote).length, 'demo videos transcribed'],
    [`${nDeploy} / ${H.length - nDeploy}`, 'must-deploy / submit-only'],
  ].map(([b, s]) => `<div class="stat"><b>${b}</b><span>${s}</span></div>`).join('');
  [...new Set(H.flatMap(h => h.cats))].sort().forEach(c => $('#cat').insertAdjacentHTML('beforeend', `<option>${esc(c)}</option>`));
  $('#view-playbook').innerHTML = M.playbook;
  $('#view-method').innerHTML = M.method;

  // filtering
  const hay = h => (h._hay ??= [h.title, h.org, h.pattern, h.cats.join(' '), h.criteria.map(c => c.n + ' ' + c.d).join(' '),
    h.winners.map(w => [w.t, w.tag, w.why, w.built.join(' '), w.prizes.join(' ')].join(' ')).join(' ')].join(' ').toLowerCase());
  const filtered = () => {
    const q = state.q.toLowerCase().trim();
    return H.filter(h => (state.deploy === 'all' || h.deploy === state.deploy) && (!state.cat || h.cats.includes(state.cat)) &&
      (!state.fmt || h.format === state.fmt) && (!state.year || String(h.year) === state.year) && (!q || hay(h).includes(q)) && (!state.saved || saved.has(h.id)));
  };
  const sorters = {
    'usd-desc': (a, b) => b.usd - a.usd, 'usd-asc': (a, b) => a.usd - b.usd,
    'date-desc': (a, b) => b.end.localeCompare(a.end), 'date-asc': (a, b) => a.end.localeCompare(b.end),
    'regs-desc': (a, b) => b.regs - a.regs, 'win-desc': (a, b) => b.winners.length - a.winners.length,
    'name-asc': (a, b) => a.title.localeCompare(b.title),
  };
  const badge = h => `<span class="badge ${h.deploy}">${h.deploy === 'deploy' ? 'Must deploy' : 'Submit-only'}</span>`;

  // media helpers
  const ytId = u => (u || '').match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/)?.[1];
  const vimeoId = u => (u || '').match(/vimeo\.com\/(?:video\/)?(\d+)/)?.[1];
  const ytThumb = id => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  const cover = h => {
    const w = h.winners[0];
    return w?.shots[0]?.t || (ytId(w?.video) && ytThumb(ytId(w.video))) || h.thumb || '';
  };
  const videoBlock = (w, hi, wi) => {
    const yt = ytId(w.video), vm = vimeoId(w.video);
    if (!yt && !vm) return '';
    const poster = yt ? ytThumb(yt) : w.shots[0]?.t;
    return `<button class="vthumb" data-play="${yt ? 'yt:' + yt : 'vm:' + vm}" aria-label="Play demo video: ${esc(w.t)}">
      ${poster ? `<img loading="lazy" src="${esc(poster)}" alt="">` : ''}<span class="play" aria-hidden="true">▶</span><span class="vlabel">${yt ? 'YouTube' : 'Vimeo'} demo</span></button>`;
  };
  const shotStrip = (w, hid, wi) => w.shots.length ? `<div class="shots">${w.shots.slice(0, 4).map((s, si) =>
    `<button class="shot" data-lb="${hid}|${wi}|${si}" aria-label="Open screenshot ${si + 1} of ${w.shots.length}"><img loading="lazy" src="${esc(s.t)}" alt="${esc(s.c || w.t + ' screenshot ' + (si + 1))}" onerror="this.parentNode.remove()"></button>`).join('')}${w.shots.length > 1 ? `<button class="all-photos" data-lb="${hid}|${wi}|0">Show all ${w.shots.length} photos</button>` : ''}</div>` : '';

  const heart = id => `<button class="heart ${saved.has(id) ? 'on' : ''}" data-save="${id}" aria-pressed="${saved.has(id)}" aria-label="Save hackathon">
    <svg viewBox="0 0 32 32" width="24" height="24" aria-hidden="true"><path d="M16 28c7-4.7 14-10 14-17a7 7 0 0 0-14-2.6A7 7 0 0 0 2 11c0 7 7 12.3 14 17Z"/></svg></button>`;
  function renderGrid(list) {
    $('#grid').innerHTML = list.length ? list.map(h => {
      const w = h.winners[0], img = cover(h);
      return `<article class="card" data-id="${h.id}" role="button" tabindex="0" aria-label="${esc(h.title)}, ${money(h.usd)} prize pool">
        <div class="card-img">
          ${img ? `<img loading="lazy" src="${esc(img)}" alt="" onerror="this.remove()">` : ''}
          <span class="fav">${h.deploy === 'deploy' ? 'Must deploy' : 'Submit-only'}</span>
          ${heart(h.id)}
        </div>
        <div class="card-row"><h3>${esc(h.title)}</h3></div>
        <p class="card-meta">${esc(h.org)} · ${h.format === 'online' ? 'Online' : 'In-person'}</p>
        <p class="card-meta">${esc(h.dates)} · ${h.regs.toLocaleString()} registered</p>
        <p class="card-price"><b>${money(h.usd)}</b> prize pool${w ? ` · <span class="card-top">★ ${esc(w.t)}</span>` : ''}</p>
      </article>`;
    }).join('') : `<p class="empty">${state.saved ? 'No saved hackathons yet. Tap the heart on any card.' : 'No hackathons match these filters.'}</p>`;
  }

  function renderWinners(list) {
    const ids = new Set(list.map(h => h.id)), q = state.q.toLowerCase().trim();
    let rows = allW.filter(w => ids.has(w.h.id) && (!q || [w.t, w.tag, w.why, w.built.join(' '), w.h.title].join(' ').toLowerCase().includes(q)));
    const [k, dir] = state.wsort;
    const val = { title: w => w.t.toLowerCase(), hack: w => w.h.title.toLowerCase(), prize: w => (w.prizes[0] || '').toLowerCase(), usd: w => w.h.usd };
    rows.sort((a, b) => { const x = val[k](a), y = val[k](b); return (x > y ? 1 : x < y ? -1 : b.h.usd - a.h.usd) * dir; });
    $('#wbody').innerHTML = rows.map(w => `<tr>
      <td class="pcell">${w.shots[0] || ytId(w.video) ? `<img class="tthumb" loading="lazy" src="${esc(w.shots[0]?.t || ytThumb(ytId(w.video)))}" alt="" onerror="this.remove()">` : ''}<div><b>${esc(w.t)}</b><div class="org">${esc(w.tag)}</div></div></td>
      <td><a href="#h${w.h.id}" data-open="${w.h.id}">${esc(w.h.title)}</a> ${badge(w.h)}</td>
      <td>${w.prizes.map(esc).join('<br>')}</td>
      <td class="num">${money(w.h.usd)}</td>
      <td>${esc(w.why)}</td>
      <td>${linkList(w)}</td></tr>`).join('');
    $('#count').textContent = `${rows.length} winners`;
  }

  const linkList = w => [`<a href="${esc(w.u)}" target="_blank" rel="noopener">Devpost</a>`,
    w.video && `<a href="${esc(w.video)}" target="_blank" rel="noopener">Video</a>`,
    ...w.links.slice(0, 3).map(l => `<a href="${esc(l)}" target="_blank" rel="noopener">${esc(new URL(l, 'https://x').hostname.replace('www.', ''))}</a>`)
  ].filter(Boolean).join(' ');

  function render() {
    const list = filtered().sort(sorters[state.sort]);
    if (state.view === 'hackathons') { renderGrid(list); $('#count').textContent = `${list.length} of ${H.length} hackathons`; }
    if (state.view === 'winners') renderWinners(list);
  }

  // detail dialog
  const dlg = $('#dlg');
  function open(id) {
    const h = H.find(x => String(x.id) === String(id));
    if (!h) return;
    $('#dlgMeta').innerHTML = `${money(h.usd)}${esc(local(h))} · ${esc(h.dates)} · ${h.regs.toLocaleString()} registered · ${h.format}`;
    $('#dlgTitle').innerHTML = `<a href="${esc(h.url)}" target="_blank" rel="noopener">${esc(h.title)}</a>`;
    $('#dlgBody').innerHTML = `
      <div class="chips">${badge(h)}${h.cats.map(c => `<span class="chip">${esc(c)}</span>`).join('')}</div>
      <p class="org" style="margin-top:8px">${esc(h.deploy_why)}</p>
      <h4>Why winners won here</h4>
      <p class="callout">${esc(h.pattern)}</p>
      <h4>Judging criteria</h4>
      ${h.criteria.length ? `<div class="crit">${h.criteria.map(c => `<div><b>${esc(c.n)}</b>${esc(c.d)}</div>`).join('')}</div>` : '<p class="org">Not published on Devpost.</p>'}
      ${h.req ? `<details><summary>Submission requirements</summary><div class="req">${esc(h.req)}</div></details>` : ''}
      <h4>Winners (${h.winners.length}${h.n_winners > h.winners.length ? ` of ${h.n_winners}` : ''})</h4>
      ${h.winners.map((w, wi) => `<article class="winner">
        <div class="winner-head"><h5>${esc(w.t)}</h5><span class="won">${w.prizes.map(esc).join(' · ') || 'Winner'}</span></div>
        <p class="tagline">${esc(w.tag)}</p>
        ${w.video || w.shots.length ? `<div class="media ${ytId(w.video) || vimeoId(w.video) ? '' : 'noshow'}">${videoBlock(w)}${shotStrip(w, h.id, wi)}</div>` : ''}
        ${w.why ? `<p class="why"><b>Why it won:</b> ${esc(w.why)}</p>` : ''}
        ${w.vnote ? `<div class="vid"><b>Video:</b> ${esc(w.vnote)}</div>` : ''}
        <div class="signals">
          <span class="sig ${w.demo ? 'yes' : ''}">${w.demo ? '✓' : '✗'} live demo</span>
          <span class="sig ${w.repo ? 'yes' : ''}">${w.repo ? '✓' : '✗'} public repo</span>
          <span class="sig ${w.video ? 'yes' : ''}">${w.video ? '✓' : '✗'} video</span>
          ${w.team ? `<span class="sig">team of ${w.team}</span>` : ''}
          ${w.built.slice(0, 8).map(b => `<span class="chip">${esc(b)}</span>`).join('')}
        </div>
        <div class="links">${linkList(w)}</div>
      </article>`).join('')}`;
    if (!dlg.open) dlg.showModal();
    $('#dlgClose').focus();
    dlg.scrollTop = 0;
    history.replaceState(null, '', '#h' + h.id);
  }
  const close = () => { dlg.close(); };
  dlg.addEventListener('close', () => {
    // dialogs only hide on close; drop the content so any playing YouTube/Vimeo iframe is destroyed
    $('#dlgBody').innerHTML = '';
    history.replaceState(null, '', location.pathname + location.search);
  });
  $('#dlgClose').onclick = close;
  dlg.addEventListener('click', e => { if (e.target === dlg) close(); });
  // click-to-play: swap the thumbnail for the real player only when asked
  document.addEventListener('click', e => {
    const p = e.target.closest('[data-play]');
    if (!p) return;
    const [kind, vid] = p.dataset.play.split(':');
    const src = kind === 'yt' ? `https://www.youtube-nocookie.com/embed/${vid}?autoplay=1&rel=0` : `https://player.vimeo.com/video/${vid}?autoplay=1`;
    const f = document.createElement('iframe');
    Object.assign(f, { src, title: p.getAttribute('aria-label'), allowFullscreen: true });
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.className = 'vframe';
    p.replaceWith(f);
  });

  // screenshot lightbox
  const lb = $('#lb');
  let lbList = [], lbI = 0;
  const lbShow = () => {
    const s = lbList[lbI];
    $('#lbImg').src = s.f; $('#lbImg').alt = s.c || '';
    $('#lbCap').textContent = s.c || '';
    $('#lbCount').textContent = `${lbI + 1} / ${lbList.length}`;
    $('#lbPrev').hidden = $('#lbNext').hidden = lbList.length < 2;
  };
  const lbStep = d => { lbI = (lbI + d + lbList.length) % lbList.length; lbShow(); };
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-lb]');
    if (!b) return;
    const [hid, wi, si] = b.dataset.lb.split('|');
    const w = H.find(x => String(x.id) === hid).winners[+wi];
    lbList = w.shots; lbI = +si;
    $('#lbTitle').textContent = w.t;
    lbShow(); lb.showModal();
  });
  $('#lbPrev').onclick = () => lbStep(-1);
  $('#lbNext').onclick = () => lbStep(1);
  $('#lbClose').onclick = () => lb.close();
  lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });
  lb.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') lbStep(-1); if (e.key === 'ArrowRight') lbStep(1); });
  lb.addEventListener('close', () => { $('#lbImg').removeAttribute('src'); });

  document.addEventListener('click', e => {
    const hb = e.target.closest('[data-save]');
    if (hb) {
      const id = +hb.dataset.save;
      saved.has(id) ? saved.delete(id) : saved.add(id);
      try { localStorage.setItem('hk-saved', JSON.stringify([...saved])); } catch {}
      hb.classList.toggle('on', saved.has(id)); hb.setAttribute('aria-pressed', saved.has(id));
      updSaved(); if (state.saved) render();
      return;
    }
    const c = e.target.closest('[data-id],[data-open]');
    if (c) { e.preventDefault(); open(c.dataset.id || c.dataset.open); }
  });
  document.addEventListener('keydown', e => {
    const c = e.target.closest?.('.card[data-id]');
    if (c && e.target === c && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); open(c.dataset.id); }
  });
  const updSaved = () => { $('#savedBtn').textContent = `${state.saved ? '♥' : '♡'} Saved${saved.size ? ` (${saved.size})` : ''}`; $('#savedBtn').setAttribute('aria-pressed', state.saved); };
  $('#savedBtn').onclick = () => { state.saved = !state.saved; $('#savedBtn').classList.toggle('on', state.saved); updSaved(); render(); };
  updSaved();
  $('#capGo').onclick = () => $('.sec-head').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  $('#q').addEventListener('keydown', e => { if (e.key === 'Enter') $('#capGo').click(); });
  document.querySelectorAll('[data-goto]').forEach(b => b.onclick = () => { document.querySelector(`.tab[data-view="${b.dataset.goto}"]`).click(); scrollTo({ top: 0 }); });

  // controls
  $('#q').oninput = e => { state.q = e.target.value; render(); };
  ['cat', 'fmt', 'year', 'sort'].forEach(k => $('#' + k).onchange = e => { state[k] = e.target.value; render(); });
  $('#deploySeg').onclick = e => {
    const b = e.target.closest('button'); if (!b) return;
    state.deploy = b.dataset.v;
    $('#deploySeg').querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
    render();
  };
  document.querySelectorAll('.wtable th[data-k]').forEach(th => th.onclick = () => {
    const k = th.dataset.k; state.wsort = [k, state.wsort[0] === k ? -state.wsort[1] : (k === 'usd' ? -1 : 1)]; render();
  });
  document.querySelectorAll('.tab').forEach(t => t.onclick = () => {
    state.view = t.dataset.view;
    $('#viewTitle').textContent = t.dataset.title;
    t.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    document.querySelectorAll('.tab').forEach(x => { x.classList.toggle('active', x === t); x.setAttribute('aria-selected', x === t); });
    document.querySelectorAll('.view').forEach(v => v.hidden = v.id !== 'view-' + state.view);
    $('#controls').hidden = $('#secTools').hidden = !['hackathons', 'winners'].includes(state.view);
    $('#sort').parentNode.hidden = state.view !== 'hackathons';
    render();
  });

  render();
  const m = location.hash.match(/^#h(\d+)/);
  if (m) open(m[1]);
})();
