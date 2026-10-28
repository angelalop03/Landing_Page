import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { PROFILE, ABOUT, EXPERIENCE, EDUCATION, SKILLS, WISHES, GUIDE, UI } from './content.js';


const $ = (s) => document.querySelector(s);
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* sin storage */ } },
};
const FIRST = PROFILE.first || PROFILE.name.split(' ')[0];
const savedLang = store.get('lang');
let lang = savedLang === 'en' || savedLang === 'es' ? savedLang : (navigator.language || 'es').startsWith('es') ? 'es' : 'en';

const fill = (s, vars = {}) =>
  String(s).replace(/\{(\w+)\}/g, (_, k) => (k in vars ? vars[k] : k === 'first' ? FIRST : k === 'name' ? PROFILE.name : ''));
const t = (key, vars) => fill(UI[lang][key] ?? key, vars);
const L = (v) => (v && typeof v === 'object' && !Array.isArray(v) && 'es' in v ? v[lang] : v);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const easeInOut = (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const isNarrow = () => innerWidth < 760;
const isTouch = matchMedia('(hover: none)').matches;

function mulberry32(a) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let x = Math.imul(a ^ (a >>> 15), 1 | a);
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(7);
const rr = (a, b) => a + (b - a) * rand();

// estado de las luces: la lámpara de la mesita y la luz del cuarto
let lampOn = store.get('lamp') !== 'off';
let lightsOn = store.get('lights') === 'on';
let wishCount = 0;


const panel = $('#panel');
const panelBody = $('#panelBody');
const expressEl = $('#express');
let currentSection = null;
let expressOpen = false;

const SPINES = ['#ffc1d9', '#cdbbff', '#a9e5d9', '#ffe48a', '#ffcfb3'];
const tagList = (items) => `<ul class="tags">${items.map((i) => `<li>${esc(L(i))}</li>`).join('')}</ul>`;
const telHref = (p) => `tel:${p.replace(/[^\d+]/g, '')}`;

function contactButtons() {
  let html = `<a class="btn pink" href="mailto:${esc(PROFILE.email)}">✉ ${t('email')}</a>`;
  html += `<button type="button" class="btn" data-action="copy">${t('copyEmail')}</button>`;
  if (PROFILE.linkedin) html += `<a class="btn" href="${esc(PROFILE.linkedin)}" target="_blank" rel="noopener">${t('linkedin')} ↗</a>`;
  if (PROFILE.github) html += `<a class="btn" href="${esc(PROFILE.github)}" target="_blank" rel="noopener">${t('github')} ↗</a>`;
  if (PROFILE.cv) html += `<a class="btn" href="${esc(PROFILE.cv)}" download>⤓ ${t('downloadCv')}</a>`;
  return html;
}

function jobCard(j) {
  return `<article class="job-card" style="--note:${j.note}">
    <h3>${esc(j.company)} ${j.current ? `<span class="pill now">● ${t('current')}</span>` : ''}</h3>
    <p class="job-role">${esc(L(j.role))}</p>
    <p class="job-place">${esc(L(j.place))} · ${esc(L(j.period))}</p>
    <ul class="job-bullets">${L(j.bullets).map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
  </article>`;
}

function eduItem(e, i) {
  return `<div class="edu-item"><i class="spine" style="--c:${SPINES[i % SPINES.length]}"></i>
    <div class="what"><strong>${esc(L(e.title))}</strong><span>${esc(e.place)}</span><em>${esc(L(e.period))}</em></div></div>`;
}

function stickerList() {
  return `<ul class="stickers">${SKILLS.map((s) => `<li class="sticker">
    <span class="sticker-badge" style="--c:${s.color}">${s.icon}</span>
    <div><strong>${esc(L(s.name))}</strong>${tagList(s.items)}</div></li>`).join('')}</ul>`;
}

const sections = {
  about: () => ({
    eyebrow: t('aboutEyebrow'),
    title: PROFILE.name,
    body: `${L(ABOUT.paragraphs).map((p, i) => `<p class="${i === 0 ? 'lead' : ''}">${esc(p)}</p>`).join('')}
      <dl class="facts">${ABOUT.facts.map((f) => `<div><dt>${esc(L(f.label))}</dt><dd>${esc(L(f.value))}</dd></div>`).join('')}</dl>
      <div class="row"><button type="button" class="btn pink" data-action="open:experience">📌 ${t('seeExperience')}</button>
      <button type="button" class="btn" data-action="open:contact">${t('seeContact')}</button></div>`,
  }),
  skills: () => ({
    eyebrow: t('skillsEyebrow'),
    title: t('skillsTitle'),
    body: `<p class="lead">${t('skillsIntro')}</p>${stickerList()}`,
  }),
  experience: () => ({
    eyebrow: t('experienceEyebrow'),
    title: t('experienceTitle'),
    body: `<p class="lead">${t('experienceIntro')}</p>${EXPERIENCE.map(jobCard).join('')}
      <div class="row"><button type="button" class="btn pink" data-action="open:contact">${t('seeContact')}</button></div>`,
  }),
  education: () => ({
    eyebrow: t('educationEyebrow'),
    title: t('educationTitle'),
    body: `<p class="lead">${t('educationIntro')}</p>
      <h3 class="panel-section">${t('degreesTitle')}</h3>
      <div class="edu-list">${EDUCATION.degrees.map(eduItem).join('')}</div>
      <h3 class="panel-section">${t('certsTitle')}</h3>
      <div class="edu-list">${EDUCATION.certs.map((c, i) => eduItem(c, i + 3)).join('')}</div>
      <h3 class="panel-section">${t('languagesTitle')}</h3>
      ${tagList(EDUCATION.languages)}`,
  }),
  contact: () => ({
    eyebrow: t('contactEyebrow'),
    title: t('contactTitle'),
    body: `<p class="lead">${t('contactText')}</p>
      <div class="contact-lines">
        <div>✉️ ${esc(PROFILE.email)}</div>
        ${PROFILE.phone ? `<div>📱 <a href="${telHref(PROFILE.phone)}">${esc(PROFILE.phone)}</a></div>` : ''}
        <div>📍 ${esc(L(ABOUT.facts[2].value))}</div>
      </div>
      <div class="row">${contactButtons()}</div>`,
  }),
};

function renderPanel() {
  if (!currentSection) return;
  const { eyebrow, title, body } = sections[currentSection.id]();
  $('#panelEyebrow').textContent = eyebrow;
  $('#panelTitle').textContent = title;
  panelBody.innerHTML = body;
}

function showPanel(id) {
  currentSection = { id };
  renderPanel();
  panelBody.scrollTop = 0;
  panel.classList.add('open');
  panel.setAttribute('aria-hidden', 'false');
  document.body.classList.add('panel-open');
  updateHotspotStates();
}

function closePanel() {
  if (!currentSection) return;
  currentSection = null;
  panel.classList.remove('open');
  panel.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('panel-open');
  updateHotspotStates();
}

function copyEmail() {
  navigator.clipboard?.writeText(PROFILE.email).then(() => showToast(t('copied'), 1600)).catch(() => {});
}

panelBody.addEventListener('click', (e) => {
  const el = e.target.closest('[data-action]');
  if (!el) return;
  const action = el.dataset.action;
  if (action === 'copy') copyEmail();
  else if (action.startsWith('open:')) openSection(action.slice(5));
});
$('#panelClose').addEventListener('click', closePanel);

/* ---------- guía ---------- */
const guideEl = $('#guide');
let guide = null; // { key, idx }

function say(key) {
  guide = { key, idx: 0 };
  renderGuide();
  guideEl.hidden = false;
}
function renderGuide() {
  if (!guide) return;
  const lines = GUIDE[lang][guide.key];
  const last = guide.idx >= lines.length - 1;
  $('#guideSpeaker').textContent = GUIDE[lang].speaker;
  $('#guideText').textContent = fill(lines[guide.idx]);
  $('#guideNext').textContent = last ? t('gotIt') : `${t('next')} →`;
  $('#guideSkip').textContent = t('skip');
  $('#guideSkip').hidden = last;
}
function hideGuide() { guide = null; guideEl.hidden = true; }
$('#guideNext').addEventListener('click', () => {
  const lines = GUIDE[lang][guide.key];
  if (guide.idx < lines.length - 1) { guide.idx++; renderGuide(); } else hideGuide();
});
$('#guideSkip').addEventListener('click', hideGuide);
$('#helpBtn').addEventListener('click', () => say('intro'));

/* ---------- toast ---------- */
const toastEl = $('#toast');
let toastTimer = 0;
function showToast(text, ms = 0, cls = '') {
  toastEl.textContent = text;
  toastEl.className = `toast show ${cls}`;
  clearTimeout(toastTimer);
  if (ms) toastTimer = setTimeout(hideToast, ms);
}
function hideToast() { toastEl.className = 'toast'; }

/* ---------- modo rápido ---------- */
function renderExpress() {
  const paras = L(ABOUT.paragraphs);
  expressEl.innerHTML = `<div class="ex-wrap">
    <div class="ex-hero">
      <span class="eyebrow">${t('tagline')}</span>
      <h2>${esc(PROFILE.name)}</h2>
      ${paras.map((p) => `<p>${esc(p)}</p>`).join('')}
      <div class="row">${contactButtons()}</div>
    </div>
    <h3 class="section">📌 ${t('experienceTitle')}</h3>
    <div class="ex-grid">${EXPERIENCE.map(jobCard).join('')}</div>
    <h3 class="section">💻 ${t('skillsTitle')}</h3>
    ${stickerList()}
    <h3 class="section">📚 ${t('educationTitle')}</h3>
    <div class="edu-list">${EDUCATION.degrees.map(eduItem).join('')}${EDUCATION.certs.map((c, i) => eduItem(c, i + 3)).join('')}</div>
    <h3 class="section">🗣️ ${t('languagesTitle')}</h3>
    ${tagList(EDUCATION.languages)}
  </div>`;
}
expressEl.addEventListener('click', (e) => {
  if (e.target.closest('[data-action="copy"]')) copyEmail();
});
function setExpress(open) {
  expressOpen = open;
  if (open) { renderExpress(); closePanel(); hideGuide(); }
  expressEl.hidden = !open;
  document.body.classList.toggle('express-open', open);
  $('#expressBtn').textContent = open ? t('exitExpress') : t('express');
  if (open) expressEl.scrollTop = 0;
}
$('#expressBtn').addEventListener('click', () => setExpress(!expressOpen));

/* ---------- idioma y luz ---------- */
function applyLang() {
  document.documentElement.lang = lang;
  store.set('lang', lang);
  document.title = t('docTitle');
  $('#brandEyebrow').textContent = t('brandEyebrow');
  $('#brandTitle').textContent = t('brandTitle');
  document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('.lang button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
  $('#expressBtn').textContent = expressOpen ? t('exitExpress') : t('express');
  $('#hint').textContent = isTouch ? t('hintTouch') : t('hint');
  $('#helpBtn').setAttribute('aria-label', t('help'));
  $('#panelClose').setAttribute('aria-label', t('close'));
  $('#loaderText').textContent = t('loading');
  updateLightBtn();
  updateHotspotLabels();
  renderGuide();
  renderPanel();
  if (expressOpen) renderExpress();
  if (screenCtx) { drawScreen(); drawPhone(); }
}
document.querySelectorAll('.lang button').forEach((b) =>
  b.addEventListener('click', () => { lang = b.dataset.lang; applyLang(); }),
);

function updateLightBtn() {
  const btn = $('#lightBtn');
  btn.textContent = lightsOn ? '🌙' : '💡';
  btn.setAttribute('aria-label', lightsOn ? t('lightOff') : t('lightOn'));
  btn.title = btn.getAttribute('aria-label');
}
$('#lightBtn').addEventListener('click', () => {
  lightsOn = !lightsOn;
  store.set('lights', lightsOn ? 'on' : 'off');
  updateLightBtn();
});

if (PROFILE.cv) { const cv = $('#cvBtn'); cv.href = PROFILE.cv; cv.hidden = false; }

$('#homeBtn').addEventListener('click', goHome);

addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (currentSection) closePanel();
  else if (expressOpen) setExpress(false);
  else hideGuide();
});

