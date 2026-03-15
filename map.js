/* ═══════════════════════════════════════════════════════════
   City Metro Rail — Dispatch Control  |  map.js
   ═══════════════════════════════════════════════════════════ */

const API_BASE = 'https://trains-api.felixfeger46.workers.dev';

/* ── Line colors ─────────────────────────────────────────── */
const LINE_HEX = {
  A: '#2563eb',
  E: '#b45309',
  F: '#c2410c',
  K: '#be185d',
};

/* ══════════════════════════════════════════════════════════
   NETWORK DATA
   Each line has nodes alternating: stn … blk … stn … blk … stn
   Double-track lines have wb/eb on each node.
   Single-track lines (K, F) have a flat id/ids structure.
   bidir: true on E-line's shared single-track (EHQ zone) nodes.
   ══════════════════════════════════════════════════════════ */
const NETWORK = {

  A: {
    name: 'A Line',
    colorHex: '#2563eb',
    doubleTrack: true,
    route: 'Union Station (East)  ←→  Santa Mooica (West)',
    couplingLine: true,   // A line supports coupled sets
    nodes: [
      { t:'stn', name:'Union Station',
        wb:{ id:'AW_USP1', p:'P1' },  eb:{ id:'AE_USP2', p:'P2' } },
      { t:'blk',
        wb:['AW001','AW002','AW003'],  eb:['AE001','AE002','AE003'],
        note:'Union Sta → Downtown LC' },
      { t:'stn', name:'Downtown Lego City',
        wb:{ id:'AW_DLP2', p:'P2' },  eb:{ id:'AE_DLP1', p:'P1' } },
      { t:'blk',
        wb:['AW004','AW005','AW006','AW007','AW008','AW009'],
        eb:['AE004','AE005','AE006','AE007','AE008','AE009'],
        note:'Bridge + EHQ Bypass Zone' },
      { t:'stn', name:'Airport Metro TC',
        wb:{ id:'AW_AMP2', p:'P2' },  eb:{ id:'AE_AMP1', p:'P1' } },
      { t:'blk',
        wb:['AW010','AW011','AW012','AW013','AW014'],
        eb:['AE010','AE011','AE012','AE013','AE014'],
        note:'Airport Metro → Death Star' },
      { t:'stn', name:'Death Star City',
        wb:{ id:'AW_DSP2', p:'P2' },  eb:{ id:'AE_DSP1', p:'P1' } },
      { t:'blk',
        wb:['AW015','AW016','AW017'],  eb:['AE015','AE016','AE017'],
        note:'Death Star → Santa Mooica' },
      { t:'stn', name:'Santa Mooica',
        wb:{ id:'AW_SMP2', p:'P2' },  eb:{ id:'AE_SMP1', p:'P1' } },
    ],
  },

  E: {
    name: 'E Line',
    colorHex: '#b45309',
    doubleTrack: true,
    route: 'Union Station (East)  ←→  Table Central (West)  (via Emergency HQ)',
    nodes: [
      // Union → DLC: physically shared track with A (use A-prefix per convention)
      { t:'stn', name:'Union Station',
        wb:{ id:'AW_USP2', p:'P2' },  eb:{ id:'AE_USP1', p:'P1' }, shared:true },
      { t:'blk',
        wb:['AW001','AW002','AW003'],  eb:['AE001','AE002','AE003'],
        shared:true, note:'Shared track with A Line' },
      { t:'stn', name:'Downtown Lego City',
        wb:{ id:'AW_DLP2', p:'P2' },  eb:{ id:'AE_DLP1', p:'P1' }, shared:true },
      // DLC → EHQ: Track 1, E-only, bidirectional single track
      { t:'blk',
        wb:['EW001','EW002','EW003'],  eb:['EW001','EW002','EW003'],
        bidir:true, note:'↕ Bidir single track (E only)' },
      { t:'stn', name:'Emergency HQ',
        wb:{ id:'EW_EQP1', p:'P1' },  eb:{ id:'EW_EQP1', p:'P1' }, bidir:true },
      { t:'blk',
        wb:['EW004','EW005','EW006'],  eb:['EW004','EW005','EW006'],
        bidir:true, note:'↕ Bidir single track (E only)' },
      // EHQ → Airport: back to shared/A track (crossover)
      { t:'stn', name:'Airport Metro TC',
        wb:{ id:'AW_AMP2', p:'P2' },  eb:{ id:'AE_AMP1', p:'P1' }, shared:true },
      // Airport → terminus: E-line's own tracks (branch to Desktop Hills / Table Central)
      { t:'blk',
        wb:['EW007','EW008','EW009','EW010','EW011'],
        eb:['EE007','EE008','EE009','EE010','EE011'],
        note:'Airport Metro → Desktop Hills' },
      { t:'stn', name:'Desktop Hills',
        wb:{ id:'EW_DHP2', p:'P2' },  eb:{ id:'EE_DHP1', p:'P1' } },
      { t:'blk',
        wb:['EW012','EW013','EW014'],  eb:['EE012','EE013','EE014'],
        note:'Desktop Hills → Table Central' },
      { t:'stn', name:'Table Central',
        wb:{ id:'EW_TCP2', p:'P2' },  eb:{ id:'EE_TCP1', p:'P1' } },
    ],
  },

  K: {
    name: 'K Line',
    colorHex: '#be185d',
    doubleTrack: false,
    route: 'Union Station  ↕  Asian Town  (single track)',
    nodes: [
      { t:'stn', id:'KW_USP3', p:'P3', name:'Union Station' },
      { t:'blk', ids:['KW001','KW002','KW003'], note:'Single track bidirectional' },
      { t:'stn', id:'KW_ATP1', p:'P1', name:'Asian Town' },
    ],
  },

  F: {
    name: 'F Line',
    colorHex: '#c2410c',
    doubleTrack: false,
    route: 'Airport Metro TC  ↕  FLX Terminal 2  (single track)',
    nodes: [
      { t:'stn', id:'FW_AMP3', p:'P3', name:'Airport Metro TC' },
      { t:'blk', ids:['FW001','FW002','FW003'], note:'Single track bidirectional' },
      { t:'stn', id:'FW_FTP2', p:'P2', name:'FLX Terminal 2' },
    ],
  },

};