/* ════════════════════════════════════════════════════════════
   Escena 3D
   ════════════════════════════════════════════════════════════ */
const canvas = $('#scene');
let renderer = null;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
} catch {
  renderer = null;
}

let scene, camera, controls, HOME, composer, bloomPass;
let hemi, moonLight, roomLight, lampLight, lampShadeMat, lampBulbMat, screenLight, neonMat, neonLight;
let screenTex, screenCtx, phoneTex, phoneCtx, corkTex, corkCtx, diaryTex, signTex;
let bulbs, beamMat, dust, starField, cat, catBody;
const bulbData = [];
const steam = [];
const zzz = [];
const shooting = [];
const interactives = {};
const pickables = [];
const textureJobs = [];
let time = 0;
let fly = null;
let hovered = null;
let lampVal = lampOn ? 1 : 0;
let lightVal = lightsOn ? 1 : 0;
let nextStar = 4;
let wishTimer = -1;
let catBounce = 0;
let cursorOn = true;
let cursorTimer = 0;
let clockTimer = 0;

const V = (x, y, z) => new THREE.Vector3(x, y, z);
const FONT = "'Fredoka', 'Nunito', system-ui, sans-serif";
const MONO = "ui-monospace, 'Cascadia Code', Consolas, monospace";
const WALL_H = 6;
const WIN = { x0: -0.7, x1: 1.5, y0: 2, y1: 4.4 };
const WIN_CENTER = V((WIN.x0 + WIN.x1) / 2, (WIN.y0 + WIN.y1) / 2, -5);
const MOON_DIR = V(6.5, -14, 17.5); // dirección de la luz de luna que entra por la ventana
const BED = V(-3.6, 0, -3.1);
const NIGHTSTAND = V(-1.5, 0, -4.45);
const LAMP_POS = V(-1.75, 1.1, -4.6);
const PHONE_POS = V(-1.2, 1.1, -4.2);
const DESK = V(3.1, 0, -4.2);
const LAPTOP_POS = V(2.65, 1.55, -4.3);
const MUG_POS = V(3.75, 1.55, -3.95);
const BOARD = V(3.45, 3.4, -4.98);
const SHELF = V(-4.65, 0, 1.4);
const SHELF_Y = [0.08, 0.95, 1.85, 2.75, 3.6];
const DIARY_POS = V(-2.95, 1.17, -2.05);
const CAT_POS = V(-4.05, 1.16, -2.4);

/* ---------- utilidades de geometría ---------- */
const mats = new Map();
function mat(color, opts) {
  if (opts) return new THREE.MeshStandardMaterial({ color, roughness: 0.82, metalness: 0, ...opts });
  if (!mats.has(color)) mats.set(color, new THREE.MeshStandardMaterial({ color, roughness: 0.82, metalness: 0 }));
  return mats.get(color);
}
function mesh(geo, material, x = 0, y = 0, z = 0, parent = scene, shadow = true) {
  const m = new THREE.Mesh(geo, typeof material === 'string' ? mat(material) : material);
  m.position.set(x, y, z);
  m.castShadow = shadow;
  m.receiveShadow = true;
  parent.add(m);
  return m;
}
const rbox = (w, h, d, r) => new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2 - 0.002, h / 2 - 0.002, d / 2 - 0.002));
function box(w, h, d, material, x, y, z, parent = scene, r = 0.05) {
  return mesh(r > 0 ? rbox(w, h, d, r) : new THREE.BoxGeometry(w, h, d), material, x, y, z, parent);
}
function cyl(rt, rb, h, material, x, y, z, parent = scene, seg = 24) {
  return mesh(new THREE.CylinderGeometry(rt, rb, h, seg), material, x, y, z, parent);
}
function sphere(r, material, x, y, z, parent = scene, sx = 1, sy = 1, sz = 1) {
  const m = mesh(new THREE.SphereGeometry(r, 20, 14), material, x, y, z, parent);
  m.scale.set(sx, sy, sz);
  return m;
}

/* ---------- texturas dibujadas en canvas ---------- */
function canvasTex(w, h, draw, repeat = false) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d');
  draw(g, w, h);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  if (repeat) tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.userData.ctx = g;
  return tex;
}
// texturas con texto: se vuelven a dibujar cuando cargan las fuentes
function textTex(w, h, draw) {
  const tex = canvasTex(w, h, draw);
  textureJobs.push(() => { draw(tex.userData.ctx, w, h); tex.needsUpdate = true; });
  return tex;
}
function rrect(g, x, y, w, h, r) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}
function starPath(g, cx, cy, r, inner = 0.45) {
  g.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rad = i % 2 ? r * inner : r;
    g.lineTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad);
  }
  g.closePath();
}
function heartPath(g, cx, cy, s) {
  g.beginPath();
  g.moveTo(cx, cy + s * 0.9);
  g.bezierCurveTo(cx - s * 1.4, cy - s * 0.1, cx - s * 0.7, cy - s * 1.2, cx, cy - s * 0.45);
  g.bezierCurveTo(cx + s * 0.7, cy - s * 1.2, cx + s * 1.4, cy - s * 0.1, cx, cy + s * 0.9);
  g.closePath();
}
function softDot(color = '255,255,255') {
  return canvasTex(64, 64, (g) => {
    const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, `rgba(${color},1)`);
    gr.addColorStop(0.4, `rgba(${color},.45)`);
    gr.addColorStop(1, `rgba(${color},0)`);
    g.fillStyle = gr;
    g.fillRect(0, 0, 64, 64);
  });
}

function wallpaperTex() {
  return canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = '#c7b5ec';
    g.fillRect(0, 0, w, h);
    g.fillStyle = '#bfaae8';
    for (let x = 0; x < w; x += 64) g.fillRect(x, 0, 30, h);
    g.fillStyle = '#e4d8ff';
    starPath(g, 47, 60, 9); g.fill();
    starPath(g, 175, 190, 9); g.fill();
    g.fillStyle = '#d8c9fb';
    for (const [x, y] of [[110, 20], [20, 150], [230, 90], [140, 120], [80, 230], [200, 10]]) {
      g.beginPath(); g.arc(x, y, 3, 0, Math.PI * 2); g.fill();
    }
  }, true);
}

function floorTex() {
  return canvasTex(512, 512, (g, w, h) => {
    const cols = ['#c99c74', '#c1936b', '#cfa47c', '#bb8c63', '#c6976e'];
    const rows = 8;
    const ph = h / rows;
    for (let r = 0; r < rows; r++) {
      let x = r % 2 ? -128 : -40 * (r % 3);
      while (x < w) {
        const len = 200 + ((rand() * 3) | 0) * 40;
        g.fillStyle = cols[(rand() * cols.length) | 0];
        g.fillRect(x, r * ph, len, ph);
        g.strokeStyle = 'rgba(120,80,50,.18)';
        g.lineWidth = 1.5;
        for (let k = 0; k < 3; k++) {
          const yy = r * ph + 10 + rand() * (ph - 20);
          g.beginPath(); g.moveTo(x + 6, yy); g.bezierCurveTo(x + len * 0.3, yy - 4, x + len * 0.6, yy + 4, x + len - 6, yy); g.stroke();
        }
        g.fillStyle = 'rgba(70,40,25,.45)';
        g.fillRect(x, r * ph, 3, ph);
        x += len;
      }
      g.fillStyle = 'rgba(70,40,25,.5)';
      g.fillRect(0, r * ph, w, 3);
    }
  }, true);
}

function rugTex() {
  return canvasTex(512, 512, (g, w) => {
    const c = w / 2;
    const rings = ['#ff9fc3', '#fff0f6', '#ffc1d9', '#e5d6ff', '#fff0f6', '#ffb3cf', '#fff7fb'];
    rings.forEach((col, i) => {
      g.fillStyle = col;
      g.beginPath(); g.arc(c, c, c - i * 34, 0, Math.PI * 2); g.fill();
    });
    g.fillStyle = '#ffffff';
    for (let i = 0; i < 28; i++) {
      const a = (i / 28) * Math.PI * 2;
      g.beginPath(); g.arc(c + Math.cos(a) * (c - 16), c + Math.sin(a) * (c - 16), 6, 0, Math.PI * 2); g.fill();
    }
    g.fillStyle = '#ff8fb8';
    heartPath(g, c, c + 8, 38); g.fill();
  });
}

/* ---------- cielo, estrellas y luna ---------- */
function buildSky() {
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: {
      top: { value: new THREE.Color('#07061c') },
      mid: { value: new THREE.Color('#1c1544') },
      bottom: { value: new THREE.Color('#341f55') },
    },
    vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: `uniform vec3 top; uniform vec3 mid; uniform vec3 bottom; varying vec3 vP;
      void main(){ float h = vP.y; vec3 c = h > 0.0 ? mix(mid, top, smoothstep(0.0, 0.75, h)) : mix(mid, bottom, smoothstep(0.0, -0.7, h)); gl_FragColor = vec4(c, 1.0); }`,
  });
  scene.add(new THREE.Mesh(new THREE.SphereGeometry(160, 32, 16), skyMat));

  const n = 1400;
  const pos = new Float32Array(n * 3);
  const col = new Float32Array(n * 3);
  const tints = [[1, 1, 1], [1, 0.85, 0.95], [0.85, 0.9, 1], [1, 0.95, 0.8]];
  for (let i = 0; i < n; i++) {
    const u = rand() * 2 - 1;
    const a = rand() * Math.PI * 2;
    const r = rr(90, 140);
    const s = Math.sqrt(1 - u * u);
    pos.set([Math.cos(a) * s * r, u * r, Math.sin(a) * s * r], i * 3);
    const b = rand() < 0.08 ? rr(1.6, 2.4) : rr(0.35, 1);
    const tint = tints[(rand() * tints.length) | 0];
    col.set([tint[0] * b, tint[1] * b, tint[2] * b], i * 3);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  starField = new THREE.Points(geo, new THREE.PointsMaterial({
    size: 0.9, map: softDot(), vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  scene.add(starField);

  // la luna, con su halo
  const moonPos = V(-34, 10, -70);
  const moon = new THREE.Mesh(new THREE.SphereGeometry(4.2, 32, 16), new THREE.MeshBasicMaterial({ color: new THREE.Color('#fff2cc').multiplyScalar(1.6) }));
  moon.position.copy(moonPos);
  scene.add(moon);
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: softDot('255,236,200'), transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending }));
  halo.position.copy(moonPos);
  halo.scale.setScalar(34);
  scene.add(halo);

  // estrellas fugaces (pool reutilizable)
  const trail = canvasTex(256, 16, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, w, 0);
    gr.addColorStop(0, 'rgba(255,255,255,0)');
    gr.addColorStop(0.85, 'rgba(255,230,250,.8)');
    gr.addColorStop(1, 'rgba(255,255,255,1)');
    g.fillStyle = gr;
    g.beginPath(); g.moveTo(0, h / 2); g.lineTo(w - 8, 2); g.arc(w - 8, h / 2, h / 2 - 2, -Math.PI / 2, Math.PI / 2); g.lineTo(0, h / 2); g.fill();
  });
  for (let i = 0; i < 4; i++) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({
      map: trail, color: new THREE.Color(2, 1.8, 2), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending,
    }));
    m.visible = false;
    scene.add(m);
    shooting.push({ mesh: m, t: 0, dur: 1, from: V(0, 0, 0), to: V(0, 0, 0), active: false });
  }
}

function shootStar(from, to, len, dur = 1.1) {
  const s = shooting.find((x) => !x.active) || shooting[0];
  s.active = true;
  s.t = 0;
  s.dur = dur;
  s.from.copy(from);
  s.to.copy(to);
  s.mesh.visible = true;
  s.mesh.scale.set(len, len * 0.045, 1);
  s.mesh.quaternion.copy(camera.quaternion);
  // orientar la estela en la dirección del movimiento, vista desde la cámara
  const a = from.clone().project(camera);
  const b = to.clone().project(camera);
  s.mesh.rotateZ(Math.atan2((b.y - a.y) * innerHeight, (b.x - a.x) * innerWidth));
}

function randomShootingStar() {
  const fwd = new THREE.Vector3();
  camera.getWorldDirection(fwd);
  const right = fwd.clone().cross(V(0, 1, 0)).normalize();
  const up = right.clone().cross(fwd).normalize();
  const c = camera.position.clone().addScaledVector(fwd, 70);
  const from = c.clone().addScaledVector(right, rr(-20, 30)).addScaledVector(up, rr(10, 22));
  const to = from.clone().addScaledVector(right, -rr(14, 22)).addScaledVector(up, -rr(5, 9));
  shootStar(from, to, 6);
}

function wishStar() {
  // una estrella que cruza justo por la ventana, vista desde donde esté la cámara
  const p = camera.position.clone().lerp(WIN_CENTER, 3.2);
  const fwd = WIN_CENTER.clone().sub(camera.position).normalize();
  const right = fwd.clone().cross(V(0, 1, 0)).normalize();
  const up = right.clone().cross(fwd).normalize();
  const span = camera.position.distanceTo(p) * 0.075;
  const from = p.clone().addScaledVector(right, span).addScaledVector(up, span * 0.45);
  const to = p.clone().addScaledVector(right, -span).addScaledVector(up, -span * 0.45);
  shootStar(from, to, span * 0.9, 1.4);
}

/* ---------- luces ---------- */
function buildLights() {
  hemi = new THREE.HemisphereLight('#8f86e0', '#3b2950', 0.9);
  scene.add(hemi);

  moonLight = new THREE.DirectionalLight('#a9bbff', 2.2);
  moonLight.position.copy(WIN_CENTER).addScaledVector(MOON_DIR, -1.4);
  moonLight.target.position.copy(WIN_CENTER).addScaledVector(MOON_DIR, 0.25);
  moonLight.castShadow = true;
  moonLight.shadow.mapSize.set(2048, 2048);
  Object.assign(moonLight.shadow.camera, { left: -9, right: 9, top: 9, bottom: -9, near: 1, far: 60 });
  moonLight.shadow.bias = -0.0006;
  moonLight.shadow.normalBias = 0.03;
  scene.add(moonLight, moonLight.target);

  // la luz del techo (botón 💡)
  roomLight = new THREE.PointLight('#fff1dc', 0, 0, 1.1);
  roomLight.position.set(0, 7.5, 0);
  scene.add(roomLight);

  // brillo cálido de las guirnaldas
  for (const p of [V(0.5, 5, -4.3), V(-4.3, 5, 0.5)]) {
    const l = new THREE.PointLight('#ffc48a', 2.4, 9, 1.4);
    l.position.copy(p);
    scene.add(l);
  }
}

/* ---------- habitación ---------- */
function wallPiece(w, h, x0, y0, material, parent) {
  const geo = new THREE.BoxGeometry(w, h, 0.25);
  const uv = geo.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, (x0 + uv.getX(i) * w) / 2.4, (y0 + uv.getY(i) * h) / 2.4);
  return mesh(geo, material, x0 + w / 2, y0 + h / 2, 0, parent);
}