/* Build a flat set of all block IDs for quick lookup */
const ALL_BLOCKS = new Set();
for (const line of Object.values(NETWORK)) {
  for (const node of line.nodes) {
    if (node.t === 'blk') {
      const ids = line.doubleTrack
        ? [...node.wb, ...node.eb]
        : node.ids;
      for (const id of ids) ALL_BLOCKS.add(id);
    } else if (node.t === 'stn') {
      if (line.doubleTrack) {
        ALL_BLOCKS.add(node.wb.id);
        ALL_BLOCKS.add(node.eb.id);
      } else {
        ALL_BLOCKS.add(node.id);
      }
    }
  }
}

/* Location dropdown options by line */
function getLocationsForLine(lineKey) {
  const line = NETWORK[lineKey];
  if (!line) return [];
  const opts = [];
  const seen = new Set();
  for (const node of line.nodes) {
    if (node.t === 'stn') {
      if (line.doubleTrack) {
        if (!seen.has(node.wb.id)) {
          opts.push({ id: node.wb.id, label: `${node.wb.id}  —  ${node.name} ${node.wb.p} (WB)` });
          seen.add(node.wb.id);
        }
        if (!seen.has(node.eb.id)) {
          opts.push({ id: node.eb.id, label: `${node.eb.id}  —  ${node.name} ${node.eb.p} (EB)` });
          seen.add(node.eb.id);
        }
      } else {
        if (!seen.has(node.id)) {
          opts.push({ id: node.id, label: `${node.id}  —  ${node.name} ${node.p}` });
          seen.add(node.id);
        }
      }
    } else if (node.t === 'blk') {
      const ids = line.doubleTrack
        ? [...new Set([...node.wb, ...node.eb])]
        : node.ids;
      for (const id of ids) {
        if (!seen.has(id)) {
          opts.push({ id, label: id });
          seen.add(id);
        }
      }
    }
  }
  return opts;
}

/* ══════════════════════════════════════════════════════════
   STATE
   ══════════════════════════════════════════════════════════ */
let trains = {};  // { number: { number, route, location, connected, coupled_with } }

/* ══════════════════════════════════════════════════════════
   DIAGRAM RENDERING
   ══════════════════════════════════════════════════════════ */