function buildRoom() {
  const wallMat = new THREE.MeshStandardMaterial({ map: wallpaperTex(), roughness: 0.9 });
  const trim = '#fff4ea';

  // suelo: una losa flotando en el cielo
  const fTex = floorTex();
  fTex.repeat.set(2.4, 2.4);
  const edge = mat('#4a3566');
  const slab = new THREE.Mesh(new THREE.BoxGeometry(10.25, 0.5, 10.25), [edge, edge, new THREE.MeshStandardMaterial({ map: fTex, roughness: 0.75 }), edge, edge, edge]);
  slab.position.set(-0.125, -0.25, -0.125);
  slab.receiveShadow = true;
  scene.add(slab);

  // pared del fondo con el hueco de la ventana
  const back = new THREE.Group();
  back.position.z = -5.125;
  scene.add(back);
  wallPiece(WIN.x0 + 5.25, WALL_H, -5.25, 0, wallMat, back);
  wallPiece(5 - WIN.x1, WALL_H, WIN.x1, 0, wallMat, back);
  wallPiece(WIN.x1 - WIN.x0, WIN.y0, WIN.x0, 0, wallMat, back);
  wallPiece(WIN.x1 - WIN.x0, WALL_H - WIN.y1, WIN.x0, WIN.y1, wallMat, back);

  const left = new THREE.Group();
  left.position.x = -5.125;
  left.rotation.y = Math.PI / 2;
  scene.add(left);
  wallPiece(10, WALL_H, -5, 0, wallMat, left);

  // techo invisible: no se dibuja, pero frena la luna para que solo entre por la ventana
  const ceiling = new THREE.Mesh(new THREE.BoxGeometry(10.5, 0.2, 10.5), new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false }));
  ceiling.position.set(-0.1, WALL_H + 0.1, -0.1);
  ceiling.castShadow = true;
  scene.add(ceiling);

  // remates superiores y zócalos
  box(10.35, 0.12, 0.35, trim, -0.12, WALL_H + 0.06, -5.125);
  box(0.35, 0.12, 10.25, trim, -5.125, WALL_H + 0.06, 0);
  box(10, 0.22, 0.06, trim, -0.1, 0.11, -4.97, scene, 0.02);
  box(0.06, 0.22, 9.9, trim, -4.97, 0.11, 0.05, scene, 0.02);

  // ventana: marco, travesaños, alféizar, cristal, cortinas
  const wc = WIN_CENTER;
  const ww = WIN.x1 - WIN.x0;
  const wh = WIN.y1 - WIN.y0;
  box(ww + 0.2, 0.1, 0.34, trim, wc.x, WIN.y1 + 0.03, -5.1);
  box(ww + 0.5, 0.1, 0.5, trim, wc.x, WIN.y0 - 0.03, -4.95);
  box(0.1, wh, 0.34, trim, WIN.x0 - 0.03, wc.y, -5.1);
  box(0.1, wh, 0.34, trim, WIN.x1 + 0.03, wc.y, -5.1);
  box(0.06, wh, 0.08, trim, wc.x, wc.y, -5.12, scene, 0.02);
  box(ww, 0.06, 0.08, trim, wc.x, wc.y, -5.12, scene, 0.02);
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(ww, wh), new THREE.MeshBasicMaterial({ color: '#bcd0ff', transparent: true, opacity: 0.06, depthWrite: false }));
  glass.position.set(wc.x, wc.y, -5.14);
  scene.add(glass);
  // cactus en el alféizar
  cyl(0.11, 0.09, 0.16, '#ffcfb3', wc.x + 0.75, WIN.y0 + 0.1, -4.95);
  sphere(0.08, '#6fbf8e', wc.x + 0.75, WIN.y0 + 0.28, -4.95, scene, 1, 1.6, 1);
  sphere(0.035, '#ff8fb8', wc.x + 0.75, WIN.y0 + 0.43, -4.95);

  const curtainMat = new THREE.MeshStandardMaterial({ color: '#ffb8d2', roughness: 0.95, side: THREE.DoubleSide, transparent: true, opacity: 0.93 });
  for (const [x, dir] of [[WIN.x0 - 0.3, 1], [WIN.x1 + 0.3, -1]]) {
    const geo = new THREE.PlaneGeometry(0.75, 2.75, 28, 6);
    const p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const px = p.getX(i), py = p.getY(i);
      const gather = 1 - (py + 1.375) / 2.75; // más recogida abajo
      p.setX(i, px * (1 - gather * 0.25) + dir * gather * 0.06);
      p.setZ(i, Math.sin(px * 26 + dir) * 0.05);
    }
    geo.computeVertexNormals();
    const c = mesh(geo, curtainMat, x, WIN.y1 + 0.35 - 1.375, -4.86);
    c.userData.dir = dir;
  }
  const rod = cyl(0.03, 0.03, ww + 1.9, '#e0c08a', wc.x, WIN.y1 + 0.38, -4.84);
  rod.rotation.z = Math.PI / 2;
  sphere(0.06, '#e0c08a', WIN.x0 - 0.95, WIN.y1 + 0.38, -4.84);
  sphere(0.06, '#e0c08a', WIN.x1 + 0.95, WIN.y1 + 0.38, -4.84);

  // haz de luna: un volumen translúcido desde la ventana hasta el suelo
  const corners = [[WIN.x0, WIN.y0], [WIN.x1, WIN.y0], [WIN.x1, WIN.y1], [WIN.x0, WIN.y1]];
  const verts = [];
  const cols = [];
  for (const [x, y] of corners) {
    verts.push(x, y, -5.05);
    cols.push(0.75, 0.82, 1);
  }
  for (const [x, y] of corners) {
    const s = y / -MOON_DIR.y;
    verts.push(x + MOON_DIR.x * s, 0.02, -5.05 + MOON_DIR.z * s);
    cols.push(0.12, 0.14, 0.22);
  }
  const beamGeo = new THREE.BufferGeometry();
  beamGeo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
  beamGeo.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
  beamGeo.setIndex([0, 1, 5, 0, 5, 4, 1, 2, 6, 1, 6, 5, 2, 3, 7, 2, 7, 6, 3, 0, 4, 3, 4, 7]);
  beamMat = new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.16, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending });
  scene.add(new THREE.Mesh(beamGeo, beamMat));

  // motas de polvo flotando en el haz
  const n = 160;
  const pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const y = rr(WIN.y0, WIN.y1);
    const s = rr(0.05, 0.95) * (y / -MOON_DIR.y);
    pos.set([rr(WIN.x0, WIN.x1) + MOON_DIR.x * s, y + MOON_DIR.y * s, -5 + MOON_DIR.z * s], i * 3);
  }
  const dGeo = new THREE.BufferGeometry();
  dGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  dust = new THREE.Points(dGeo, new THREE.PointsMaterial({ size: 0.06, map: softDot('210,220,255'), color: '#dfe6ff', transparent: true, opacity: 0.8, depthWrite: false, blending: THREE.AdditiveBlending }));
  dust.userData.base = pos.slice();
  scene.add(dust);

  // alfombra, puf y zapatillas
  const rug = new THREE.Mesh(new THREE.CircleGeometry(2.3, 64), new THREE.MeshStandardMaterial({ map: rugTex(), roughness: 1 }));
  rug.rotation.x = -Math.PI / 2;
  rug.position.set(0.9, 0.012, 0.5);
  rug.receiveShadow = true;
  scene.add(rug);
  sphere(0.55, '#cdbbff', 2.3, 0.26, 1.7, scene, 1, 0.5, 1);
  box(0.22, 0.09, 0.45, '#ffb3cf', -1.95, 0.05, -0.75, scene, 0.04).rotation.y = 0.25;
  box(0.22, 0.09, 0.45, '#ffb3cf', -1.6, 0.05, -0.7, scene, 0.04).rotation.y = -0.1;
  sphere(0.07, '#ffffff', -1.9, 0.12, -0.56);
  sphere(0.07, '#ffffff', -1.58, 0.12, -0.5);

  // puerta en la pared izquierda, con cartelito
  const door = new THREE.Group();
  door.position.set(-4.97, 0, 3.7);
  scene.add(door);
  box(0.06, 4, 1.7, '#f7efe6', 0, 2, 0, door, 0.03);
  box(0.03, 1.5, 1.2, '#fbf6f0', 0.04, 2.95, 0, door, 0.02);
  box(0.03, 1.3, 1.2, '#fbf6f0', 0.04, 1.05, 0, door, 0.02);
  box(0.1, 4.15, 0.12, trim, 0.02, 2.07, 0.91, door, 0.03);
  box(0.1, 4.15, 0.12, trim, 0.02, 2.07, -0.91, door, 0.03);
  box(0.1, 0.12, 1.94, trim, 0.02, 4.1, 0, door, 0.03);
  sphere(0.07, mat('#e8c070', { metalness: 0.6, roughness: 0.3 }), 0.1, 1.95, -0.62, door);
  signTex = textTex(256, 256, (g, w) => {
    g.clearRect(0, 0, w, w);
    g.fillStyle = '#ffc1d9';
    g.beginPath(); g.arc(w / 2, w / 2, w / 2 - 6, 0, Math.PI * 2); g.fill();
    g.lineWidth = 6; g.setLineDash([14, 10]); g.strokeStyle = '#fff'; g.beginPath(); g.arc(w / 2, w / 2, w / 2 - 22, 0, Math.PI * 2); g.stroke();
    g.setLineDash([]);
    g.fillStyle = '#2b2140'; g.textAlign = 'center';
    g.font = `700 50px ${FONT}`; g.fillText(FIRST, w / 2, 132);
    g.fillStyle = '#e8457a'; heartPath(g, w / 2, 176, 18); g.fill();
  });
  const sign = new THREE.Mesh(new THREE.CircleGeometry(0.32, 40), new THREE.MeshStandardMaterial({ map: signTex, transparent: true, roughness: 0.8 }));
  sign.rotation.y = Math.PI / 2;
  sign.position.set(0.07, 3.0, 0);
  door.add(sign);

  // planta grande entre la cama y la estantería
  const plant = new THREE.Group();
  plant.position.set(-4.35, 0, -0.45);
  scene.add(plant);
  cyl(0.28, 0.22, 0.55, '#fff4ea', 0, 0.275, 0, plant);
  cyl(0.27, 0.27, 0.03, '#5b3b2a', 0, 0.54, 0, plant);
  const greens = ['#5fae7e', '#4f9c6e', '#73c08f'];
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2 + rr(-0.2, 0.2);
    const h = rr(0.9, 1.5);
    const stem = cyl(0.012, 0.016, h, '#3f7d55', Math.cos(a) * 0.08, 0.55 + h / 2, Math.sin(a) * 0.08, plant, 6);
    stem.rotation.set(Math.sin(a) * 0.35, 0, -Math.cos(a) * 0.35);
    const leaf = sphere(0.1, greens[i % 3], Math.cos(a) * (0.08 + h * 0.34), 0.55 + h * 0.95, Math.sin(a) * (0.08 + h * 0.34), plant, 1.6, 0.35, 2.8);
    leaf.rotation.y = -a;
    leaf.rotation.z = 0.3;
  }

  // posters encima de la cama
  const posters = [
    { z: -3.95, y: 3.55, w: 0.85, h: 1.1, draw: (g, w, h) => {
      g.fillStyle = '#231a4a'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#fff2cc';
      for (let i = 0; i < 5; i++) {
        const y = 70 + i * 70;
        g.beginPath(); g.arc(w / 2, y, 24, 0, Math.PI * 2); g.fill();
        g.fillStyle = '#231a4a';
        g.beginPath(); g.arc(w / 2 + (i - 2) * 16, y, 24, 0, Math.PI * 2); if (i !== 2) g.fill();
        g.fillStyle = '#fff2cc';
      }
      g.fillStyle = '#cdbbff';
      for (let i = 0; i < 18; i++) { starPath(g, rand() * w, rand() * h, rr(2, 5)); g.fill(); }
      g.fillStyle = '#ffc1d9'; g.textAlign = 'center'; g.font = `600 26px ${FONT}`; g.fillText('good night', w / 2, h - 22);
    } },
    { z: -2.7, y: 3.15, w: 0.85, h: 0.68, draw: (g, w, h) => {
      g.fillStyle = '#ffc1d9'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#2b2140'; g.textAlign = 'center';
      g.font = `700 54px ${MONO}`; g.fillText('</>', w / 2, 92);
      g.font = `700 36px ${FONT}`; g.fillText('code & coffee', w / 2, 150);
      g.fillStyle = '#e8457a'; heartPath(g, w / 2, 192, 14); g.fill();
    } },
  ];
  for (const p of posters) {
    box(0.05, p.h + 0.1, p.w + 0.1, '#fff4ea', -4.97, p.y, p.z, scene, 0.02);
    const tex = textTex(256, Math.round((256 * p.h) / p.w), p.draw);
    const m = new THREE.Mesh(new THREE.PlaneGeometry(p.w, p.h), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9 }));
    m.rotation.y = Math.PI / 2;
    m.position.set(-4.94, p.y, p.z);
    scene.add(m);
  }

  // corazón de neón sobre el cabecero
  const curve = new THREE.CatmullRomCurve3(Array.from({ length: 64 }, (_, i) => {
    const a = (i / 64) * Math.PI * 2;
    const x = 16 * Math.sin(a) ** 3;
    const y = 13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a);
    return V(x * 0.026, y * 0.026, 0);
  }), true);
  neonMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(1, 0.3, 0.62).multiplyScalar(2.4) });
  const neon = new THREE.Mesh(new THREE.TubeGeometry(curve, 160, 0.024, 8, true), neonMat);
  neon.position.set(BED.x, 3.65, -4.93);
  scene.add(neon);
  neonLight = new THREE.PointLight('#ff5fa2', 2, 4.5, 1.6);
  neonLight.position.set(BED.x, 3.6, -4.5);
  scene.add(neonLight);
}

/* ---------- guirnaldas de luces ---------- */
function buildFairyLights() {
  const runs = [];
  const sag = (a, b, n, depth) => Array.from({ length: n + 1 }, (_, i) => {
    const s = i / n;
    return a.clone().lerp(b, s).add(V(0, -depth * 4 * s * (1 - s), 0));
  });
  const xs = [-4.9, -2.4, 0.1, 2.6, 4.9];
  for (let i = 0; i < xs.length - 1; i++) runs.push(sag(V(xs[i], 5.6, -4.92), V(xs[i + 1], 5.6, -4.92), 24, 0.38));
  const zs = [-4.9, -2.4, 0.1, 2.6, 4.9];
  for (let i = 0; i < zs.length - 1; i++) runs.push(sag(V(-4.92, 5.6, zs[i]), V(-4.92, 5.6, zs[i + 1]), 24, 0.38));

  const wireMat = mat('#3e5a48');
  const palette = ['#ffd27a', '#ffb3cf', '#fff1c1', '#cdbbff', '#ffcf8a'];
  const points = [];
  for (const run of runs) {
    const tube = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(run), 60, 0.012, 5), wireMat);
    scene.add(tube);
    for (let i = 2; i < run.length - 1; i += 3) points.push(run[i].clone().add(V(0, -0.06, 0)));
  }
  bulbs = new THREE.InstancedMesh(new THREE.SphereGeometry(0.055, 10, 8), new THREE.MeshBasicMaterial({ color: '#ffffff' }), points.length);
  const m4 = new THREE.Matrix4();
  points.forEach((p, i) => {
    m4.makeTranslation(p.x, p.y, p.z);
    bulbs.setMatrixAt(i, m4);
    bulbData.push({ color: new THREE.Color(palette[i % palette.length]), phase: rand() * Math.PI * 2, speed: rr(1.2, 2.6) });
    bulbs.setColorAt(i, bulbData[i].color);
  });
  scene.add(bulbs);
}