function renderDiagram() {
  const container = document.getElementById('rail-diagram');
  container.innerHTML = '';

  for (const [lineKey, line] of Object.entries(NETWORK)) {
    container.appendChild(buildLineRow(lineKey, line));
  }
}

function buildLineRow(lineKey, line) {
  const row = document.createElement('div');
  row.className = 'line-row';
  row.dataset.line = lineKey;

  // Header
  const hdr = document.createElement('div');
  hdr.className = 'line-header';
  hdr.innerHTML = `
    <div class="lh-pip" style="background:${line.colorHex}"></div>
    <div class="lh-name" style="color:${line.colorHex}">${line.name}</div>
    <div class="lh-route">${line.route}</div>
    <div class="lh-badge">${line.doubleTrack ? 'DOUBLE TRACK' : 'SINGLE TRACK'}</div>
  `;
  row.appendChild(hdr);

  // Track section card
  const card = document.createElement('div');
  card.className = 'track-section';
  card.style.setProperty('--lc', line.colorHex);

  if (line.doubleTrack) {
    // Names row
    card.appendChild(buildNamesRow(line));
    // EB on top — trains heading left (←) toward Union Station (East)
    const ebWrap = buildTrackWithDir(line, 'eb', '← EB');
    card.appendChild(ebWrap);
    // small gap
    const gap = document.createElement('div');
    gap.className = 'track-gap';
    card.appendChild(gap);
    // WB on bottom — trains heading right (→) toward Santa Mooica / Table Central (West)
    const wbWrap = buildTrackWithDir(line, 'wb', 'WB →');
    card.appendChild(wbWrap);
  } else {
    card.appendChild(buildSingleNamesRow(line));
    card.appendChild(buildSingleTrackWithDir(line));
  }

  row.appendChild(card);
  return row;
}

/* Names row for double-track lines */
function buildNamesRow(line) {
  const wrap = document.createElement('div');
  wrap.className = 'names-with-dir';

  const spacer = document.createElement('div');
  spacer.className = 'names-spacer';
  wrap.appendChild(spacer);

  const namesRow = document.createElement('div');
  namesRow.className = 'names-row';

  for (const node of line.nodes) {
    if (node.t === 'stn') {
      const slot = document.createElement('div');
      slot.className = 'name-stn-slot';
      // Only show name once (same station appears on both WB and EB)
      slot.textContent = node.name;
      if (node.shared) slot.style.color = 'var(--muted2)';
      namesRow.appendChild(slot);
    } else {
      const slot = document.createElement('div');
      slot.className = 'name-blk-slot';
      if (node.note && !node.bidir) {
        const n = document.createElement('span');
        n.className = 'blk-zone-note';
        n.textContent = node.note;
        slot.appendChild(n);
      } else if (node.bidir) {
        const n = document.createElement('span');
        n.className = 'blk-zone-note bidir-label';
        n.textContent = '↕ BIDIR';
        slot.appendChild(n);
      }
      namesRow.appendChild(slot);
    }
  }

  wrap.appendChild(namesRow);
  return wrap;
}

/* Names row for single-track lines */
function buildSingleNamesRow(line) {
  const wrap = document.createElement('div');
  wrap.className = 'names-with-dir';

  const spacer = document.createElement('div');
  spacer.className = 'names-spacer';
  wrap.appendChild(spacer);

  const namesRow = document.createElement('div');
  namesRow.className = 'names-row';

  for (const node of line.nodes) {
    if (node.t === 'stn') {
      const slot = document.createElement('div');
      slot.className = 'name-stn-slot';
      slot.textContent = node.name;
      namesRow.appendChild(slot);
    } else {
      const slot = document.createElement('div');
      slot.className = 'name-blk-slot';
      if (node.note) {
        const n = document.createElement('span');
        n.className = 'blk-zone-note';
        n.textContent = node.note;
        slot.appendChild(n);
      }
      namesRow.appendChild(slot);
    }
  }

  wrap.appendChild(namesRow);
  return wrap;
}

/* Build track row with its direction label, double-track version */
function buildTrackWithDir(line, dir, label) {
  const wrap = document.createElement('div');
  wrap.className = 'track-with-dir';

  const lbl = document.createElement('div');
  lbl.className = 'dir-label';
  lbl.textContent = label;
  wrap.appendChild(lbl);

  const trackRow = document.createElement('div');
  trackRow.className = 'track-row';
  trackRow.dataset.direction = dir;

  for (const node of line.nodes) {
    if (node.t === 'stn') {
      const stnData = node[dir]; // { id, p }
      const cell = document.createElement('div');
      cell.className = 'stn-cell';
      cell.dataset.id = stnData.id;
      if (node.shared) cell.dataset.shared = '1';
      cell.innerHTML = `
        <div class="stn-circle" style="border-color:${line.colorHex}${node.shared ? ';opacity:.5' : ''}"></div>
        <div class="stn-id">${stnData.id}</div>
      `;
      trackRow.appendChild(cell);

    } else if (node.t === 'blk') {
      const ids = node[dir]; // wb or eb array
      const group = document.createElement('div');
      group.className = 'blk-group';

      for (const id of ids) {
        const cell = document.createElement('div');
        cell.className = 'blk-cell';
        cell.dataset.id = id;
        cell.textContent = id;
        // Mark bidir EB cells so they render differently
        if (node.bidir && dir === 'eb') {
          cell.classList.add('bidir');
          cell.title = 'Bidirectional single track — see WB row';
        }
        if (node.shared) cell.style.opacity = '0.55';
        group.appendChild(cell);
      }

      trackRow.appendChild(group);
    }
  }

  wrap.appendChild(trackRow);
  return wrap;
}

/* Build track row for single-track lines */
function buildSingleTrackWithDir(line) {
  const wrap = document.createElement('div');
  wrap.className = 'track-with-dir';

  const lbl = document.createElement('div');
  lbl.className = 'dir-label';
  lbl.textContent = '↕ ST';
  wrap.appendChild(lbl);

  const trackRow = document.createElement('div');
  trackRow.className = 'track-row';

  for (const node of line.nodes) {
    if (node.t === 'stn') {
      const cell = document.createElement('div');
      cell.className = 'stn-cell';
      cell.dataset.id = node.id;
      cell.innerHTML = `
        <div class="stn-circle" style="border-color:${line.colorHex}"></div>
        <div class="stn-id">${node.id}</div>
      `;
      trackRow.appendChild(cell);
    } else if (node.t === 'blk') {
      const group = document.createElement('div');
      group.className = 'blk-group';
      for (const id of node.ids) {
        const cell = document.createElement('div');
        cell.className = 'blk-cell';
        cell.dataset.id = id;
        cell.textContent = id;
        group.appendChild(cell);
      }
      trackRow.appendChild(group);
    }
  }

  wrap.appendChild(trackRow);
  return wrap;
}

/* ══════════════════════════════════════════════════════════
   TRAIN OVERLAY — render train badges on blocks/stations
   ══════════════════════════════════════════════════════════ */
function renderTrains() {
  // Clear all existing badges and occupied states
  document.querySelectorAll('.train-badge').forEach(e => e.remove());
  document.querySelectorAll('.blk-cell.occupied, .blk-cell.coupled-occ').forEach(el => {
    el.classList.remove('occupied', 'coupled-occ');
  });
  document.querySelectorAll('.stn-cell[data-occupied]').forEach(el => {
    el.removeAttribute('data-occupied');
    el.querySelector('.stn-circle')?.removeAttribute('style-occ');
  });

  // Group: find coupled pairs to render as one badge
  const rendered = new Set();

  for (const train of Object.values(trains)) {
    if (rendered.has(train.number)) continue;

    const loc = train.location;
    if (!loc) continue;

    const isCoupled = !!train.coupled_with && trains[train.coupled_with];
    const partner = isCoupled ? trains[train.coupled_with] : null;

    if (isCoupled) {
      rendered.add(train.number);
      rendered.add(train.coupled_with);
    }

    // Find DOM element
    const el = document.querySelector(`[data-id="${loc}"]`);
    if (!el) continue;

    // Mark cell occupied
    if (el.classList.contains('blk-cell')) {
      el.classList.add(isCoupled ? 'coupled-occ' : 'occupied');
    }

    // Build badge
    const badge = document.createElement('div');
    badge.className = isCoupled ? 'train-badge coupled-badge' : 'train-badge';
    badge.dataset.train = train.number;

    const label = isCoupled
      ? `${train.number}+${train.coupled_with}`
      : `#${train.number}`;
    badge.textContent = label;

    badge.addEventListener('mouseenter', e => showTooltip(e, train, partner));
    badge.addEventListener('mousemove', moveTooltip);
    badge.addEventListener('mouseleave', hideTooltip);
    badge.addEventListener('click', () => highlightTrain(train.number));

    el.appendChild(badge);
  }

  updateTrainCount();
  renderTrainList();
}