/* ---------- cama, gata, peluche y diario ---------- */
function buildBed() {
  const g = new THREE.Group();
  g.position.copy(BED);
  scene.add(g);
  const frame = '#f3e9dc';
  const duvet = '#ff9fc3';
  for (const [x, z] of [[-1.15, -1.65], [1.15, -1.65], [-1.15, 1.65], [1.15, 1.65]]) cyl(0.07, 0.06, 0.22, '#d9b48a', x, 0.11, z, g, 10);
  box(2.6, 0.45, 3.6, frame, 0, 0.42, 0, g, 0.08);
  box(2.45, 0.38, 3.45, '#ffffff', 0, 0.83, 0, g, 0.12);
  box(2.62, 0.2, 2.55, duvet, 0, 1.06, 0.55, g, 0.09);
  box(0.07, 0.5, 2.5, duvet, 1.3, 0.86, 0.56, g, 0.03);
  box(2.62, 0.5, 0.07, duvet, 0, 0.86, 1.82, g, 0.03);
  box(2.66, 0.12, 0.38, '#ffe1ec', 0, 1.13, -0.66, g, 0.05);
  // lunares blancos en el edredón
  for (let i = 0; i < 14; i++) {
    const d = mesh(new THREE.CircleGeometry(0.06, 16), '#ffe1ec', rr(-1.1, 1.1), 1.162, rr(-0.3, 1.7), g, false);
    d.rotation.x = -Math.PI / 2;
  }
  const p1 = box(1.0, 0.24, 0.62, '#fff6fb', -0.6, 1.14, -1.35, g, 0.11);
  p1.rotation.y = 0.05;
  const p2 = box(1.0, 0.24, 0.62, '#e3d6ff', 0.6, 1.16, -1.32, g, 0.11);
  p2.rotation.set(0.12, -0.08, 0);

  // cabecero en arco
  box(2.8, 1.4, 0.18, '#b69cff', 0, 1.2, -1.83, g, 0.07);
  const archGeo = new THREE.CylinderGeometry(1.4, 1.4, 0.18, 40, 1, false, Math.PI / 2, Math.PI);
  archGeo.rotateX(Math.PI / 2);
  archGeo.scale(1, 0.42, 1);
  mesh(archGeo, '#b69cff', 0, 1.88, -1.83, g);
  for (const [x, y] of [[-0.8, 1.6], [0, 1.75], [0.8, 1.6], [-0.4, 2.05], [0.4, 2.05]]) sphere(0.04, '#d8c9ff', x, y, -1.73, g);

  // osito de peluche
  const bear = new THREE.Group();
  bear.position.set(0.55, 1.25, -1.0);
  bear.rotation.y = -0.5;
  g.add(bear);
  const fur = '#d9a679';
  sphere(0.2, fur, 0, 0.1, 0, bear, 1, 1.05, 0.9);
  sphere(0.15, fur, 0, 0.38, 0.02, bear);
  sphere(0.055, fur, -0.11, 0.5, 0, bear);
  sphere(0.055, fur, 0.11, 0.5, 0, bear);
  sphere(0.06, '#f1d3b3', 0, 0.34, 0.13, bear);
  sphere(0.018, '#2b2140', -0.05, 0.42, 0.13, bear);
  sphere(0.018, '#2b2140', 0.05, 0.42, 0.13, bear);
  sphere(0.07, fur, -0.17, 0.0, 0.12, bear);
  sphere(0.07, fur, 0.17, 0.0, 0.12, bear);
  const bow = box(0.16, 0.06, 0.04, '#ff8fb8', 0, 0.26, 0.13, bear, 0.02);
  bow.rotation.z = 0.1;
}

function buildCat() {
  cat = new THREE.Group();
  cat.position.copy(CAT_POS);
  cat.rotation.y = 0.5;
  scene.add(cat);
  const furMat = mat('#3b3350', { roughness: 0.9 });
  catBody = sphere(0.32, furMat, 0, 0.12, 0, cat, 1.25, 0.6, 1);
  const head = new THREE.Group();
  head.position.set(0.32, 0.16, 0.18);
  cat.add(head);
  sphere(0.17, furMat, 0, 0, 0, head, 1, 0.9, 1);
  for (const s of [-1, 1]) {
    const ear = mesh(new THREE.ConeGeometry(0.065, 0.13, 4), furMat, 0, 0.17, s * 0.08, head);
    ear.rotation.x = s * 0.35;
    const inner = mesh(new THREE.ConeGeometry(0.035, 0.07, 4), '#ffb3cf', 0.02, 0.165, s * 0.08, head, false);
    inner.rotation.x = s * 0.35;
    // ojos cerrados: dos arquitos
    const eye = mesh(new THREE.TorusGeometry(0.03, 0.007, 4, 10, Math.PI), '#ffd9e8', 0.155, 0.03, s * 0.065, head, false);
    eye.rotation.set(0, Math.PI / 2, Math.PI);
  }
  sphere(0.022, '#ff8fb8', 0.17, -0.02, 0, head);
  // collar con cascabel
  const collar = mesh(new THREE.TorusGeometry(0.13, 0.018, 6, 20), '#ff8fb8', 0.25, 0.08, 0.14, cat, false);
  collar.rotation.set(0, 0.9, Math.PI / 2.4);
  sphere(0.03, mat('#f2c94c', { metalness: 0.6, roughness: 0.3 }), 0.33, 0.0, 0.2, cat);
  // cola enroscada
  const tail = mesh(new THREE.TorusGeometry(0.36, 0.05, 8, 24, Math.PI * 1.05), furMat, -0.05, 0.03, 0, cat);
  tail.rotation.set(Math.PI / 2, 0, 0.9);

  // zzz flotando
  const zTex = canvasTex(64, 64, (g) => {
    g.fillStyle = '#f3e9ff'; g.font = `700 52px ${FONT}`; g.textAlign = 'center'; g.fillText('z', 32, 48);
  });
  for (let i = 0; i < 3; i++) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: zTex, transparent: true, depthWrite: false }));
    scene.add(s);
    zzz.push(s);
  }
}

function buildDiary() {
  const g = new THREE.Group();
  g.position.copy(DIARY_POS);
  g.rotation.y = 0.35;
  scene.add(g);
  diaryTex = textTex(256, 320, (c, w, h) => {
    c.fillStyle = '#ff8fb8'; c.fillRect(0, 0, w, h);
    c.strokeStyle = '#fff'; c.lineWidth = 5; c.setLineDash([12, 9]); c.strokeRect(16, 16, w - 32, h - 32); c.setLineDash([]);
    c.fillStyle = '#fff'; heartPath(c, w / 2, 130, 52); c.fill();
    c.fillStyle = '#e8457a'; heartPath(c, w / 2, 130, 30); c.fill();
    c.fillStyle = '#fff'; c.textAlign = 'center'; c.font = `700 40px ${FONT}`; c.fillText(FIRST, w / 2, 250);
  });
  diaryTex.center.set(0.5, 0.5);
  diaryTex.rotation = Math.PI;
  const side = mat('#ff8fb8');
  const cover = new THREE.MeshStandardMaterial({ map: diaryTex, roughness: 0.7 });
  const d = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.09, 0.66), [side, side, cover, side, side, side]);
  d.castShadow = d.receiveShadow = true;
  g.add(d);
  box(0.47, 0.06, 0.62, '#fffaf0', 0.025, 0, 0, g, 0.01);
  box(0.06, 0.1, 0.12, '#f2c94c', 0.24, 0, 0.05, g, 0.015);
  const pen = cyl(0.018, 0.018, 0.5, '#b69cff', 0.42, -0.01, 0.0, g, 8);
  pen.rotation.set(Math.PI / 2, 0, 0.2);
  return g;
}

/* ---------- mesita: lámpara y móvil ---------- */
function buildNightstand() {
  const g = new THREE.Group();
  g.position.copy(NIGHTSTAND);
  scene.add(g);
  for (const [x, z] of [[-0.4, -0.35], [0.4, -0.35], [-0.4, 0.35], [0.4, 0.35]]) cyl(0.035, 0.03, 0.12, '#d9b48a', x, 0.06, z, g, 8);
  box(0.95, 1.0, 0.85, '#fff4ea', 0, 0.6, 0, g, 0.06);
  box(0.82, 0.38, 0.03, '#ffd1e2', 0, 0.82, 0.43, g, 0.03);
  box(0.82, 0.38, 0.03, '#e5d6ff', 0, 0.37, 0.43, g, 0.03);
  sphere(0.035, '#e8c070', 0, 0.82, 0.46, g);
  sphere(0.035, '#e8c070', 0, 0.37, 0.46, g);
}

function buildLamp() {
  const g = new THREE.Group();
  g.position.copy(LAMP_POS);
  scene.add(g);
  cyl(0.17, 0.2, 0.06, '#fff4ea', 0, 0.03, 0, g);
  const body = sphere(0.19, mat('#ffb3cf', { roughness: 0.35 }), 0, 0.24, 0, g, 1, 1.05, 1);
  body.castShadow = false;
  cyl(0.022, 0.022, 0.38, '#e0c08a', 0, 0.55, 0, g, 8).castShadow = false;
  lampShadeMat = new THREE.MeshStandardMaterial({ color: '#fff1d6', emissive: '#ffc77a', emissiveIntensity: 1.4, roughness: 0.9, side: THREE.DoubleSide });
  lampShadeMat.userData.keep = true;
  const shade = mesh(new THREE.CylinderGeometry(0.2, 0.34, 0.42, 32, 1, true), lampShadeMat, 0, 0.86, 0, g, false);
  shade.receiveShadow = false;
  lampBulbMat = new THREE.MeshBasicMaterial({ color: '#ffd9a0' });
  lampBulbMat.userData.keep = true;
  mesh(new THREE.SphereGeometry(0.07, 12, 10), lampBulbMat, 0, 0.8, 0, g, false);
  lampLight = new THREE.PointLight('#ffb870', 6, 16, 1.5);
  lampLight.position.set(0, 0.82, 0);
  lampLight.castShadow = true;
  lampLight.shadow.mapSize.set(512, 512);
  lampLight.shadow.bias = -0.004;
  lampLight.shadow.camera.near = 0.25;
  g.add(lampLight);
  return g;
}

function drawPhone() {
  const g = phoneCtx, w = 160, h = 320;
  const gr = g.createLinearGradient(0, 0, 0, h);
  gr.addColorStop(0, '#5b3fb3');
  gr.addColorStop(1, '#ff8fb8');
  g.fillStyle = gr;
  g.fillRect(0, 0, w, h);
  const d = new Date();
  g.fillStyle = '#fff';
  g.textAlign = 'center';
  g.font = `600 44px ${FONT}`;
  g.fillText(`${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`, w / 2, 86);
  g.fillStyle = 'rgba(255,255,255,.92)';
  rrect(g, 12, 128, w - 24, 70, 14);
  g.fill();
  g.fillStyle = '#2b2140';
  g.font = `700 17px ${FONT}`;
  g.fillText(`💌 ${t('contactTitle')}`, w / 2, 158);
  g.font = `600 13px ${FONT}`;
  g.fillStyle = '#6d6382';
  g.fillText(PROFILE.email.split('@')[0], w / 2, 182);
  g.textAlign = 'left';
  phoneTex.needsUpdate = true;
}

function buildPhone() {
  const g = new THREE.Group();
  g.position.copy(PHONE_POS);
  g.rotation.y = 0.45;
  scene.add(g);
  box(0.27, 0.035, 0.52, '#ff8fb8', 0, 0.018, 0, g, 0.03);
  phoneTex = canvasTex(160, 320, (c) => { phoneCtx = c; });
  const scr = new THREE.MeshBasicMaterial({ map: phoneTex });
  scr.userData.keep = true;
  const s = mesh(new THREE.PlaneGeometry(0.23, 0.46), scr, 0, 0.037, 0, g, false);
  s.rotation.x = -Math.PI / 2;
  return g;
}