/* ══════════════════════════════════════════════════════════
   TRAIN LIST (sidebar)
   ══════════════════════════════════════════════════════════ */
function renderTrainList() {
  const list = document.getElementById('train-list');
  const arr = Object.values(trains);

  if (!arr.length) {
    list.innerHTML = '<div class="empty-state">No trains on network</div>';
    return;
  }

  list.innerHTML = '';
  const rendered = new Set();

  for (const train of arr) {
    if (rendered.has(train.number)) continue;

    const isCoupled = !!train.coupled_with && trains[train.coupled_with];
    const partner = isCoupled ? trains[train.coupled_with] : null;
    if (isCoupled) {
      rendered.add(train.number);
      rendered.add(train.coupled_with);
    }

    const card = document.createElement('div');
    card.className = isCoupled ? 'train-card coupled-card' : 'train-card';
    card.dataset.num = train.number;

    const numLabel = isCoupled ? `#${train.number} + #${partner.number}` : `#${train.number}`;
    const metaLabel = isCoupled
      ? `${train.route} Line · ${train.location} · COUPLED SET`
      : `${train.route} Line · ${train.location}`;

    card.innerHTML = `
      <div class="tc-indicator ${isCoupled ? 'coupled' : ''}"></div>
      <div class="tc-info">
        <div class="tc-num">${numLabel}</div>
        <div class="tc-meta">${metaLabel}</div>
      </div>
      <div class="tc-actions">
        ${isCoupled ? `<button class="tc-btn split" data-num="${train.number}" title="Split coupled set">Split</button>` : ''}
        <button class="tc-btn remove" data-num="${train.number}" title="Remove train">✕</button>
      </div>
    `;

    card.addEventListener('click', e => {
      if (e.target.closest('.tc-actions')) return;
      highlightTrain(train.number);
    });

    card.querySelector('.tc-btn.remove')?.addEventListener('click', e => {
      e.stopPropagation();
      removeTrain(train.number);
    });

    card.querySelector('.tc-btn.split')?.addEventListener('click', e => {
      e.stopPropagation();
      splitTrains(train.number, partner.number);
    });

    list.appendChild(card);
  }
}

function updateTrainCount() {
  document.getElementById('train-count').textContent = Object.keys(trains).length;
}

/* ══════════════════════════════════════════════════════════
   TOOLTIP
   ══════════════════════════════════════════════════════════ */
const tooltip = document.getElementById('tooltip');

function showTooltip(e, train, partner) {
  const colorHex = LINE_HEX[train.route] || '#888';
  document.getElementById('tt-num').innerHTML =
    `<span class="tt-line-pip" style="background:${colorHex}"></span>#${train.number}`;

  const coupledEl = document.getElementById('tt-coupled');
  if (partner) {
    coupledEl.textContent = `⊞ Coupled with #${partner.number}`;
    coupledEl.style.display = 'block';
  } else {
    coupledEl.style.display = 'none';
  }

  document.getElementById('tt-line').textContent = `${train.route} Line`;
  document.getElementById('tt-block').textContent = train.location;
  document.getElementById('tt-status').textContent =
    train.connected == 1 ? 'Connected' : 'No Signal';

  tooltip.style.display = 'block';
  moveTooltip(e);
}

function moveTooltip(e) {
  const x = e.clientX + 16, y = e.clientY - 10;
  const tw = tooltip.offsetWidth, th = tooltip.offsetHeight;
  tooltip.style.left = Math.min(x, window.innerWidth - tw - 8) + 'px';
  tooltip.style.top  = Math.max(y - th, 8) + 'px';
}

function hideTooltip() {
  tooltip.style.display = 'none';
}

/* ══════════════════════════════════════════════════════════
   HIGHLIGHT / SCROLL
   ══════════════════════════════════════════════════════════ */
function highlightTrain(number) {
  document.querySelectorAll('.train-card').forEach(c => c.classList.remove('highlight'));
  const card = document.querySelector(`.train-card[data-num="${number}"]`);
  if (card) {
    card.classList.add('highlight');
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  const badge = document.querySelector(`.train-badge[data-train="${number}"]`);
  badge?.closest('.line-row')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ══════════════════════════════════════════════════════════
   SEARCH
   ══════════════════════════════════════════════════════════ */
function applySearch(q) {
  q = q.trim().toLowerCase();
  document.getElementById('search-clear').style.display = q ? 'block' : 'none';

  // Clear previous highlights
  document.querySelectorAll('.blk-cell.search-hit').forEach(e => e.classList.remove('search-hit'));
  document.querySelectorAll('.stn-cell.search-hit').forEach(e => e.classList.remove('search-hit'));
  document.querySelectorAll('.train-card').forEach(c => c.classList.remove('highlight'));

  if (!q) return;

  let found = false;

  // Match trains
  for (const t of Object.values(trains)) {
    if (t.number.toLowerCase().includes(q)) {
      highlightTrain(t.number);
      found = true;
    }
  }

  // Match block IDs
  document.querySelectorAll('.blk-cell[data-id]').forEach(el => {
    if (el.dataset.id.toLowerCase().includes(q)) {
      el.classList.add('search-hit');
      el.closest('.line-row')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      found = true;
    }
  });

  // Match station IDs / names
  document.querySelectorAll('.stn-cell[data-id]').forEach(el => {
    const id = el.dataset.id.toLowerCase();
    const name = (el.closest('.line-row')?.querySelector(
      `.name-stn-slot`
    )?.textContent || '').toLowerCase();
    if (id.includes(q) || name.includes(q)) {
      el.querySelector('.stn-circle')?.classList.add('search-hit');
      el.closest('.line-row')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      found = true;
    }
  });

  if (!found) showToast('No results found', 'info');
}

/* ══════════════════════════════════════════════════════════
   TOAST
   ══════════════════════════════════════════════════════════ */
let _toastTimer;
function showToast(msg, type = 'info') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = `show ${type}`;
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => { t.className = ''; }, 3200);
}

/* ══════════════════════════════════════════════════════════
   PERSISTENCE LAYER
   Priority: D1 (via Worker API) — localStorage as write-ahead
   cache and fallback. Retry queue flushes on reconnect.
   ══════════════════════════════════════════════════════════ */

const LS_KEY      = 'citymetro_trains';
const LS_QUEUE    = 'citymetro_retry_queue';  // pending API ops

/* ── localStorage helpers ─────────────────────────────── */
function lsSaveAll() {
  try { localStorage.setItem(LS_KEY, JSON.stringify(trains)); } catch {}
}
function lsLoadAll() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || 'null'); } catch { return null; }
}
function lsQueueGet() {
  try { return JSON.parse(localStorage.getItem(LS_QUEUE) || '[]'); } catch { return []; }
}
function lsQueueSave(q) {
  try { localStorage.setItem(LS_QUEUE, JSON.stringify(q)); } catch {}
}
function lsQueueAdd(op) {
  const q = lsQueueGet();
  // Deduplicate: replace any existing op for same number + type
  const filtered = q.filter(x => !(x.type === op.type && x.number === op.number));
  filtered.push(op);
  lsQueueSave(filtered);
}
function lsQueueRemove(op) {
  const q = lsQueueGet().filter(x => !(x.type === op.type && x.number === op.number));
  lsQueueSave(q);
}

/* ── Status indicator ─────────────────────────────────── */
function setStatus(state) {
  // state: 'live' | 'offline' | 'syncing' | 'pending'
  const dot  = document.getElementById('status-dot');
  const text = document.getElementById('status-text');
  dot.className = 'status-dot';
  if (state === 'live')    { text.textContent = 'LIVE'; }
  else if (state === 'pending') { dot.className = 'status-dot pending'; text.textContent = 'PENDING'; }
  else if (state === 'syncing') { dot.className = 'status-dot syncing'; text.textContent = 'SYNCING…'; }
  else                     { dot.className = 'status-dot offline';  text.textContent = 'OFFLINE'; }
}