/* ---------- escritorio, portátil, silla ---------- */
function drawScreen() {
  const g = screenCtx, w = 512, h = 320;
  g.fillStyle = '#1e1736';
  g.fillRect(0, 0, w, h);
  g.fillStyle = '#2d2352';
  g.fillRect(0, 0, w, 30);
  ['#ff6b8b', '#ffd66b', '#7fe0b0'].forEach((c, i) => { g.fillStyle = c; g.beginPath(); g.arc(18 + i * 20, 15, 6, 0, Math.PI * 2); g.fill(); });
  g.fillStyle = '#b9a8e8';
  g.font = `600 15px ${MONO}`;
  g.fillText('angela.ts', 84, 20);
  const C = { k: '#ff8fb8', v: '#9ad8ff', s: '#ffe08a', p: '#ece6ff', c: '#8f80c0', b: '#7fe0b0' };
  const lines = [
    [[lang === 'es' ? '// hola, soy Ángela ✨' : "// hi, I'm Ángela ✨", C.c]],
    [['const ', C.k], ['angela', C.v], [' = {', C.p]],
    [['  role: ', C.p], ["'Software Engineer'", C.s], [',', C.p]],
    [['  stack: ', C.p], ["['Java', 'Spring', 'Angular']", C.s], [',', C.p]],
    [['  loves: ', C.p], ["['UI/UX', 'data', 'cats']", C.s], [',', C.p]],
    [['  openToRelocation: ', C.p], ['true', C.b], [',', C.p]],
    [['};', C.p]],
    [['ship', C.v], ['(angela);', C.p]],
  ];
  g.font = `500 17px ${MONO}`;
  let y = 60;
  let lastX = 0;
  lines.forEach((ln, i) => {
    g.fillStyle = '#5d4f8a';
    g.fillText(String(i + 1).padStart(2, ' '), 10, y);
    let x = 44;
    for (const [txt, col] of ln) { g.fillStyle = col; g.fillText(txt, x, y); x += g.measureText(txt).width; }
    lastX = x;
    y += 31;
  });
  if (cursorOn) { g.fillStyle = '#ff8fb8'; g.fillRect(lastX + 3, y - 31 - 15, 9, 19); }
  screenTex.needsUpdate = true;
}

function buildDesk() {
  const g = new THREE.Group();
  g.position.copy(DESK);
  scene.add(g);
  const white = '#fff4ea';
  box(3.0, 0.1, 1.25, white, 0, 1.5, 0, g, 0.04);
  cyl(0.05, 0.05, 1.45, white, -1.38, 0.725, -0.5, g, 10);
  cyl(0.05, 0.05, 1.45, white, -1.38, 0.725, 0.5, g, 10);
  box(0.8, 1.45, 1.15, white, 1.05, 0.725, 0, g, 0.04);
  ['#ffd1e2', '#e5d6ff', '#c9efe6'].forEach((c, i) => {
    box(0.72, 0.4, 0.03, c, 1.05, 1.17 - i * 0.46, 0.58, g, 0.03);
    sphere(0.03, '#e8c070', 1.05, 1.17 - i * 0.46, 0.61, g);
  });
  // libros apilados
  [['#b69cff', 0.7, 0.1], ['#ffd66b', 0.62, -0.2], ['#a9e5d9', 0.66, 0.15]].forEach(([c, w, r], i) => {
    const b = box(w, 0.09, 0.48, c, -1.08, 1.6 + i * 0.09, -0.3, g, 0.015);
    b.rotation.y = r;
  });
  // cubilete con lápices
  cyl(0.09, 0.08, 0.22, '#ffb3cf', 1.2, 1.66, -0.22, g, 16);
  ['#ffd66b', '#7fc8f8', '#b69cff'].forEach((c, i) => {
    const p = cyl(0.012, 0.012, 0.34, c, 1.2 + (i - 1) * 0.035, 1.78, -0.22 + (i % 2) * 0.03, g, 6);
    p.rotation.z = (i - 1) * 0.18;
  });
  // suculenta
  cyl(0.1, 0.08, 0.14, '#ffcfb3', 0.9, 1.62, -0.42, g, 14);
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const l = sphere(0.045, '#7fc8a0', 0.9 + Math.cos(a) * 0.05, 1.73, -0.42 + Math.sin(a) * 0.05, g, 1, 1.6, 1);
    l.rotation.set(Math.sin(a) * 0.6, 0, -Math.cos(a) * 0.6);
  }

  // taza humeante
  cyl(0.12, 0.11, 0.22, '#ffffff', MUG_POS.x - DESK.x, 1.66, MUG_POS.z - DESK.z, g, 20);
  cyl(0.122, 0.122, 0.05, '#ff8fb8', MUG_POS.x - DESK.x, 1.69, MUG_POS.z - DESK.z, g, 20);
  mesh(new THREE.CircleGeometry(0.105, 20), '#6b4430', MUG_POS.x - DESK.x, 1.765, MUG_POS.z - DESK.z, g, false).rotation.x = -Math.PI / 2;
  const handle = mesh(new THREE.TorusGeometry(0.065, 0.018, 6, 14), '#ffffff', MUG_POS.x - DESK.x + 0.13, 1.66, MUG_POS.z - DESK.z, g);
  handle.rotation.z = Math.PI / 2;
  const steamTex = softDot('255,255,255');
  for (let i = 0; i < 4; i++) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: steamTex, transparent: true, opacity: 0, depthWrite: false }));
    s.userData.phase = i / 4;
    scene.add(s);
    steam.push(s);
  }

  // silla
  const chair = new THREE.Group();
  chair.position.set(3.0, 0, -2.85);
  chair.rotation.y = 0.28;
  scene.add(chair);
  for (const [x, z] of [[-0.36, -0.34], [0.36, -0.34], [-0.36, 0.34], [0.36, 0.34]]) cyl(0.035, 0.03, 0.92, '#e0c08a', x, 0.46, z, chair, 8);
  box(0.9, 0.08, 0.85, white, 0, 0.94, 0, chair, 0.03);
  box(0.82, 0.09, 0.76, '#ffb3cf', 0, 1.02, 0, chair, 0.04);
  cyl(0.03, 0.03, 0.9, '#e0c08a', -0.38, 1.4, 0.38, chair, 8);
  cyl(0.03, 0.03, 0.9, '#e0c08a', 0.38, 1.4, 0.38, chair, 8);
  box(0.9, 0.5, 0.08, white, 0, 1.7, 0.4, chair, 0.04);
  sphere(0.06, '#ff8fb8', 0, 1.72, 0.45, chair, 1.2, 1, 0.3);
}

function buildLaptop() {
  const g = new THREE.Group();
  g.position.copy(LAPTOP_POS);
  g.rotation.y = -0.12;
  scene.add(g);
  const shell = mat('#ddd5ee', { roughness: 0.45, metalness: 0.2 });
  box(1.15, 0.05, 0.78, shell, 0, 0.025, 0, g, 0.02);
  box(0.98, 0.006, 0.36, '#3a3050', 0, 0.052, -0.1, g, 0);
  box(0.34, 0.006, 0.2, '#c9c0de', 0, 0.052, 0.24, g, 0);
  const hinge = new THREE.Group();
  hinge.position.set(0, 0.04, -0.38);
  hinge.rotation.x = -0.22;
  g.add(hinge);
  box(1.15, 0.76, 0.04, shell, 0, 0.38, 0, hinge, 0.02);
  screenTex = canvasTex(512, 320, (c) => { screenCtx = c; });
  const scr = new THREE.MeshBasicMaterial({ map: screenTex, color: new THREE.Color(1.15, 1.15, 1.15) });
  scr.userData.keep = true;
  mesh(new THREE.PlaneGeometry(1.05, 0.66), scr, 0, 0.39, 0.021, hinge, false);
  screenLight = new THREE.PointLight('#93adff', 1.6, 4.5, 1.8);
  screenLight.position.set(0, 0.5, 0.5);
  g.add(screenLight);
  return g;
}

/* ---------- tablón de corcho ---------- */
function drawCork() {
  const g = corkCtx, w = 1024, h = 672;
  g.fillStyle = '#c99f72';
  g.fillRect(0, 0, w, h);
  const r2 = mulberry32(3);
  for (let i = 0; i < 2600; i++) {
    g.fillStyle = r2() < 0.5 ? 'rgba(120,80,45,.35)' : 'rgba(235,200,150,.35)';
    g.fillRect(r2() * w, r2() * h, 2 + r2() * 3, 2 + r2() * 3);
  }
  const card = (x, y, cw, ch, rot, fillCol, pin, inner) => {
    g.save();
    g.translate(x + cw / 2, y + ch / 2);
    g.rotate(rot);
    g.shadowColor = 'rgba(40,20,10,.45)';
    g.shadowBlur = 14;
    g.shadowOffsetY = 6;
    g.fillStyle = fillCol;
    g.fillRect(-cw / 2, -ch / 2, cw, ch);
    g.shadowColor = 'transparent';
    inner(cw, ch);
    g.fillStyle = pin;
    g.beginPath(); g.arc(0, -ch / 2 + 16, 11, 0, Math.PI * 2); g.fill();
    g.fillStyle = 'rgba(255,255,255,.6)';
    g.beginPath(); g.arc(-3, -ch / 2 + 12, 4, 0, Math.PI * 2); g.fill();
    g.restore();
  };
  const text = (s, x, y, size, col = '#2b2140', weight = 700) => {
    g.fillStyle = col; g.font = `${weight} ${size}px ${FONT}`; g.textAlign = 'center'; g.fillText(s, x, y);
  };
  // polaroid Airbus
  card(70, 70, 250, 290, -0.08, '#ffffff', '#e8457a', (cw, ch) => {
    const gr = g.createLinearGradient(0, -ch / 2 + 18, 0, 60);
    gr.addColorStop(0, '#7fb6ff'); gr.addColorStop(1, '#d6e8ff');
    g.fillStyle = gr; g.fillRect(-cw / 2 + 16, -ch / 2 + 16, cw - 32, 200);
    g.fillStyle = '#fff';
    g.beginPath(); g.arc(-40, -20, 22, 0, Math.PI * 2); g.arc(-15, -28, 26, 0, Math.PI * 2); g.arc(12, -18, 20, 0, Math.PI * 2); g.fill();
    text('✈', 50, -50, 70, '#ffffff');
    text('Airbus · 2026', 0, ch / 2 - 26, 30);
  });
  // nota amarilla
  card(370, 60, 250, 220, 0.06, '#ffe48a', '#7a4fd6', () => {
    text('Discover', 0, -30, 36);
    text('Program ✨', 0, 12, 36);
    text('Logistics &', 0, 58, 25, '#5a4f6e', 600);
    text('Digitalization', 0, 88, 25, '#5a4f6e', 600);
  });
  // polaroid Dedalus
  card(690, 90, 250, 290, 0.07, '#ffffff', '#3fae7e', (cw, ch) => {
    const gr = g.createLinearGradient(0, -ch / 2 + 18, 0, 60);
    gr.addColorStop(0, '#9fe3d2'); gr.addColorStop(1, '#e4fbf5');
    g.fillStyle = gr; g.fillRect(-cw / 2 + 16, -ch / 2 + 16, cw - 32, 200);
    g.fillStyle = '#ff8fb8';
    heartPath(g, 0, -40, 50); g.fill();
    g.fillStyle = '#fff'; g.fillRect(-8, -62, 16, 44); g.fillRect(-22, -48, 44, 16);
    text('Dedalus · 2025', 0, ch / 2 - 26, 30);
  });
  // lista de tareas
  card(90, 410, 270, 220, -0.04, '#c9efe6', '#ffb000', () => {
    text('To do ♡', 0, -50, 34);
    g.textAlign = 'left';
    g.font = `600 25px ${FONT}`;
    g.fillStyle = '#2b2140';
    g.fillText('☑ Spring Boot', -100, -6);
    g.fillText('☑ Angular', -100, 30);
    g.fillText('☐ dormir 8h', -100, 66);
  });
  // ruta Sevilla → Cádiz
  card(420, 330, 240, 170, -0.05, '#ffc1d9', '#2b9bd8', () => {
    text('Sevilla', 0, -14, 34);
    text('↓ ✈ ↓', 0, 24, 26, '#7a4fd6');
    text('Cádiz', 0, 62, 34);
  });
  // sticker de estrella y corazones
  g.fillStyle = '#ffd66b';
  starPath(g, 800, 500, 70); g.fill();
  g.fillStyle = '#2b2140';
  g.font = `700 30px ${FONT}`; g.textAlign = 'center'; g.fillText('B2', 800, 512);
  g.fillStyle = '#e8457a';
  heartPath(g, 930, 600, 26); g.fill();
  heartPath(g, 690, 610, 18); g.fill();
  g.textAlign = 'left';
  corkTex.needsUpdate = true;
}

function buildCorkboard() {
  const g = new THREE.Group();
  g.position.copy(BOARD);
  scene.add(g);
  box(2.45, 1.65, 0.08, '#d9a679', 0, 0, 0, g, 0.03);
  corkTex = canvasTex(1024, 672, (c) => { corkCtx = c; });
  textureJobs.push(drawCork);
  drawCork();
  mesh(new THREE.PlaneGeometry(2.3, 1.51), new THREE.MeshStandardMaterial({ map: corkTex, roughness: 0.95 }), 0, 0, 0.045, g, false);
  return g;
}

/* ---------- estantería ---------- */
function buildShelf() {
  const g = new THREE.Group();
  g.position.copy(SHELF);
  scene.add(g);
  const white = '#fff4ea';
  box(0.65, 3.65, 0.08, white, 0, 1.825, -1.01, g, 0.02);
  box(0.65, 3.65, 0.08, white, 0, 1.825, 1.01, g, 0.02);
  box(0.04, 3.6, 2.0, '#f6d9e6', -0.3, 1.8, 0, g, 0);
  for (const y of SHELF_Y) box(0.65, 0.07, 2.1, white, 0, y, 0, g, 0.02);

  const colors = ['#ff9fc3', '#b69cff', '#8fd3c8', '#ffd66b', '#ff9a8b', '#9bb7ff', '#f3e6ff', '#e58fb5', '#7fc8a9', '#fff1c1'];
  for (let s = 0; s < 4; s++) {
    const base = SHELF_Y[s] + 0.035;
    const limit = s === 1 ? 0.15 : s === 3 ? 0.25 : 0.95;
    let z = -0.95;
    while (true) {
      const bw = rr(0.08, 0.15);
      if (z + bw > limit) break;
      const bh = rr(0.46, 0.72);
      const bd = rr(0.38, 0.5);
      const b = mesh(new THREE.BoxGeometry(bd, bh, bw), colors[(rand() * colors.length) | 0], 0.3 - bd / 2, base + bh / 2, z + bw / 2, g);
      // bandita en el lomo
      if (rand() < 0.5) mesh(new THREE.BoxGeometry(0.005, 0.05, bw * 0.98), '#ffffff', 0.302, base + bh * 0.75, z + bw / 2, g, false);
      b.rotation.x = rand() < 0.1 ? 0.06 : 0;
      z += bw + (rand() < 0.15 ? 0.05 : 0.004);
    }
  }
  // diploma apoyado en la balda 2
  const dipTex = textTex(320, 240, (c, w, h) => {
    c.fillStyle = '#fffaf0'; c.fillRect(0, 0, w, h);
    c.strokeStyle = '#e0c08a'; c.lineWidth = 8; c.strokeRect(14, 14, w - 28, h - 28);
    c.fillStyle = '#2b2140'; c.textAlign = 'center';
    c.font = `600 60px ${FONT}`; c.fillText('🎓', w / 2, 102);
    c.font = `700 26px ${FONT}`; c.fillText('Universidad', w / 2, 150);
    c.fillText('de Sevilla · 2025', w / 2, 184);
  });
  const dip = new THREE.Group();
  dip.position.set(0.05, SHELF_Y[1] + 0.3, 0.58);
  dip.rotation.z = 0.12;
  g.add(dip);
  box(0.04, 0.48, 0.62, '#e0c08a', 0, 0, 0, dip, 0.015);
  const dm = new THREE.Mesh(new THREE.PlaneGeometry(0.54, 0.4), new THREE.MeshStandardMaterial({ map: dipTex, roughness: 0.8 }));
  dm.rotation.y = Math.PI / 2;
  dm.position.x = 0.022;
  dip.add(dm);
  // libros tumbados + vela en la balda 4
  ['#b69cff', '#ff9fc3', '#a9e5d9'].forEach((c, i) => {
    box(0.42, 0.08, 0.5 - i * 0.05, c, 0.05, SHELF_Y[3] + 0.075 + i * 0.08, 0.62, g, 0.01).rotation.y = (i - 1) * 0.12;
  });
  cyl(0.07, 0.07, 0.16, '#fff6e8', 0.05, SHELF_Y[3] + 0.4, 0.62, g, 14);
  const flame = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 6), new THREE.MeshBasicMaterial({ color: new THREE.Color(2.4, 1.5, 0.6) }));
  flame.material.userData.keep = true;
  flame.scale.y = 1.8;
  flame.position.set(0.05, SHELF_Y[3] + 0.52, 0.62);
  g.add(flame);
  // birrete de graduación y planta colgante arriba
  const top = SHELF_Y[4] + 0.035;
  cyl(0.17, 0.19, 0.13, '#2b2140', 0, top + 0.065, -0.45, g, 20);
  const board = box(0.5, 0.035, 0.5, '#2b2140', 0, top + 0.15, -0.45, g, 0.01);
  board.rotation.y = 0.5;
  cyl(0.008, 0.008, 0.3, '#ffd66b', 0.2, top + 0.02, -0.25, g, 4);
  sphere(0.03, '#ffd66b', 0.2, top - 0.13, -0.25, g);
  cyl(0.16, 0.13, 0.25, '#ffb3cf', 0.05, top + 0.125, 0.5, g, 16);
  for (const [dz, len] of [[0.42, 9], [0.6, 7]]) {
    for (let i = 0; i < len; i++) {
      sphere(0.06, i % 2 ? '#5fae7e' : '#73c08f', 0.28 + Math.sin(i * 0.7) * 0.03, top + 0.22 - i * 0.13, dz + Math.sin(i * 1.3) * 0.06, g, 1, 0.6, 1.3);
    }
  }
  return g;
}

/* ---------- interactivos ---------- */
const hotspotsEl = $('#hotspots');
function register(id, group, anchor, focus, icon, cls = '') {
  group.traverse((o) => {
    if (!o.isMesh) return;
    if (!o.material.userData?.keep) o.material = Array.isArray(o.material) ? o.material.map((m) => m.clone()) : o.material.clone();
    o.userData.interactive = id;
    pickables.push(o);
  });
  let el = null;
  if (icon) {
    el = document.createElement('button');
    el.type = 'button';
    el.className = `hs ${cls}`;
    el.innerHTML = `<span class="hs-icon">${icon}</span><span class="hs-label"></span>`;
    el.addEventListener('click', () => activate(id));
    el.addEventListener('mouseenter', () => setHover(id));
    el.addEventListener('mouseleave', () => setHover(null));
    hotspotsEl.appendChild(el);
  }
  interactives[id] = { id, group, anchor, focus, el };
}

const LABELS = { about: 'hsAbout', skills: 'hsSkills', experience: 'hsExperience', education: 'hsEducation', contact: 'hsContact', window: 'hsWindow' };
function updateHotspotLabels() {
  for (const it of Object.values(interactives)) {
    if (!it.el) continue;
    const key = it.id === 'lamp' ? (lampOn ? 'hsLampOff' : 'hsLampOn') : LABELS[it.id];
    it.el.querySelector('.hs-label').textContent = t(key);
    it.el.setAttribute('aria-label', t(key));
  }
}
function updateHotspotStates() {
  for (const it of Object.values(interactives)) it.el?.classList.toggle('active', currentSection?.id === it.id);
}

function setHover(id) {
  if (hovered === id) return;
  if (hovered) highlight(interactives[hovered].group, false);
  hovered = id;
  if (id) highlight(interactives[id].group, true);
  canvas.style.cursor = id ? 'pointer' : '';
}
function highlight(group, on) {
  group.traverse((o) => {
    if (!o.isMesh) return;
    for (const m of Array.isArray(o.material) ? o.material : [o.material]) {
      if (!m.emissive || m.userData.keep) continue;
      if (on) {
        m.userData.e ??= { c: m.emissive.clone(), i: m.emissiveIntensity };
        m.emissive.set('#ff8fc8');
        m.emissiveIntensity = 0.3;
      } else if (m.userData.e) {
        m.emissive.copy(m.userData.e.c);
        m.emissiveIntensity = m.userData.e.i;
      }
    }
  });
}

function activate(id) {
  if (id === 'lamp') toggleLamp();
  else if (id === 'window') makeWish();
  else if (id === 'cat') petCat();
  else openSection(id);
}
function openSection(id) {
  if (expressOpen) setExpress(false);
  if (!isNarrow()) hideGuide();
  showPanel(id);
  const f = interactives[id]?.focus;
  if (renderer && f) flyTo(f.pos, f.target, true);
}

function toggleLamp() {
  lampOn = !lampOn;
  store.set('lamp', lampOn ? 'on' : 'off');
  updateHotspotLabels();
}

function makeWish() {
  closePanel();
  const f = interactives.window.focus;
  const close = camera.position.distanceTo(f.pos) < 1.5;
  if (!close) flyTo(f.pos, f.target, false, 1.2);
  wishTimer = close ? 0.05 : 1.3;
}
function grantWish() {
  wishStar();
  const list = WISHES[lang];
  const idx = wishCount % list.length;
  wishCount++;
  showToast(t('wish', { n: idx + 1, total: list.length, text: list[idx] }), 4200, 'wish');
  if (wishCount === list.length) setTimeout(() => say('allWishes'), 4400);
}

function petCat() {
  catBounce = 1;
  showToast(t('meow'), 1400);
  say('intro');
}

/* ---------- cámara ---------- */
function homeView() {
  const target = V(-0.2, 1.9, -1.0);
  const dir = V(10.2, 6.6, 12.5).normalize();
  const aspect = innerWidth / innerHeight;
  const dist = aspect < 0.8 ? 30 : aspect < 1.3 ? 22 : 17.5;
  return { pos: target.clone().addScaledVector(dir, dist), target };
}
function shifted(pos, target) {
  const p = pos.clone(), tg = target.clone();
  const dir = tg.clone().sub(p).normalize();
  const dist = p.distanceTo(tg);
  if (isNarrow()) {
    const up = V(0, 1, 0);
    const right = dir.clone().cross(up).normalize();
    const camUp = right.clone().cross(dir).normalize();
    const off = camUp.multiplyScalar(-dist * 0.24);
    p.add(off); tg.add(off);
    p.add(dir.clone().multiplyScalar(-dist * 0.55));
  } else {
    const right = dir.clone().cross(V(0, 1, 0)).normalize().multiplyScalar(dist * 0.26);
    p.add(right); tg.add(right);
  }
  return { pos: p, target: tg };
}
function flyTo(pos, target, withPanel = false, dur = 1.4) {
  const dest = withPanel ? shifted(pos, target) : { pos, target };
  fly = { fromP: camera.position.clone(), fromT: controls.target.clone(), toP: dest.pos, toT: dest.target, t: 0, dur: reducedMotion ? 0.001 : dur };
  controls.enabled = false;
}
function goHome() {
  closePanel();
  if (expressOpen) setExpress(false);
  if (renderer) { HOME = homeView(); flyTo(HOME.pos, HOME.target); }
}