/* ── Raw API calls ────────────────────────────────────── */
async function _apiPost(train) {
  const res = await fetch(`${API_BASE}/trains`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(train),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

async function _apiDel(number) {
  const res = await fetch(`${API_BASE}/trains/${encodeURIComponent(number)}`, {
    method: 'DELETE',
  });
  if (!res.ok && res.status !== 404) throw new Error(`HTTP ${res.status}`);
}

/* ── Save a train (write-ahead to localStorage, then API) ─ */
async function persistSave(train) {
  // 1. Write-ahead: save to localStorage immediately
  trains[train.number] = train;
  lsSaveAll();

  // 2. Queue the op (in case API call fails)
  lsQueueAdd({ type: 'save', number: train.number, data: train });

  // 3. Try the API
  try {
    await _apiPost(train);
    lsQueueRemove({ type: 'save', number: train.number });
    setStatus(lsQueueGet().length ? 'pending' : 'live');
  } catch {
    setStatus('pending');
    scheduleRetry();
  }
}

/* ── Delete a train (write-ahead, then API) ──────────────── */
async function persistDelete(number) {
  // 1. Write-ahead: remove from localStorage
  delete trains[number];
  lsSaveAll();

  // 2. Remove any pending save for this number, add a delete op
  const q = lsQueueGet().filter(x => !(x.type === 'save' && x.number === number));
  q.push({ type: 'delete', number });
  lsQueueSave(q);

  // 3. Try the API
  try {
    await _apiDel(number);
    lsQueueRemove({ type: 'delete', number });
    setStatus(lsQueueGet().length ? 'pending' : 'live');
  } catch {
    setStatus('pending');
    scheduleRetry();
  }
}

/* ── Retry queue flush ───────────────────────────────────── */
let _retryTimer = null;
function scheduleRetry() {
  if (_retryTimer) return;
  _retryTimer = setTimeout(flushRetryQueue, 10000); // retry after 10s
}

async function flushRetryQueue() {
  _retryTimer = null;
  const q = lsQueueGet();
  if (!q.length) { setStatus('live'); return; }

  setStatus('syncing');
  let remaining = [...q];

  for (const op of q) {
    try {
      if (op.type === 'save')   await _apiPost(op.data);
      if (op.type === 'delete') await _apiDel(op.number);
      remaining = remaining.filter(x => !(x.type === op.type && x.number === op.number));
    } catch {
      // leave it in the queue, try again later
    }
  }

  lsQueueSave(remaining);

  if (remaining.length) {
    setStatus('pending');
    scheduleRetry(); // try again
  } else {
    setStatus('live');
    showToast('All trains synced to server ✓', 'success');
  }
}

/* ── Load trains on page start ───────────────────────────── */
async function loadTrains() {
  setStatus('syncing');

  let fromAPI = false;

  try {
    const res = await fetch(`${API_BASE}/trains`);
    if (!res.ok) throw new Error();
    const data = await res.json();

    // API success — use server data as source of truth
    trains = {};
    for (const t of data) trains[t.number] = t;
    fromAPI = true;

    // Merge in any locally queued trains that haven't reached the server yet
    const pending = lsQueueGet().filter(x => x.type === 'save');
    for (const op of pending) {
      if (!trains[op.number]) trains[op.number] = op.data;
    }

    // Overwrite localStorage with merged state
    lsSaveAll();

    const pendingCount = lsQueueGet().length;
    setStatus(pendingCount ? 'pending' : 'live');
    if (pendingCount) {
      flushRetryQueue(); // attempt to push any queued ops
    }

  } catch {
    // API unavailable — fall back to localStorage
    const cached = lsLoadAll();
    if (cached && Object.keys(cached).length) {
      trains = cached;
      showToast('Loaded from local cache — server unreachable', 'info');
    }
    setStatus('offline');
    scheduleRetry();
  }

  renderTrains();
}

/* ══════════════════════════════════════════════════════════
   TRAIN OPERATIONS
   ══════════════════════════════════════════════════════════ */
async function addTrain() {
  const number    = document.getElementById('inp-num').value.trim();
  const route     = document.getElementById('inp-line').value;
  const location  = document.getElementById('inp-block').value;
  const connected = parseInt(document.getElementById('inp-connected').value);
  const coupleWith = document.getElementById('inp-couple').value.trim();

  if (!number)   return showToast('Enter a train number', 'error');
  if (!route)    return showToast('Select a line', 'error');
  if (!location) return showToast('Select a block or station', 'error');
  if (trains[number]) return showToast(`Train #${number} already exists`, 'error');

  const train = { number, route, location, connected, coupled_with: coupleWith || null };

  if (coupleWith) {
    if (!trains[coupleWith]) return showToast(`Train #${coupleWith} not found — add it first`, 'error');
    train.coupled_with = coupleWith;
    trains[coupleWith].coupled_with = number;
    await persistSave(trains[coupleWith]);
  }

  await persistSave(train);
  renderTrains();

  // Reset form
  document.getElementById('inp-num').value = '';
  document.getElementById('inp-couple').value = '';
  document.getElementById('inp-block').innerHTML = '<option value="">— Select Line First —</option>';

  showToast(
    `Train #${number} added${coupleWith ? ` (coupled with #${coupleWith})` : ''} ✓`,
    'success'
  );
}

async function removeTrain(number) {
  const train = trains[number];
  if (!train) return showToast(`Train #${number} not found`, 'error');

  // Uncouple partner if any
  if (train.coupled_with && trains[train.coupled_with]) {
    trains[train.coupled_with].coupled_with = null;
    await persistSave(trains[train.coupled_with]);
  }

  await persistDelete(number);
  renderTrains();
  showToast(`Train #${number} removed`, 'success');
}

async function coupleTrains(aNum, bNum) {
  const a = trains[aNum], b = trains[bNum];
  if (!a) return showToast(`Train #${aNum} not found`, 'error');
  if (!b) return showToast(`Train #${bNum} not found`, 'error');
  if (a.coupled_with || b.coupled_with) return showToast('One or both trains already coupled', 'error');

  a.coupled_with = bNum;
  b.coupled_with = aNum;
  await persistSave(a);
  await persistSave(b);
  renderTrains();
  showToast(`#${aNum} and #${bNum} coupled`, 'success');
}

async function splitTrains(aNum, bNum) {
  const a = trains[aNum], b = trains[bNum];
  if (a) { a.coupled_with = null; await persistSave(a); }
  if (b) { b.coupled_with = null; await persistSave(b); }
  renderTrains();
  showToast(`#${aNum} and #${bNum} split`, 'success');
}

/* ══════════════════════════════════════════════════════════
   UI WIRING
   ══════════════════════════════════════════════════════════ */

// Line select → populate block dropdown + show coupling section
document.getElementById('inp-line').addEventListener('change', function () {
  const lineKey = this.value;
  const blockSel = document.getElementById('inp-block');
  const coupleSection = document.getElementById('couple-section');

  // Toggle coupling section for A line
  coupleSection.classList.toggle('visible', lineKey === 'A');

  blockSel.innerHTML = '';
  if (!lineKey) {
    blockSel.innerHTML = '<option value="">— Select Line First —</option>';
    return;
  }

  const opts = getLocationsForLine(lineKey);
  const ph = document.createElement('option');
  ph.value = ''; ph.textContent = '— Select Location —';
  blockSel.appendChild(ph);

  for (const opt of opts) {
    const o = document.createElement('option');
    o.value = opt.id; o.textContent = opt.label;
    blockSel.appendChild(o);
  }
});

document.getElementById('btn-add').addEventListener('click', addTrain);
document.getElementById('inp-num').addEventListener('keydown', e => { if (e.key === 'Enter') addTrain(); });

document.getElementById('btn-remove').addEventListener('click', () => {
  const n = document.getElementById('inp-remove').value.trim();
  if (!n) return showToast('Enter a train number to remove', 'error');
  removeTrain(n);
  document.getElementById('inp-remove').value = '';
});

document.getElementById('btn-couple').addEventListener('click', () => {
  const a = document.getElementById('inp-cpl-a').value.trim();
  const b = document.getElementById('inp-cpl-b').value.trim();
  if (!a || !b) return showToast('Enter both train numbers', 'error');
  coupleTrains(a, b);
  document.getElementById('inp-cpl-a').value = '';
  document.getElementById('inp-cpl-b').value = '';
});

document.getElementById('search-box').addEventListener('input', function () {
  applySearch(this.value);
});
document.getElementById('search-clear').addEventListener('click', () => {
  document.getElementById('search-box').value = '';
  applySearch('');
});

/* ══════════════════════════════════════════════════════════
   INIT
   ══════════════════════════════════════════════════════════ */
renderDiagram();
loadTrains();