/* ---------- bucle ---------- */
const raycaster = new THREE.Raycaster();
const ndc = new THREE.Vector2();
const proj = new THREE.Vector3();
const tmpColor = new THREE.Color();

function pick(e) {
  const r = canvas.getBoundingClientRect();
  ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
  raycaster.setFromCamera(ndc, camera);
  const hit = raycaster.intersectObjects(pickables, false)[0];
  return hit ? hit.object.userData.interactive : null;
}

function updateHotspots() {
  const w = innerWidth, h = innerHeight;
  for (const it of Object.values(interactives)) {
    if (!it.el) continue;
    proj.copy(it.anchor).project(camera);
    const x = (proj.x * 0.5 + 0.5) * w;
    const y = (-proj.y * 0.5 + 0.5) * h;
    const hide = proj.z > 1 || x < -50 || x > w + 50 || y < -50 || y > h + 50;
    it.el.classList.toggle('hidden', hide);
    if (!hide) it.el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -100%)`;
  }
}

function tick(dt) {
  time += dt;

  if (fly) {
    fly.t += dt;
    const k = easeInOut(Math.min(1, fly.t / fly.dur));
    camera.position.lerpVectors(fly.fromP, fly.toP, k);
    controls.target.lerpVectors(fly.fromT, fly.toT, k);
    if (k >= 1) { fly = null; controls.enabled = true; }
  }
  controls.update();
  controls.target.x = clamp(controls.target.x, -4.5, 4.5);
  controls.target.y = clamp(controls.target.y, 0.3, 5);
  controls.target.z = clamp(controls.target.z, -4.6, 4.5);
  camera.position.x = Math.max(camera.position.x, -4.5);
  camera.position.z = Math.max(camera.position.z, -4.5);
  camera.position.y = Math.max(camera.position.y, 0.8);

  // luces: lámpara, luz del techo y bloom
  lampVal += ((lampOn ? 1 : 0) - lampVal) * Math.min(1, dt * 7);
  lightVal += ((lightsOn ? 1 : 0) - lightVal) * Math.min(1, dt * 4);
  lampLight.intensity = 6 * lampVal;
  lampShadeMat.emissiveIntensity = 0.08 + 1.4 * lampVal;
  lampBulbMat.color.setRGB(1, 0.85, 0.62).multiplyScalar(0.35 + 2.4 * lampVal);
  roomLight.intensity = 24 * lightVal;
  hemi.intensity = 0.9 + 0.5 * lightVal;
  bloomPass.strength = 0.62 - 0.3 * lightVal;
  // el haz se difumina si la cámara se mete dentro, para no velar la ventana
  const nearBeam = clamp((camera.position.distanceTo(WIN_CENTER) - 3) / 8, 0.2, 1);
  beamMat.opacity = 0.14 * nearBeam * (1 - 0.8 * lightVal);
  dust.material.opacity = 0.8 * (1 - 0.7 * lightVal);

  // guirnaldas que titilan
  for (let i = 0; i < bulbData.length; i++) {
    const b = bulbData[i];
    const k = 1.6 + Math.sin(time * b.speed + b.phase) * 0.7;
    bulbs.setColorAt(i, tmpColor.copy(b.color).multiplyScalar(k));
  }
  bulbs.instanceColor.needsUpdate = true;

  // neón con algún parpadeo ocasional
  const flicker = Math.sin(time * 0.7) > 0.985 && Math.sin(time * 40) > 0 ? 0.35 : 1;
  neonMat.color.setRGB(1, 0.3, 0.62).multiplyScalar(2.4 * flicker);
  neonLight.intensity = 2 * flicker;

  // la gata respira y sueña
  catBounce = Math.max(0, catBounce - dt * 2.5);
  const jump = Math.sin(catBounce * Math.PI) * 0.18;
  catBody.scale.set(1.25, 0.6 * (1 + Math.sin(time * 2.2) * 0.04), 1);
  cat.position.y = CAT_POS.y + jump;
  const headW = cat.localToWorld(V(0.32, 0.25, 0.18));
  zzz.forEach((s, i) => {
    const k = (time * 0.32 + i / 3) % 1;
    s.position.set(headW.x + k * 0.25, headW.y + 0.1 + k * 0.8, headW.z - k * 0.15);
    s.scale.setScalar(0.1 + k * 0.16);
    s.material.opacity = Math.sin(k * Math.PI) * 0.85;
  });

  // vapor de la taza
  for (const s of steam) {
    const k = (time * 0.28 + s.userData.phase) % 1;
    s.position.set(MUG_POS.x + Math.sin(k * 7 + s.userData.phase * 9) * 0.05, MUG_POS.y + 0.25 + k * 0.6, MUG_POS.z);
    s.scale.setScalar(0.08 + k * 0.22);
    s.material.opacity = Math.sin(k * Math.PI) * 0.28;
  }

  // polvo en el haz de luna
  const arr = dust.geometry.attributes.position.array;
  const base = dust.userData.base;
  for (let i = 0; i < arr.length; i += 3) {
    arr[i] = base[i] + Math.sin(time * 0.3 + i) * 0.08;
    arr[i + 1] = base[i + 1] + Math.sin(time * 0.22 + i * 0.7) * 0.1;
    arr[i + 2] = base[i + 2] + Math.cos(time * 0.25 + i) * 0.08;
  }
  dust.geometry.attributes.position.needsUpdate = true;
  starField.rotation.y = time * 0.004;

  // cursor del portátil y hora del móvil
  cursorTimer += dt;
  if (cursorTimer > 0.55) { cursorTimer = 0; cursorOn = !cursorOn; drawScreen(); }
  clockTimer += dt;
  if (clockTimer > 20) { clockTimer = 0; drawPhone(); }

  // estrellas fugaces
  nextStar -= dt;
  if (nextStar <= 0) { randomShootingStar(); nextStar = rr(5, 11); }
  if (wishTimer >= 0) {
    wishTimer -= dt;
    if (wishTimer < 0 && !fly) grantWish();
    else if (wishTimer < 0) wishTimer = 0.05;
  }
  for (const s of shooting) {
    if (!s.active) continue;
    s.t += dt;
    const k = s.t / s.dur;
    if (k >= 1) { s.active = false; s.mesh.visible = false; continue; }
    s.mesh.position.lerpVectors(s.from, s.to, k);
    s.mesh.material.opacity = Math.sin(k * Math.PI);
  }

  updateHotspots();
  composer.render();
}

function init3D() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(40, innerWidth / innerHeight, 0.1, 400);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight, false);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  HOME = homeView();
  camera.position.copy(HOME.pos);
  controls = new OrbitControls(camera, canvas);
  controls.target.copy(HOME.target);
  Object.assign(controls, {
    enableDamping: true, dampingFactor: 0.07, minDistance: 2.5, maxDistance: 32,
    maxPolarAngle: 1.4, minPolarAngle: 0.25, minAzimuthAngle: -0.05, maxAzimuthAngle: 1.62,
    rotateSpeed: 0.6, zoomSpeed: 0.8, panSpeed: 0.8,
  });
  controls.addEventListener('start', () => { fly = null; controls.enabled = true; });

  buildSky();
  buildLights();
  buildRoom();
  buildFairyLights();
  buildBed();
  buildCat();
  const diary = buildDiary();
  buildNightstand();
  const lamp = buildLamp();
  const phone = buildPhone();
  buildDesk();
  const laptop = buildLaptop();
  const board = buildCorkboard();
  const shelf = buildShelf();

  // el "cristal" de la ventana como objetivo clicable
  const winHit = new THREE.Mesh(new THREE.PlaneGeometry(WIN.x1 - WIN.x0, WIN.y1 - WIN.y0), new THREE.MeshBasicMaterial({ visible: false }));
  winHit.position.copy(WIN_CENTER).add(V(0, 0, -0.05));
  const winGroup = new THREE.Group();
  winGroup.add(winHit);
  scene.add(winGroup);

  register('about', diary, V(-2.95, 1.55, -2.05), { pos: V(0.6, 4.1, 1.3), target: V(-3.0, 1.2, -2.1) }, '📔');
  register('skills', laptop, V(2.6, 2.55, -4.35), { pos: V(3.3, 3.0, -0.8), target: V(2.65, 1.95, -4.3) }, '💻');
  register('experience', board, V(3.45, 4.42, -4.9), { pos: V(3.7, 3.55, 0.9), target: V(3.45, 3.35, -4.9) }, '📌');
  register('education', shelf, V(-4.6, 4.1, 1.4), { pos: V(0.4, 3.1, 2.9), target: V(-4.4, 1.9, 1.4) }, '📚');
  register('contact', phone, V(-1.15, 1.42, -4.15), { pos: V(0.5, 3.1, -1.4), target: V(-1.25, 1.15, -4.15) }, '📱');
  register('lamp', lamp, V(-1.85, 2.38, -4.6), null, '💡', 'toggle');
  register('window', winGroup, V(WIN_CENTER.x, WIN.y1 + 0.75, -4.9), { pos: V(3.2, 3.3, 3.8), target: V(WIN_CENTER.x, 3.1, -5) }, '🌠', 'wish');
  register('cat', cat, null, null, null);
  updateHotspotLabels();
  drawScreen();
  drawPhone();

  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  bloomPass = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.62, 0.55, 0.86);
  composer.addPass(bloomPass);
  composer.addPass(new OutputPass());
  composer.setPixelRatio(Math.min(devicePixelRatio, 2));
  composer.setSize(innerWidth, innerHeight);

  let down = null;
  canvas.addEventListener('pointerdown', (e) => { down = [e.clientX, e.clientY]; });
  canvas.addEventListener('pointerup', (e) => {
    if (!down) return;
    const moved = Math.hypot(e.clientX - down[0], e.clientY - down[1]);
    down = null;
    if (moved < 6) {
      const id = pick(e);
      if (id) activate(id);
    }
  });
  canvas.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'mouse' && !down) setHover(pick(e));
  });
  canvas.addEventListener('pointerleave', () => setHover(null));

  addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight, false);
    composer.setSize(innerWidth, innerHeight);
  });

  const clock = new THREE.Clock();
  renderer.setAnimationLoop(() => tick(Math.min(clock.getDelta(), 0.05)));
}

/* ════════════════════════════════════════════════════════════
   Arranque
   ════════════════════════════════════════════════════════════ */
applyLang();
const loader = $('#loader');
if (renderer) {
  init3D();
  document.fonts?.ready.then(() => { textureJobs.forEach((job) => job()); drawScreen(); drawPhone(); });
  setTimeout(() => {
    loader.classList.add('done');
    setTimeout(() => { if (!expressOpen && !currentSection) say('intro'); }, 500);
  }, 700);
} else {
  setExpress(true);
  $('#homeBtn').hidden = true;
  $('#expressBtn').hidden = true;
  $('#lightBtn').hidden = true;
  loader.classList.add('done');
  showToast(t('noWebgl'), 5000);
}
