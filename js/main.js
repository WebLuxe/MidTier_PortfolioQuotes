/* ==========================================================================
   WebLuxe template engine
   Builds the whole site from config.js (window.SITE). You should not need to
   edit this file to set up a new client: change config.js instead.
   ========================================================================== */
(() => {
'use strict';

const C = window.SITE || {};
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const enc = encodeURIComponent;
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
};
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const langs = (C.languages && C.languages.length) ? C.languages : ['en'];
let lang = (() => {
  const q = new URLSearchParams(location.search).get('lang');
  const pick = [q, store.get('wl-lang'), C.defaultLanguage, (navigator.language || 'en').slice(0, 2)].find((l) => l && langs.includes(l));
  return pick || langs[0];
})();
let T = {};

/* ---------- text helpers ---------- */
/** A config value can be plain text or { en: '...', fr: '...' }. */
const tx = (v) => (v == null ? '' : (typeof v === 'object' && !Array.isArray(v) && ('en' in v || 'fr' in v)) ? (v[lang] ?? v.en ?? '') : v);
const L = () => (C.text && (C.text[lang] || C.text.en)) || {};
/** Interface wording from config.text.<lang>, with {placeholders}. */
const ui = (k, vars = {}) => String(L()[k] ?? (C.text && C.text.en && C.text.en[k]) ?? '').replace(/\{(\w+)\}/g, (_, x) => (vars[x] ?? ''));
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
/** True when a config value is worth showing (not empty, not an empty list, not { en: '', fr: '' }). */
const has = (v) => {
  if (v == null || v === '' || v === false) return false;
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === 'object' && ('en' in v || 'fr' in v)) return tx(v) !== '';
  return true;
};
const digits = (s) => String(s || '').replace(/\D/g, '');

/* ---------- icons (inline SVG, no icon font to download) ---------- */
const P = {
  truck: '<path d="M1 3h15v13H1z"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>',
  box: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.27 6.96 12 12.01l8.73-5.05M12 22.08V12"/>',
  ship: '<path d="M2 20c2 1.3 4 1.3 6 0s4-1.3 6 0 4 1.3 6 0"/><path d="M4 17 3 12h18l-2 5"/><path d="M6 12V7h8v5M10 7V3h2"/>',
  plane: '<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
  warehouse: '<path d="M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35A2 2 0 0 1 3.26 6.5l8-3.2a2 2 0 0 1 1.48 0l8 3.2A2 2 0 0 1 22 8.35Z"/><path d="M6 18h12M6 14h12M6 22V10h12v12"/>',
  doc: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  handshake: '<path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-2M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3M3 4h8"/>',
  chart: '<path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M18 6 6 18M6 6l12 12"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
  moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
  arrow: '<path d="M5 12h14M12 5l7 7-7 7"/>',
  chevL: '<path d="m15 18-6-6 6-6"/>',
  chevR: '<path d="m9 18 6-6-6-6"/>',
  chevD: '<path d="m6 9 6 6 6-6"/>',
  star: '<path fill="currentColor" stroke="none" d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  award: '<circle cx="12" cy="8" r="6"/><path d="M15.48 12.89 17 22l-5-3-5 3 1.52-9.11"/>',
  home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
  tool: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
  ruler: '<path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z"/><path d="m14.5 12.5 2-2M11.5 9.5l2-2M8.5 6.5l2-2M17.5 15.5l2-2"/>',
  sparkle: '<path d="m12 3 1.9 5.8L20 10l-6.1 1.2L12 17l-1.9-5.8L4 10l6.1-1.2z"/><path d="M19 17v4M17 19h4"/>',
  camera: '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
  heart: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/>',
  leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6"/>',
  paint: '<path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"/><path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z"/>',
  quote: '<path fill="currentColor" stroke="none" d="M7.17 6A5.17 5.17 0 0 0 2 11.17V18h6.83v-6.83H5.41A1.76 1.76 0 0 1 7.17 9.4zm10 0A5.17 5.17 0 0 0 12 11.17V18h6.83v-6.83h-3.42A1.76 1.76 0 0 1 17.17 9.4z"/>',
  bed: '<path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9"/>',
  snow: '<path d="M2 12h20M12 2v20M20 16l-4-4 4-4M4 8l4 4-4 4M16 4l-4 4-4-4M8 20l4-4 4 4"/>',
  wave: '<path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>',
  wifi: '<path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/>',
  coffee: '<path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3"/>',
  pool: '<path d="M2 20c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1M2 16c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1M8 14V5a2 2 0 0 1 4 0M16 14V5a2 2 0 0 0-4 0M8 9h8"/>',
  car: '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>',
  gear: '<circle cx="6" cy="6" r="2"/><circle cx="12" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="12" cy="18" r="2"/><path d="M6 8v8M12 8v8M18 8v4H6"/>',
  fuel: '<path d="M3 22h12M4 9h10M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2 2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5"/>',
  anchor: '<circle cx="12" cy="5" r="3"/><path d="M12 22V8M5 12H2a10 10 0 0 0 20 0h-3"/>',
  compass: '<circle cx="12" cy="12" r="10"/><path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36z"/>',
  fish: '<path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 3.37 7 6-.94 2.65-3.44 6-7 6s-7.56-2.54-8.5-6Z"/><path d="M18 12v.5M16 17.93a9.77 9.77 0 0 1 0-11.86M7 10.67C7 8 5.58 5.97 2.73 5.5c-1 1.5-1 5 .23 6.5-1.24 1.5-1.24 5-.23 6.5C5.58 18.03 7 16 7 13.33"/>',
  bag: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18M16 10a4 4 0 0 1-8 0"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
  tag: '<path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><path d="M7 7h.01"/>',
  key: '<circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6M15.5 7.5l3 3L22 7l-3-3"/>',
  eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
  zoom: '<path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  send: '<path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/>',
  wa: '<path fill="currentColor" stroke="none" d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.32l-.34-.2-3.57.94.95-3.48-.22-.36a9.43 9.43 0 0 1-1.45-5.03c0-5.2 4.24-9.44 9.45-9.44a9.4 9.4 0 0 1 6.68 2.77 9.37 9.37 0 0 1 2.76 6.68c0 5.21-4.24 9.44-9.45 9.44zm8.04-17.48A11.3 11.3 0 0 0 12.04.7C5.78.7.68 5.8.68 12.06c0 2 .52 3.96 1.52 5.68L.6 23.62l6.03-1.58a11.33 11.33 0 0 0 5.42 1.38h.01c6.26 0 11.36-5.1 11.36-11.36 0-3.04-1.18-5.89-3.33-8.04z"/>',
  facebook: '<path fill="currentColor" stroke="none" d="M14 8h3V4h-3c-2.8 0-4 1.8-4 4.3V10H7v4h3v8h4v-8h3l1-4h-4V8.6c0-.4.3-.6.6-.6z"/>',
  instagram: '<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
  linkedin: '<path fill="currentColor" stroke="none" d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3zM9.5 9.5h3.8v1.6h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.2c0-1.3 0-2.9-1.8-2.9s-2 1.4-2 2.8V21h-4z"/>',
  tiktok: '<path fill="currentColor" stroke="none" d="M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.7a5.7 5.7 0 1 0 4.9 5.7V9.1a7.4 7.4 0 0 0 4.3 1.4V7.4a4.3 4.3 0 0 1-3.2-1.6z"/>',
  youtube: '<path fill="currentColor" stroke="none" d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12a31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8zM9.8 15.1V8.9l5.7 3.1z"/>',
  tripadvisor: '<circle cx="7" cy="13.5" r="3.5"/><circle cx="17" cy="13.5" r="3.5"/><path d="M2 9h3.5C7.3 7.7 9.5 7 12 7s4.7.7 6.5 2H22l-1.5 2M3.5 11 2 9M12 7v10l-1.5-1.5M12 17l1.5-1.5"/>',
  google: '<path fill="currentColor" stroke="none" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.4zM12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22zM6.4 14c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V7.4H3.1a10 10 0 0 0 0 9.2zM12 6c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 0 0 3.1 7.4L6.4 10C7.2 7.8 9.4 6 12 6z"/>',
};
const icon = (n, cls = '') => `<svg class="i ${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${P[n] || P.check}</svg>`;

/* ---------- images: Unsplash links get sizes for every screen; your own files are used as they are ---------- */
const isUns = (s) => /images\.unsplash\.com/.test(s || '');
const sized = (s, w) => (isUns(s) ? s.replace(/([?&])w=\d+/, '$1').replace(/[?&]$/, '') + (s.includes('?') ? '&' : '?') + 'w=' + w : s);
const imgOf = (x) => (typeof x === 'string' ? { src: x } : (x || {}));
function pic(x, { sizes = '100vw', eager = false, cls = '', w = 1200 } = {}) {
  const i = imgOf(x);
  if (!i.src) return '';
  const set = isUns(i.src) ? [360, 560, 800, 1100, 1500, 2000].filter((n) => n <= Math.max(w * 1.7, 560)).map((n) => `${sized(i.src, n)} ${n}w`).join(', ') : '';
  return `<img class="${cls}" src="${esc(sized(i.src, w))}"${set ? ` srcset="${esc(set)}" sizes="${sizes}"` : ''} alt="${esc(tx(i.alt))}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
}

/** Photos after the first in a slideshow load once the page has finished loading. */
const later = (html, i) => (i ? html.replace(' src=', ' data-src=').replace(' srcset=', ' data-srcset=') : html);
function loadLater() {
  const go = () => $$('img[data-src]').forEach((im) => { if (im.dataset.srcset) im.srcset = im.dataset.srcset; im.src = im.dataset.src; im.removeAttribute('data-src'); });
  if (document.readyState === 'complete') setTimeout(go, 600); else addEventListener('load', () => setTimeout(go, 600), { once: true });
}

/* ---------- brand: colours and fonts from config become CSS variables ---------- */
function readable(hex) {
  const h = digits(hex) ? String(hex).replace('#', '') : '';
  if (h.length !== 6) return '#ffffff';
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return (L + 0.05) / 0.057 >= 1.05 / (L + 0.05) ? '#10141a' : '#ffffff';
}
function applyBrand() {
  const st = document.documentElement.style, c = C.colors || {};
  for (const k of ['primary', 'accent', 'dark', 'light']) if (c[k]) st.setProperty('--' + k, c[k]);
  st.setProperty('--on-primary', readable(c.primary));
  st.setProperty('--on-accent', readable(c.accent));
  const f = C.fonts || {};
  const fam = [[f.heading, f.headingWeights || '500;600;700'], [f.body, f.bodyWeights || '400;500;600;700'], [f.script, f.scriptWeights || '500']].filter(([n]) => n);
  if (fam.length) {
    const uniq = [...new Map(fam.map(([n, w]) => [n, w])).entries()];
    const href = 'https://fonts.googleapis.com/css2?' + uniq.map(([n, w]) => `family=${enc(n).replace(/%20/g, '+')}:wght@${w}`).join('&') + '&display=swap';
    const have = $('#wl-fonts');
    if (!have) document.head.append(Object.assign(document.createElement('link'), { id: 'wl-fonts', rel: 'stylesheet', href }));
    else { if (have.href !== href) have.href = href; if (have.rel === 'preload') { have.onload = null; have.addEventListener('load', () => { have.rel = 'stylesheet'; }, { once: true }); } }
  }
  if (f.heading) st.setProperty('--font-head', `"${f.heading}", ${f.headingFallback || 'system-ui, sans-serif'}`);
  if (f.script) st.setProperty('--font-script', `"${f.script}", cursive`);
  if (f.body) st.setProperty('--font-body', `"${f.body}", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`);
}

/* ---------- opening hours ---------- */
const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const toMin = (s) => { const [h, m] = String(s).trim().split(':'); return (+h) * 60 + (+m || 0); };
function nowThere() {
  try {
    const p = new Intl.DateTimeFormat('en-GB', { timeZone: C.timeZone || undefined, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
    const g = (t) => (p.find((x) => x.type === t) || {}).value;
    return { day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(g('weekday')), min: (+g('hour')) * 60 + (+g('minute')) };
  } catch { const d = new Date(); return { day: d.getDay(), min: d.getHours() * 60 + d.getMinutes() }; }
}
const hoursFor = (d) => { const v = (C.hours || {})[DAY_KEYS[d]]; return v && String(v).includes('-') ? String(v).split('-').map((s) => s.trim()) : null; };
function openNow() {
  if (!C.hours) return null;
  const n = nowThere(), h = hoursFor(n.day);
  if (h && n.min >= toMin(h[0]) && n.min < toMin(h[1])) return { open: true, until: h[1] };
  for (let k = 0; k < 7; k++) {
    const d = (n.day + k) % 7, x = hoursFor(d);
    if (x && (k > 0 || n.min < toMin(x[0]))) return { open: false, day: k === 0 ? ui('today') : k === 1 ? ui('tomorrow') : (L().days || [])[d], at: x[0] };
  }
  return { open: false };
}
/** Monday to Sunday, with days that share the same hours grouped: "Mon – Fri 08:00 – 17:00". */
function hoursGroups() {
  const order = [1, 2, 3, 4, 5, 6, 0], out = [];
  for (const d of order) {
    const h = hoursFor(d), val = h ? `${h[0]} – ${h[1]}` : ui('closed');
    const last = out[out.length - 1];
    if (last && last.val === val) { last.to = d; } else out.push({ from: d, to: d, val, closed: !h });
  }
  const short = L().daysShort || L().days || DAY_KEYS;
  return out.map((g) => ({ label: g.from === g.to ? short[g.from] : `${short[g.from]} – ${short[g.to]}`, val: g.val, closed: g.closed, today: (() => { const t = nowThere().day; const a = order.indexOf(g.from), b = order.indexOf(g.to), x = order.indexOf(t); return x >= a && x <= b; })() }));
}
function hoursTable(cls = 'hours') {
  if (!C.hours) return '';
  return `<table class="${cls}"><tbody>${hoursGroups().map((g) => `<tr${g.today ? ' class="is-today"' : ''}><th scope="row">${esc(g.label)}</th><td>${esc(g.val)}</td></tr>`).join('')}</tbody></table>`;
}
function openBadge() {
  const s = openNow();
  if (!s) return '';
  const msg = s.open ? ui('openUntil', { time: s.until }) : s.at ? ui('closedOpens', { day: s.day, time: s.at }) : ui('closed');
  return `<p class="open-badge${s.open ? ' is-open' : ''}"><span></span>${esc(msg)}</p>`;
}

/* ---------- contact links ---------- */
const K = () => C.contact || {};
const telHref = (p) => 'tel:' + (String(p).trim().startsWith('+') ? '+' : '') + digits(p);
const waHref = (text) => (digits(K().whatsapp) ? `https://wa.me/${digits(K().whatsapp)}${text ? '?text=' + enc(text) : ''}` : '');
const mailHref = (subject = '', body = '') => (K().email ? `mailto:${K().email}${subject || body ? '?' + [subject && 'subject=' + enc(subject), body && 'body=' + enc(body)].filter(Boolean).join('&') : ''}` : '');
const addressLines = () => [K().street, [K().city, K().region].filter(Boolean).join(', '), K().country].filter(has).map(tx);
const mapsLink = () => (K().mapsLink || `https://www.google.com/maps/search/?api=1&query=${enc(addressLines().join(', ') || C.name)}`);

/* ---------- header, footer, demo strip, WhatsApp button ---------- */
function logo(cls = '') {
  const lg = C.logo || {};
  const inner = lg.image
    ? `<img src="${esc(lg.image)}" alt="${esc(C.name)}" class="logo-img"${lg.height ? ` style="height:${+lg.height}px"` : ''}>`
    : `<span class="logo-mark" aria-hidden="true">${esc(lg.mark || (C.name || 'W').trim()[0])}</span><span class="logo-name">${esc(lg.text || C.name)}</span>`;
  return `<a class="logo ${cls}" href="${T.homeHref || './'}" >${inner}</a>`;
}
function demoStrip() {
  const d = C.demo;
  if (!d || !d.enabled) return '';
  const tiers = (d.tiers || []).map((x) => `<a href="${esc(x.url)}"${x.current ? ' aria-current="true"' : ''}><b>${esc(tx(x.label))}</b>${x.price ? `<span>${esc(x.price)}</span>` : ''}</a>`).join('');
  return `<aside class="demo-strip" aria-label="${esc(ui('demoLabel'))}"><p><b>${esc(ui('demoBadge'))}</b><span>${esc(tx(d.note) || ui('demoNote'))}</span></p>${tiers ? `<nav>${tiers}</nav>` : ''}</aside>`;
}
function header(page) {
  const items = T.nav();
  const links = items.map((n) => `<a href="${esc(n.href)}"${n.key === page ? ' aria-current="page"' : ''} data-key="${esc(n.key)}">${esc(n.label)}</a>`).join('');
  const other = langs[(langs.indexOf(lang) + 1) % langs.length];
  const langBtn = langs.length > 1 ? `<button class="hd-btn hd-lang" type="button" data-lang="${other}" aria-label="${other.toUpperCase()}: ${esc(ui('switchLang'))}">${other.toUpperCase()}</button>` : '';
  const themeBtn = C.darkMode !== false ? `<button class="hd-btn hd-theme" type="button" data-theme-toggle aria-label="${esc(ui('toggleTheme'))}">${icon('moon', 'i-moon')}${icon('sun', 'i-sun')}</button>` : '';
  const cta = T.headerCta ? T.headerCta() : '';
  return `<a class="skip" href="#main">${esc(ui('skip'))}</a>
${demoStrip()}
<header class="hd${T.overlayHeader ? ' hd-over' : ''}" data-hd>
  <div class="hd-in">
    ${logo()}
    <nav class="hd-nav" aria-label="${esc(ui('menu'))}">${links}</nav>
    <div class="hd-tools">${langBtn}${themeBtn}${cta}
      <button class="hd-btn hd-burger" type="button" aria-expanded="false" aria-controls="menu" data-burger><span></span><span></span><span></span><b class="sr">${esc(ui('menu'))}</b></button>
    </div>
  </div>
  <div class="menu" id="menu" data-menu><nav aria-label="${esc(ui('menu'))}">${links}</nav>${T.menuExtra ? T.menuExtra() : ''}</div>
</header>`;
}
const SOCIAL = ['facebook', 'instagram', 'linkedin', 'tiktok', 'youtube', 'tripadvisor', 'google'];
function socialLinks(cls = 'social') {
  const s = C.social || {};
  const a = SOCIAL.filter((k) => has(s[k])).map((k) => `<a href="${esc(s[k])}" target="_blank" rel="noopener" aria-label="${k[0].toUpperCase() + k.slice(1)}">${icon(k)}</a>`).join('');
  return a ? `<p class="${cls}">${a}</p>` : '';
}
function footer() {
  const k = K(), cr = C.credit || { name: 'WebLuxe', url: 'https://webluxe.github.io/WebLuxe/' };
  const contact = [
    has(k.phone) && `<a href="${telHref(k.phone)}">${icon('phone')}${esc(k.phone)}</a>`,
    has(k.email) && `<a href="${mailHref()}">${icon('mail')}${esc(k.email)}</a>`,
    waHref() && `<a href="${waHref(tx(k.whatsappMessage))}" target="_blank" rel="noopener">${icon('wa')}WhatsApp</a>`,
  ].filter(Boolean).join('');
  const addr = addressLines();
  return `<footer class="ft">
  <div class="wrap ft-in">
    <div class="ft-brand">${logo('logo-ft')}${has(C.tagline) ? `<p>${esc(tx(C.tagline))}</p>` : ''}${socialLinks()}</div>
    ${T.footerLinks ? `<nav class="ft-col" aria-label="${esc(ui('footerNav'))}"><h2>${esc(ui('explore'))}</h2>${T.footerLinks()}</nav>` : ''}
    ${contact || addr.length ? `<div class="ft-col"><h2>${esc(ui('contactTitle'))}</h2>${addr.length ? `<address><a href="${esc(mapsLink())}" target="_blank" rel="noopener">${icon('pin')}<span>${addr.map(esc).join('<br>')}</span></a></address>` : ''}${contact}</div>` : ''}
    ${C.hours ? `<div class="ft-col"><h2>${esc(ui('hoursTitle'))}</h2>${hoursTable('hours hours-ft')}</div>` : ''}
  </div>
  <div class="wrap ft-base">
    <p>© <span data-year>${new Date().getFullYear()}</span> ${esc(C.legalName || C.name)}. ${esc(ui('rights'))}</p>
    <p><a class="credit" href="${esc(cr.url)}" target="_blank" rel="noopener">${esc(ui('websiteBy'))} <b>${esc(cr.name)}</b></a></p>
  </div>
</footer>`;
}
function fab() {
  const h = waHref(tx(K().whatsappMessage));
  return h ? `<a class="fab" href="${h}" target="_blank" rel="noopener" aria-label="${esc(ui('whatsappUs'))}">${icon('wa')}<span class="fab-tip">${esc(ui('whatsappUs'))}</span></a>` : '';
}

/* ---------- SEO: title, description, Open Graph and schema.org data from config ---------- */
function setMeta(page) {
  const s = C.seo || {};
  const pageTitle = T.pageTitle ? T.pageTitle(page) : '';
  const title = pageTitle ? `${pageTitle} | ${C.name}` : (tx(s.title) || C.name);
  const desc = (T.pageDescription && T.pageDescription(page)) || tx(s.description) || tx(C.tagline);
  document.title = title;
  const meta = (attr, key, val) => {
    if (!val) return;
    let m = document.head.querySelector(`meta[${attr}="${key}"]`);
    if (!m) { m = document.createElement('meta'); m.setAttribute(attr, key); document.head.append(m); }
    m.setAttribute('content', val);
  };
  meta('name', 'description', desc);
  meta('property', 'og:title', title);
  meta('property', 'og:description', desc);
  meta('property', 'og:site_name', C.name);
  meta('property', 'og:locale', lang === 'fr' ? 'fr_FR' : 'en_GB');
  if (s.image) meta('property', 'og:image', sized(imgOf(s.image).src, 1200));
  meta('name', 'theme-color', (C.colors || {}).primary);
  if (s.favicon && !$('link[rel="icon"][data-wl]')) document.head.append(Object.assign(document.createElement('link'), { rel: 'icon', href: s.favicon }));
  if (s.favicon) { const f = $('link[rel="icon"]'); if (f) f.href = s.favicon; }
  if (C.demo && C.demo.enabled && !$('meta[name="robots"]')) meta('name', 'robots', 'noindex');
  document.documentElement.lang = lang;
}
function businessSchema() {
  const k = K(), s = C.social || {};
  const spec = C.hours ? [1, 2, 3, 4, 5, 6, 0].map((d) => { const h = hoursFor(d); return h && { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d], opens: h[0], closes: h[1] }; }).filter(Boolean) : undefined;
  const o = {
    '@context': 'https://schema.org', '@type': (C.seo && C.seo.schemaType) || 'LocalBusiness', name: C.name,
    description: tx((C.seo || {}).description) || tx(C.tagline) || undefined,
    url: (C.seo && C.seo.siteUrl) || location.origin + location.pathname.replace(/[^/]*$/, ''),
    image: (C.seo && C.seo.image) ? sized(imgOf(C.seo.image).src, 1200) : undefined,
    logo: (C.logo && C.logo.image) ? new URL(C.logo.image, location.href).href : undefined,
    telephone: k.phone || undefined, email: k.email || undefined,
    address: addressLines().length ? { '@type': 'PostalAddress', streetAddress: tx(k.street) || undefined, addressLocality: tx(k.city) || undefined, addressRegion: tx(k.region) || undefined, postalCode: k.postalCode || undefined, addressCountry: k.countryCode || tx(k.country) || undefined } : undefined,
    geo: k.lat ? { '@type': 'GeoCoordinates', latitude: k.lat, longitude: k.lng } : undefined,
    openingHoursSpecification: spec && spec.length ? spec : undefined,
    sameAs: SOCIAL.map((x) => s[x]).filter(has),
    priceRange: (C.seo && C.seo.priceRange) || undefined,
  };
  return o;
}
function setSchema() {
  let el = $('#wl-schema');
  if (!el) { el = Object.assign(document.createElement('script'), { id: 'wl-schema', type: 'application/ld+json' }); document.head.append(el); }
  const base = businessSchema();
  el.textContent = JSON.stringify(T.schema ? T.schema(base) : base);
}

/* ---------- the pop-up used by the demo, forms and confirmations ---------- */
function dialog(title, body, actions = '') {
  let d = $('#wl-dialog');
  if (!d) {
    d = document.createElement('dialog');
    d.id = 'wl-dialog'; d.className = 'dlg';
    document.body.append(d);
    d.addEventListener('click', (e) => { if (e.target === d || e.target.closest('[data-close]')) d.close(); });
  }
  d.innerHTML = `<div class="dlg-in"><button class="dlg-x" type="button" data-close aria-label="${esc(ui('close'))}">${icon('close')}</button><h2>${esc(title)}</h2>${body}<div class="dlg-actions">${actions}<button class="btn btn-primary" type="button" data-close>${esc(ui('ok'))}</button></div></div>`;
  d.showModal();
}
const demoOn = () => !!(C.demo && C.demo.enabled);
function demoShow(kind, text) {
  const what = { wa: ui('demoWa'), tel: ui('demoTel'), mail: ui('demoMail'), form: ui('demoForm') }[kind] || '';
  const studio = C.demo && digits(C.demo.studioWhatsapp) ? `<a class="btn btn-wa" href="https://wa.me/${digits(C.demo.studioWhatsapp)}?text=${enc(ui('demoStudioMsg', { site: C.name }))}" target="_blank" rel="noopener" data-real>${icon('wa')}${esc(ui('demoStudio'))}</a>` : '';
  dialog(ui('demoTitle'), `<p>${esc(what)}</p>${text ? `<pre class="dlg-msg">${esc(text)}</pre>` : ''}`, studio);
}

/* ---------- forms: send to the endpoint in config, or fall back to email ---------- */
function formSummary(form) {
  const lines = [];
  for (const el of form.elements) {
    if (!el.name || el.type === 'file' || el.type === 'submit' || el.type === 'hidden' || el.name.startsWith('_')) continue;
    if ((el.type === 'checkbox' || el.type === 'radio') && !el.checked) continue;
    const v = el.tagName === 'SELECT' ? el.options[el.selectedIndex]?.text : el.value;
    if (!v) continue;
    const lab = el.closest('label')?.querySelector('.lbl')?.textContent || el.dataset.label || el.name;
    lines.push(`${lab}: ${v}`);
  }
  return lines.join('\n');
}
async function sendForm(form, { subject = '', summary = '' } = {}) {
  if (!form.reportValidity()) return false;
  const status = $('[data-status]', form), btn = $('[type="submit"]', form);
  const body = summary || formSummary(form);
  const show = (cls, msg) => { if (status) { status.className = 'form-status ' + cls; status.textContent = msg; status.hidden = false; } };
  if (demoOn()) { demoShow('form', body); show('ok', ui('formDemoDone')); return true; }
  const endpoint = (C.form || {}).endpoint;
  if (endpoint) {
    btn && (btn.disabled = true); show('wait', ui('formSending'));
    try {
      const fd = new FormData(form);
      if (subject) fd.append('_subject', subject);
      const r = await fetch(endpoint, { method: 'POST', body: fd, headers: { Accept: 'application/json' } });
      if (!r.ok) throw new Error(r.status);
      form.reset(); show('ok', ui('formSent')); return true;
    } catch {
      show('err', ui('formError', { phone: K().phone || K().email || '' })); return false;
    } finally { btn && (btn.disabled = false); }
  }
  const m = mailHref(subject, body);
  if (m) { location.href = m; show('ok', ui('formMailto')); return true; }
  show('err', ui('formError', { phone: K().phone || '' }));
  return false;
}

/* ---------- motion: things arrive as you scroll, numbers count up ---------- */
let io;
function reveal() {
  const els = $$('[data-reveal]');
  if (reduced || !('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('in')); return; }
  io && io.disconnect();
  io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  els.forEach((e) => { if (!e.classList.contains('in')) io.observe(e); });
}
function countUp() {
  const els = $$('[data-count]');
  const run = (el) => {
    const end = parseFloat(el.dataset.count), dec = (String(el.dataset.count).split('.')[1] || '').length;
    if (reduced) { el.textContent = end.toLocaleString('en-US', { minimumFractionDigits: dec }); return; }
    const t0 = performance.now(), dur = 1600;
    const step = (t) => { const p = Math.min(1, (t - t0) / dur), v = end * (1 - Math.pow(1 - p, 3)); el.textContent = v.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  };
  if (!('IntersectionObserver' in window)) { els.forEach(run); return; }
  const o = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { run(e.target); o.unobserve(e.target); } }), { threshold: 0.5 });
  els.forEach((e) => o.observe(e));
}

/* ---------- full-screen photos: swipe on phones, arrow keys on computers ---------- */
function lightbox(items, start = 0) {
  let i = start, d = $('#wl-lb');
  if (!d) {
    d = document.createElement('dialog'); d.id = 'wl-lb'; d.className = 'lb';
    d.innerHTML = `<button class="lb-x" type="button" data-lb-x aria-label="${esc(ui('close'))}">${icon('close')}</button><button class="lb-nav lb-prev" type="button" data-lb-prev aria-label="${esc(ui('prev'))}">${icon('chevL')}</button><figure class="lb-fig"><img alt=""><figcaption></figcaption></figure><button class="lb-nav lb-next" type="button" data-lb-next aria-label="${esc(ui('next'))}">${icon('chevR')}</button><p class="lb-n" aria-live="polite"></p>`;
    document.body.append(d);
  }
  const img = $('img', d), cap = $('figcaption', d), n = $('.lb-n', d);
  const show = (k, dir = 0) => {
    i = (k + items.length) % items.length;
    const it = items[i];
    img.classList.remove('lb-in'); void img.offsetWidth;
    img.style.setProperty('--dx', dir * 40 + 'px');
    img.src = sized(imgOf(it.src || it).src, 1600); img.alt = tx(it.alt) || '';
    img.classList.add('lb-in');
    cap.textContent = tx(it.caption) || ''; n.textContent = `${i + 1} / ${items.length}`;
    [i + 1, i - 1].forEach((x) => { const p = items[(x + items.length) % items.length]; if (p) new Image().src = sized(imgOf(p.src || p).src, 1600); });
  };
  d.onclick = (e) => { if (e.target.closest('[data-lb-x]') || e.target === d) d.close(); else if (e.target.closest('[data-lb-prev]')) show(i - 1, -1); else if (e.target.closest('[data-lb-next]')) show(i + 1, 1); };
  d.onkeydown = (e) => { if (e.key === 'ArrowRight') show(i + 1, 1); if (e.key === 'ArrowLeft') show(i - 1, -1); };
  let x0 = null;
  d.onpointerdown = (e) => { x0 = e.clientX; };
  d.onpointerup = (e) => { if (x0 == null) return; const dx = e.clientX - x0; x0 = null; if (Math.abs(dx) > 45) show(i + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1); };
  $$('.lb-nav', d).forEach((b) => (b.hidden = items.length < 2));
  show(start);
  d.showModal();
}

/* ---------- a row of slides you can swipe, that also moves on its own ---------- */
function carousel(root, { auto = 5500 } = {}) {
  const track = $('[data-track]', root), slides = $$('[data-slide]', root), dots = $('[data-dots]', root);
  if (!track || slides.length < 2) return;
  let i = 0, timer, paused = false;
  if (dots) {
    dots.innerHTML = slides.map((_, k) => `<button type="button" aria-label="${esc(ui('slide', { n: k + 1 }))}"${k === 0 ? ' aria-current="true"' : ''}></button>`).join('');
    dots.onclick = (e) => { const b = e.target.closest('button'); if (b) go([...dots.children].indexOf(b)); };
  }
  const go = (k) => { i = (k + slides.length) % slides.length; track.scrollTo({ left: slides[i].offsetLeft - track.offsetLeft, behavior: reduced ? 'auto' : 'smooth' }); };
  const mark = () => { const x = track.scrollLeft; let best = 0; slides.forEach((s, k) => { if (Math.abs(s.offsetLeft - track.offsetLeft - x) < Math.abs(slides[best].offsetLeft - track.offsetLeft - x)) best = k; }); i = best; if (dots) [...dots.children].forEach((b, k) => b.toggleAttribute('aria-current', k === i)); };
  track.addEventListener('scroll', () => { clearTimeout(track._t); track._t = setTimeout(mark, 80); }, { passive: true });
  $('[data-prev]', root)?.addEventListener('click', () => go(i - 1));
  $('[data-next]', root)?.addEventListener('click', () => go(i + 1));
  if (auto && !reduced) {
    ['pointerdown', 'focusin', 'mouseenter'].forEach((ev) => root.addEventListener(ev, () => { paused = true; }));
    root.addEventListener('mouseleave', () => { paused = false; });
    let visible = false;
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(root);
    timer = setInterval(() => { if (!paused && visible && !document.hidden) go(i + 1); }, auto);
  }
}

/* ---------- wiring that every page needs ---------- */
function wireCore() {
  const hd = $('[data-hd]'), burger = $('[data-burger]'), menu = $('[data-menu]');
  const onScroll = () => hd && hd.classList.toggle('is-scrolled', scrollY > 24);
  onScroll();
  window.onscroll = null;
  addEventListener('scroll', onScroll, { passive: true });
  const setMenu = (open) => {
    burger.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('open', open);
    document.documentElement.classList.toggle('menu-open', open);
  };
  burger?.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  menu?.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu?.classList.contains('open')) { setMenu(false); burger.focus(); } });
  $$('[data-lang]').forEach((b) => b.addEventListener('click', () => {
    lang = b.dataset.lang; store.set('wl-lang', lang);
    const y = scrollY; render(); scrollTo(0, y);
  }));
  $$('[data-theme-toggle]').forEach((b) => b.addEventListener('click', () => {
    const dark = document.documentElement.dataset.theme !== 'dark';
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    store.set('wl-theme', dark ? 'dark' : 'light');
  }));
  $$('[data-year]').forEach((e) => { e.textContent = new Date().getFullYear(); });
  $$('[data-map]').forEach((m) => m.addEventListener('click', () => {
    m.outerHTML = `<div class="${esc(m.className)}"><iframe src="${esc(m.dataset.map)}" title="${esc(ui('mapTitle'))}" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div>`;
  }, { once: true }));
}
let demoWired = false;
function wireDemo() {
  if (demoWired || !demoOn()) return;
  demoWired = true;
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a || a.hasAttribute('data-real')) return;
    const h = a.getAttribute('href');
    if (/^https:\/\/wa\.me\//.test(h)) { e.preventDefault(); demoShow('wa', new URL(h).searchParams.get('text') || ''); }
    else if (h.startsWith('tel:')) { e.preventDefault(); demoShow('tel', h.slice(4)); }
    else if (h.startsWith('mailto:')) { e.preventDefault(); demoShow('mail', decodeURIComponent((h.split('body=')[1] || '').split('&')[0])); }
  }, true);
}

/** A section heading block used by every tier. */
const head = (eyebrow, title, lead = '', cls = '') => `<header class="sec-head ${cls}" data-reveal>${has(eyebrow) ? `<p class="eyebrow">${esc(tx(eyebrow))}</p>` : ''}<h2 class="h2">${esc(tx(title))}</h2>${has(lead) ? `<p class="lead">${esc(tx(lead))}</p>` : ''}</header>`;
/** A map that only loads when tapped (keeps the page fast). */
const mapBox = (cls = 'map') => (has(K().mapEmbed) ? `<button type="button" class="${cls}" data-map="${esc(K().mapEmbed)}" aria-label="${esc(ui('showMap'))}"><span class="map-btn">${icon('pin')}${esc(ui('showMap'))}</span></button>` : '');

/* ---------- page changes: a cover sweeps in with the next page's name, the page opens under it, the cover leaves ---------- */
const TX_KEY = 'wl-tx';
const txOn = () => !!T.transitions && !reduced && (C.transitions !== false);
function txEl() {
  let el = $('#wl-tx');
  if (!el) {
    el = document.createElement('div'); el.id = 'wl-tx'; el.className = 'tx'; el.setAttribute('aria-hidden', 'true');
    el.innerHTML = `<div class="tx-body"><span class="tx-mark">${esc((C.logo || {}).mark || (C.name || 'W')[0])}</span><span class="tx-label"></span></div>`;
    document.body.append(el);
  }
  return el;
}
function txWire() {
  if (!txOn()) return;
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target === '_blank' || a.hasAttribute('download') || a.hasAttribute('data-real')) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || !/(\.html|\/)$/.test(url.pathname)) return;
    if (url.pathname === location.pathname && url.search === location.search) return; // a link within this page
    e.preventDefault();
    const label = (a.dataset.tx || a.getAttribute('aria-label') || a.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40);
    const el = txEl();
    $('.tx-label', el).textContent = label;
    try { sessionStorage.setItem(TX_KEY, label); } catch { /* fine */ }
    el.classList.remove('is-out'); void el.offsetWidth; el.classList.add('is-in');
    setTimeout(() => { location.href = url.href; }, T.txIn || 650);
  });
  // coming back with the Back button: the page is restored as it was, so take the cover away
  addEventListener('pageshow', (e) => { if (e.persisted) { const el = $('#wl-tx'); el && el.classList.remove('is-in', 'is-out'); } });
}
function txArrive() {
  let label = null;
  try { label = sessionStorage.getItem(TX_KEY); sessionStorage.removeItem(TX_KEY); } catch { /* fine */ }
  document.documentElement.classList.remove('tx-wait');
  if (label == null || !txOn()) return;
  const el = txEl();
  $('.tx-label', el).textContent = label;
  el.classList.add('is-in', 'tx-hold');
  requestAnimationFrame(() => requestAnimationFrame(() => {
    el.classList.remove('tx-hold', 'is-in'); el.classList.add('is-out');
    setTimeout(() => el.classList.remove('is-out'), T.txOut || 1000);
  }));
}

/* ---------- the opening: once per visit, on the home page, skippable ---------- */
function introPlay(page) {
  const root = document.documentElement, ic = C.intro || {};
  let seen = false;
  try { seen = sessionStorage.getItem('wl-intro') === '1'; } catch { /* fine */ }
  if (!T.intro || ic.enabled === false || page !== 'home' || reduced || (seen && ic.every !== 'visit') || root.classList.contains('tx-came')) { root.classList.remove('intro-on'); root.classList.add('intro-done'); return; }
  try { sessionStorage.setItem('wl-intro', '1'); } catch { /* fine */ }
  const el = document.createElement('div');
  el.className = 'opening'; el.setAttribute('aria-hidden', 'true');
  el.innerHTML = T.intro() + `<button class="opening-skip" type="button" tabindex="-1">${esc(ui('introSkip'))}</button>`;
  document.body.append(el);
  root.classList.add('intro-on');
  let over = false;
  const end = () => {
    if (over) return; over = true;
    el.classList.add('leave');
    setTimeout(() => { root.classList.remove('intro-on'); root.classList.add('intro-done'); }, T.introReveal || 250);
    setTimeout(() => el.remove(), T.introLeave || 1300);
  };
  setTimeout(end, T.introLength || 3400);
  el.addEventListener('click', end);
  addEventListener('keydown', (e) => { if (e.key === 'Escape') end(); });
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('run')));
}

function render() {
  const page = document.body.dataset.page || 'home';
  const app = $('#app');
  const main = (T.pages[page] || T.pages.home)();
  app.innerHTML = `${header(page)}<main id="main" tabindex="-1">${main}</main>${footer()}${fab()}${T.after ? T.after(page) : ''}`;
  document.documentElement.classList.remove('menu-open');
  setMeta(page); setSchema(); wireCore();
  T.wire && T.wire(page);
  reveal(); countUp(); loadLater();
  document.documentElement.classList.add('ready');
}
function boot(tier) {
  T = tier;
  applyBrand(); wireDemo(); render();
  txArrive(); txWire(); introPlay(document.body.dataset.page || 'home');
  if (location.hash) { const t = document.getElementById(location.hash.slice(1)); t && setTimeout(() => t.scrollIntoView(), 60); }
}

/* ==========================================================================
   MID TIER: "Portfolio & Quotes". Pages: home, services, portfolio, about,
   contact. Shows the work, builds trust and collects quote requests.
   ========================================================================== */
const S = () => C.sections || {};
const sec = (k) => { const s = S()[k]; return s && s.enabled !== false ? s : null; };
const money = (n) => `${C.currency || 'Rs'} ${Math.round(+n).toLocaleString('en-US')}`;
const services = () => ((sec('services') || {}).items || []).filter((s) => has(s.title));
const quoteHref = (svc) => `contact.html${svc ? '?service=' + enc(svc) : ''}#quote`;
const pageFile = { home: './', services: 'services.html', portfolio: 'portfolio.html', about: 'about.html', contact: 'contact.html' };

const TIER = {
  homeHref: './',
  transitions: true,
  txIn: 650, txOut: 1000,
  introLength: 3300, introLeave: 1300, introReveal: 300,
  /** The opening: a brass tape measure rolls out under the name, then the screen slides away like a drawer. */
  intro() {
    const h = sec('hero') || {};
    const marks = Array.from({ length: 31 }, (_, i) => `<span style="--i:${i}">${i % 5 === 0 ? `<b>${i * 10}</b>` : ''}</span>`).join('');
    return `<div class="op-grain"></div>
      <div class="op-copy"><p class="op-kicker">${esc(tx(h.eyebrow))}</p><p class="op-name">${esc(C.name)}</p></div>
      <div class="op-tape"><div class="op-marks">${marks}</div><span class="op-case"></span></div>
      <p class="op-since">${esc(tx(h.trust))}</p>`;
  },
  nav() {
    return [
      { key: 'home', href: pageFile.home, label: ui('navHome') },
      services().length && { key: 'services', href: pageFile.services, label: ui('navServices') },
      sec('portfolio') && { key: 'portfolio', href: pageFile.portfolio, label: ui('navPortfolio') },
      sec('about') && { key: 'about', href: pageFile.about, label: ui('navAbout') },
      { key: 'contact', href: pageFile.contact, label: ui('navContact') },
    ].filter(Boolean);
  },
  headerCta: () => `<a class="btn btn-accent hd-cta" href="${quoteHref()}">${esc(ui('getQuote'))}</a>`,
  menuExtra: () => `<a class="btn btn-accent btn-lg" href="${quoteHref()}">${esc(ui('getQuote'))}${icon('arrow', 'i-go')}</a>${K().phone ? `<a class="btn btn-line btn-lg" href="${telHref(K().phone)}">${icon('phone')}${esc(K().phone)}</a>` : ''}`,
  footerLinks: () => TIER.nav().map((n) => `<a href="${esc(n.href)}">${esc(n.label)}</a>`).join(''),
  pageTitle: (p) => (p === 'home' ? '' : ui('nav' + p[0].toUpperCase() + p.slice(1))),
  pages: {
    home: () => [hero(), servicesPreview(), portfolioPreview(), beforeAfterBlock(), process(), testimonials(), faq(), quoteBand()].join(''),
    services: () => [pageHead('services'), servicesDetail(), process(), quoteBand()].join(''),
    portfolio: () => [pageHead('portfolio'), portfolioFull(), beforeAfterBlock(true), testimonials(), quoteBand()].join(''),
    about: () => [pageHead('about'), aboutStory(), team(), badges(), testimonials(), quoteBand()].join(''),
    contact: () => [pageHead('contact'), contactPage(), faq()].join(''),
  },
  after: (page) => (page === 'contact' ? '' : `<div class="quote-bar"><a class="btn btn-accent btn-lg" href="${quoteHref()}">${icon('sparkle')}${esc(ui('getFreeQuote'))}</a>${K().phone ? `<a class="btn btn-line btn-lg qb-call" href="${telHref(K().phone)}" aria-label="${esc(ui('phone'))}">${icon('phone')}</a>` : ''}</div>`),
  schema(base) {
    const o = { ...base, '@type': (C.seo && C.seo.schemaType) || 'HomeAndConstructionBusiness' };
    const r = C.reviewsSummary;
    if (r && r.rating) o.aggregateRating = { '@type': 'AggregateRating', ratingValue: r.rating, reviewCount: r.count };
    const sv = services();
    if (sv.length) o.hasOfferCatalog = { '@type': 'OfferCatalog', name: ui('navServices'), itemListElement: sv.map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: tx(s.title) }, ...(s.from ? { price: s.from, priceCurrency: C.currencyCode || 'MUR' } : {}) })) };
    const f = (sec('faq') || {}).items || [];
    return f.length && document.body.dataset.page !== 'portfolio' ? [o, { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: f.map((x) => ({ '@type': 'Question', name: tx(x.q), acceptedAnswer: { '@type': 'Answer', text: tx(x.a) } })) }] : o;
  },
  wire(page) {
    document.documentElement.classList.toggle('has-quote-bar', page !== 'contact');
    $$('[data-carousel]').forEach((c) => carousel(c, { auto: (sec('testimonials') || {}).autoplay === false ? 0 : 6000 }));
    $$('[data-ba]').forEach(wireBA);
    wirePortfolio();
    wireQuote();
    // hero photos cross-fade
    const slides = $$('[data-hero-slide]');
    if (slides.length > 1 && !reduced) { let i = 0; setInterval(() => { slides[i].classList.remove('on'); i = (i + 1) % slides.length; slides[i].classList.add('on'); }, 5200); }
    // the process line fills as you scroll past it
    const pr = $('[data-process]');
    if (pr && 'IntersectionObserver' in window) new IntersectionObserver(([e], o) => { if (e.isIntersecting) { pr.classList.add('run'); o.disconnect(); } }, { threshold: 0.3 }).observe(pr);
    else pr && pr.classList.add('run');
  },
};

/* ---------- small pieces ---------- */
const stars = (n = 5) => `<span class="stars" role="img" aria-label="${esc(ui('ratingOf', { n }))}">${icon('star').repeat(Math.round(n))}</span>`;
const pageHeads = () => S().pageHeads || {};
function pageHead(key) {
  const h = pageHeads()[key] || {};
  return `<section class="phead${h.image ? ' phead-img' : ''}">
  ${h.image ? `<div class="phead-bg">${pic(h.image, { eager: true, w: 1600 })}</div>` : ''}
  <div class="wrap phead-in">
    <nav class="crumbs" aria-label="${esc(ui('breadcrumb'))}"><a href="./">${esc(ui('navHome'))}</a><span aria-hidden="true">/</span><span aria-current="page">${esc(ui('nav' + key[0].toUpperCase() + key.slice(1)))}</span></nav>
    <h1 class="h1">${esc(tx(h.title) || ui('nav' + key[0].toUpperCase() + key.slice(1)))}</h1>
    ${has(h.text) ? `<p class="lead">${esc(tx(h.text))}</p>` : ''}
  </div>
</section>`;
}

/* ---------- home ---------- */
function hero() {
  const h = sec('hero');
  if (!h) return '';
  const imgs = (h.images || []).filter(Boolean);
  const r = C.reviewsSummary;
  return `<section class="hero">
  <div class="wrap hero-in">
    <div class="hero-copy">
      ${has(h.eyebrow) ? `<p class="eyebrow hero-rise">${esc(tx(h.eyebrow))}</p>` : ''}
      <h1 class="h1 hero-rise">${esc(tx(h.title))}</h1>
      ${has(h.text) ? `<p class="lead hero-rise">${esc(tx(h.text))}</p>` : ''}
      <p class="btns hero-rise"><a class="btn btn-accent btn-lg" href="${quoteHref()}">${esc(tx(h.cta) || ui('getFreeQuote'))}${icon('arrow', 'i-go')}</a>${sec('portfolio') ? `<a class="btn btn-line btn-lg" href="${pageFile.portfolio}">${esc(ui('seeWork'))}</a>` : ''}</p>
      ${has(h.trust) ? `<p class="hero-trust hero-rise">${icon('check')}${esc(tx(h.trust))}</p>` : ''}
    </div>
    ${imgs.length ? `<div class="hero-art hero-rise">
      <div class="hero-frame">${imgs.map((im, i) => `<figure class="hero-slide${i === 0 ? ' on' : ''}" data-hero-slide>${later(pic(im, { eager: i === 0, sizes: '(min-width: 960px) 46vw, 100vw', w: 1000 }), i)}</figure>`).join('')}</div>
      ${r && r.rating ? `<div class="float-card fc-rating">${stars(5)}<b>${esc(String(r.rating))}</b><span>${esc(ui('reviewsCount', { n: r.count, source: r.source || 'Google' }))}</span></div>` : ''}
      ${has(h.badge) ? `<div class="float-card fc-badge">${icon('award')}<span>${esc(tx(h.badge))}</span></div>` : ''}
    </div>` : ''}
  </div>
</section>`;
}

function servicesPreview() {
  const s = sec('services'), list = services();
  if (!s || !list.length) return '';
  return `<section class="sec svc-sec">
  <div class="wrap">
    <div class="sec-row">${head(s.eyebrow, s.title, s.lead)}<a class="link" href="${pageFile.services}" data-reveal>${esc(ui('allServices'))}${icon('arrow')}</a></div>
    <ul class="svc-grid">${list.map((v, i) => `<li data-reveal style="--d:${(i % 3) * 0.08}s"><a class="svc-card" href="${pageFile.services}#${esc(v.id)}">
      <figure>${pic(v.image, { sizes: '(min-width: 960px) 30vw, (min-width: 600px) 46vw, 92vw', w: 700 })}${v.from ? `<span class="kraft"><small>${esc(ui('from'))}</small><b>${esc(money(v.from))}</b></span>` : ''}</figure>
      <div class="svc-body"><span class="svc-no">${String(i + 1).padStart(2, '0')}</span><h3 class="h3">${esc(tx(v.title))}</h3>${has(v.short) ? `<p>${esc(tx(v.short))}</p>` : ''}
      <p class="svc-foot"><span>${esc(ui('seeDetails'))}</span><span class="svc-go">${icon('arrow')}</span></p></div>
    </a></li>`).join('')}</ul>
  </div>
</section>`;
}

function portfolioItems() { return ((sec('portfolio') || {}).items || []).filter((p) => p.image); }
const pfItem = (p, i) => `<li class="pf-item" data-cat="${esc(p.category || '')}" data-i="${i}" style="view-transition-name:pf${i}" data-reveal="zoom"><button type="button" class="pf-btn" data-open="${i}" aria-label="${esc(ui('viewPhoto', { title: tx(p.title) }))}">
  ${pic(p.image, { sizes: '(min-width: 1100px) 380px, (min-width: 600px) 46vw, 92vw', w: 700 })}
  <span class="pf-cap"><b>${esc(tx(p.title))}</b>${has(p.place) ? `<span>${esc(tx(p.place))}</span>` : ''}</span><span class="pf-zoom">${icon('zoom')}</span></button></li>`;
function portfolioPreview() {
  const s = sec('portfolio'), items = portfolioItems();
  if (!s || !items.length) return '';
  const n = s.homeCount || 6;
  return `<section class="sec sec-alt pf-sec">
  <div class="wrap">
    <div class="sec-row">${head(s.eyebrow, s.title, s.lead)}<a class="link" href="${pageFile.portfolio}" data-reveal>${esc(ui('allProjects', { n: items.length }))}${icon('arrow')}</a></div>
    <ul class="pf-grid" data-pf>${items.slice(0, n).map(pfItem).join('')}</ul>
  </div>
</section>`;
}
function portfolioFull() {
  const s = sec('portfolio'), items = portfolioItems();
  if (!s || !items.length) return '';
  const used = new Set(items.map((p) => p.category));
  const cats = (s.categories || []).filter((c) => used.has(c.id));
  return `<section class="sec pf-sec pf-page">
  <div class="wrap">
    ${cats.length > 1 ? `<div class="pf-filters" role="group" aria-label="${esc(ui('filterLabel'))}" data-reveal><button type="button" aria-pressed="true" data-filter="">${esc(ui('all'))} <span>${items.length}</span></button>${cats.map((c) => `<button type="button" aria-pressed="false" data-filter="${esc(c.id)}">${esc(tx(c.label))} <span>${items.filter((p) => p.category === c.id).length}</span></button>`).join('')}</div>` : ''}
    <ul class="pf-grid pf-grid-full" data-pf>${items.map(pfItem).join('')}</ul>
  </div>
</section>`;
}
function wirePortfolio() {
  const grid = $('[data-pf]');
  if (!grid) return;
  const all = portfolioItems();
  const visible = () => $$('.pf-item', grid).filter((li) => !li.hidden);
  // phones: the first photo is wide, and so is the last when it would sit alone
  const layout = () => { const v = visible(); v.forEach((li) => li.classList.remove('wide')); if (v[0]) v[0].classList.add('wide'); if (v.length > 1 && (v.length - 1) % 2) v[v.length - 1].classList.add('wide'); };
  layout();
  grid.addEventListener('click', (e) => {
    const b = e.target.closest('[data-open]');
    if (!b) return;
    const list = visible(), idx = list.indexOf(b.closest('.pf-item'));
    lightbox(list.map((li) => { const p = all[+li.dataset.i]; return { src: p.image, alt: tx(imgOf(p.image).alt) || tx(p.title), caption: [tx(p.title), tx(p.place)].filter(Boolean).join(' · ') }; }), Math.max(0, idx));
  });
  $$('[data-filter]').forEach((b) => b.addEventListener('click', () => {
    const f = b.dataset.filter;
    const apply = () => {
      $$('[data-filter]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      $$('.pf-item', grid).forEach((li) => { li.hidden = !!f && li.dataset.cat !== f; li.classList.add('in'); });
      layout();
    };
    if (document.startViewTransition && !reduced) document.startViewTransition(apply); else apply();
  }));
}

function beforeAfterBlock(onPortfolio = false) {
  const s = sec('beforeAfter');
  const pairs = ((s || {}).items || []).filter((p) => p.before && p.after);
  if (!s || !pairs.length) return '';
  const list = onPortfolio ? pairs : pairs.slice(0, 1);
  return `<section class="sec ba-sec${onPortfolio ? ' sec-alt' : ''}">
  <div class="wrap">
    ${head(s.eyebrow, s.title, s.lead, 'center')}
    <div class="ba-list">${list.map((p) => `<figure class="ba-fig" data-reveal>
      <div class="ba" data-ba style="--pos:50%">
        ${pic(p.after, { cls: 'ba-after', sizes: '(min-width: 1000px) 960px, 100vw', w: 1200 })}
        <div class="ba-before">${pic(p.before, { sizes: '(min-width: 1000px) 960px, 100vw', w: 1200 })}</div>
        <span class="ba-tag ba-tag-b">${esc(ui('before'))}</span><span class="ba-tag ba-tag-a">${esc(ui('after'))}</span>
        <span class="ba-line" aria-hidden="true"><span class="ba-knob">${icon('chevL')}${icon('chevR')}</span></span>
        <input type="range" min="0" max="100" value="50" class="ba-range" aria-label="${esc(ui('baSlider'))}">
      </div>
      ${has(p.title) ? `<figcaption><b>${esc(tx(p.title))}</b>${has(p.text) ? ` · ${esc(tx(p.text))}` : ''}</figcaption>` : ''}
    </figure>`).join('')}</div>
  </div>
</section>`;
}
function wireBA(el) {
  const r = $('.ba-range', el);
  const set = (v) => el.style.setProperty('--pos', v + '%');
  r.addEventListener('input', () => { el.classList.add('touched'); set(r.value); });
  // a small nudge the first time it comes on screen, so people see it moves
  if (!reduced && 'IntersectionObserver' in window) new IntersectionObserver(([e], o) => {
    if (!e.isIntersecting) return; o.disconnect();
    let t0; const step = (t) => { t0 ||= t; const p = (t - t0) / 1600; if (p >= 1 || el.classList.contains('touched')) { if (!el.classList.contains('touched')) set(50); return; } set(50 + Math.sin(p * Math.PI * 2) * 14); requestAnimationFrame(step); };
    setTimeout(() => requestAnimationFrame(step), 500);
  }, { threshold: 0.6 }).observe(el);
}

function process() {
  const s = sec('process'), steps = ((s || {}).steps || []).filter((x) => has(x.title));
  if (!s || !steps.length) return '';
  return `<section class="sec process-sec">
  <div class="wrap">
    ${head(s.eyebrow, s.title, s.lead, 'center')}
    <ol class="process" data-process style="--n:${steps.length}">${steps.map((st, i) => `<li style="--i:${i}"><span class="pr-dot">${icon(st.icon || 'check')}<b>${i + 1}</b></span><h3 class="h3">${esc(tx(st.title))}</h3>${has(st.text) ? `<p>${esc(tx(st.text))}</p>` : ''}</li>`).join('')}</ol>
  </div>
</section>`;
}

function testimonials() {
  const s = sec('testimonials'), list = ((s || {}).items || []).filter((x) => has(x.text));
  if (!s || !list.length) return '';
  const r = C.reviewsSummary;
  return `<section class="sec sec-alt testi-sec">
  <div class="wrap">
    <div class="sec-row">${head(s.eyebrow, s.title)}${r && r.rating ? `<p class="rating-pill" data-reveal>${stars(5)}<b>${esc(String(r.rating))}</b><span>${esc(ui('reviewsCount', { n: r.count, source: r.source || 'Google' }))}</span></p>` : ''}</div>
    <div class="testi" data-carousel>
      <ul class="testi-track" data-track tabindex="0" aria-label="${esc(tx(s.title))}">${list.map((t, i) => `<li class="testi-card" data-slide>
        <p class="slip-head"><span>${esc(ui('orderNo'))} ${String(412 + i * 37).padStart(4, '0')}</span><span>${esc(tx(t.project) || '')}</span></p>${stars(t.rating || 5)}
        <blockquote><p>${esc(tx(t.text))}</p></blockquote>
        <p class="testi-who">${t.photo ? pic(t.photo, { w: 120, sizes: '56px' }) : `<span class="testi-av">${esc((t.name || '?')[0])}</span>`}<span><b>${esc(t.name)}</b>${esc([tx(t.project), tx(t.place)].filter(Boolean).join(' · '))}</span></p>
      </li>`).join('')}</ul>
      <div class="testi-ctrl"><button type="button" class="round" data-prev aria-label="${esc(ui('prev'))}">${icon('chevL')}</button><div class="dots" data-dots></div><button type="button" class="round" data-next aria-label="${esc(ui('next'))}">${icon('chevR')}</button></div>
    </div>
  </div>
</section>`;
}

function faq() {
  const s = sec('faq'), list = ((s || {}).items || []).filter((x) => has(x.q));
  if (!s || !list.length) return '';
  return `<section class="sec faq-sec">
  <div class="wrap faq-in">
    ${head(s.eyebrow, s.title, s.lead)}
    <div class="faq">${list.map((f, i) => `<details data-reveal style="--d:${0.05 * i}s"><summary>${esc(tx(f.q))}<span class="faq-x">${icon('plus')}</span></summary><div class="faq-a"><p>${esc(tx(f.a))}</p></div></details>`).join('')}</div>
  </div>
</section>`;
}

function quoteBand() {
  const s = sec('quoteBand');
  if (!s || !has(s.title)) return '';
  return `<section class="qband">${s.image ? `<div class="qband-bg">${pic(s.image, { w: 1600 })}</div>` : ''}<div class="wrap qband-in" data-reveal>
    <h2 class="h2">${esc(tx(s.title))}</h2>${has(s.text) ? `<p class="lead">${esc(tx(s.text))}</p>` : ''}
    <p class="btns"><a class="btn btn-accent btn-lg" href="${quoteHref()}">${esc(ui('getFreeQuote'))}${icon('arrow', 'i-go')}</a>${waHref() ? `<a class="btn btn-ghost btn-lg" href="${waHref(tx(K().whatsappMessage))}" target="_blank" rel="noopener">${icon('wa')}WhatsApp</a>` : ''}</p>
  </div></section>`;
}

/* ---------- services page ---------- */
function servicesDetail() {
  const list = services();
  return `<section class="sec svc-detail"><div class="wrap">${list.map((v, i) => `<article class="svd${i % 2 ? ' svd-flip' : ''}" id="${esc(v.id)}">
    <figure class="svd-img" data-reveal="${i % 2 ? 'right' : 'left'}">${pic(v.image, { sizes: '(min-width: 960px) 50vw, 100vw', w: 1000 })}</figure>
    <div class="svd-copy" data-reveal>
      <span class="svc-ic">${icon(v.icon || 'sparkle')}</span>
      <h2 class="h2">${esc(tx(v.title))}</h2>
      ${has(v.text) ? `<p class="lead">${esc(tx(v.text))}</p>` : ''}
      ${has(v.features) ? `<ul class="ticks">${v.features.map((f) => `<li>${icon('check')}${esc(tx(f))}</li>`).join('')}</ul>` : ''}
      ${v.from ? `<p class="svd-price"><span>${esc(ui('startingFrom'))}</span><b>${esc(money(v.from))}</b>${has(v.priceNote) ? `<small>${esc(tx(v.priceNote))}</small>` : ''}</p>` : ''}
      <p class="btns"><a class="btn btn-primary btn-lg" href="${quoteHref(v.id)}">${esc(ui('quoteFor'))}${icon('arrow', 'i-go')}</a></p>
    </div>
  </article>`).join('')}</div></section>`;
}

/* ---------- about page ---------- */
function aboutStory() {
  const a = sec('about');
  if (!a) return '';
  const paras = (Array.isArray(a.text) ? a.text : [a.text]).filter(has);
  const stats = (a.stats || []).filter((s) => has(s.value));
  return `<section class="sec about-sec"><div class="wrap about-in">
    <div class="about-copy">${head(a.eyebrow, a.title)}${paras.map((p) => `<p data-reveal>${esc(tx(p))}</p>`).join('')}
      ${stats.length ? `<dl class="mini-stats">${stats.map((s) => `<div data-reveal><dd>${esc(s.prefix || '')}<span data-count="${+s.value}">0</span>${esc(s.suffix || '')}</dd><dt>${esc(tx(s.label))}</dt></div>`).join('')}</dl>` : ''}
    </div>
    ${a.image ? `<figure class="about-img" data-reveal="right">${pic(a.image, { sizes: '(min-width: 960px) 45vw, 100vw', w: 900 })}${has(a.quote) ? `<figcaption>${icon('quote')}<span>${esc(tx(a.quote))}</span></figcaption>` : ''}</figure>` : ''}
  </div></section>`;
}
function team() {
  const s = sec('team'), list = ((s || {}).members || []).filter((m) => has(m.name));
  if (!s || !list.length) return '';
  return `<section class="sec sec-alt team-sec"><div class="wrap">${head(s.eyebrow, s.title, s.lead, 'center')}
    <ul class="team">${list.map((m, i) => `<li data-reveal style="--d:${0.08 * i}s"><figure>${m.photo ? pic(m.photo, { sizes: '(min-width: 900px) 30vw, 80vw', w: 600 }) : `<span class="team-av">${esc(m.name[0])}</span>`}</figure><h3 class="h3">${esc(m.name)}</h3><p class="team-role">${esc(tx(m.role))}</p>${has(m.bio) ? `<p>${esc(tx(m.bio))}</p>` : ''}</li>`).join('')}</ul>
  </div></section>`;
}
function badges() {
  const s = sec('badges'), list = ((s || {}).items || []).filter((b) => has(b.title));
  if (!s || !list.length) return '';
  return `<section class="sec badges-sec"><div class="wrap">${head(s.eyebrow, s.title, '', 'center')}
    <ul class="badges">${list.map((b, i) => `<li data-reveal style="--d:${0.06 * i}s">${b.image ? `<img src="${esc(b.image)}" alt="" loading="lazy">` : `<span class="badge-ic">${icon(b.icon || 'award')}</span>`}<b>${esc(tx(b.title))}</b>${has(b.text) ? `<span>${esc(tx(b.text))}</span>` : ''}</li>`).join('')}</ul>
  </div></section>`;
}

/* ---------- contact page with the quote form ---------- */
function contactPage() {
  const k = K(), addr = addressLines();
  const rows = [
    has(k.phone) && `<a class="cc" href="${telHref(k.phone)}">${icon('phone')}<span><b>${esc(ui('phone'))}</b>${esc(k.phone)}</span></a>`,
    waHref() && `<a class="cc cc-wa" href="${waHref(tx(k.whatsappMessage))}" target="_blank" rel="noopener">${icon('wa')}<span><b>WhatsApp</b>${esc(ui('chatNow'))}</span></a>`,
    has(k.email) && `<a class="cc" href="${mailHref()}">${icon('mail')}<span><b>${esc(ui('email'))}</b>${esc(k.email)}</span></a>`,
    addr.length && `<a class="cc" href="${esc(mapsLink())}" target="_blank" rel="noopener">${icon('pin')}<span><b>${esc(ui('showroom'))}</b>${addr.map(esc).join(', ')}</span></a>`,
  ].filter(Boolean).join('');
  return `<section class="sec contact-sec"><div class="wrap contact-in">
    <div class="quote-wrap" id="quote">${quoteForm()}</div>
    <aside class="contact-side">
      <div class="cs-card" data-reveal>${openBadge()}<div class="cc-list">${rows}</div></div>
      ${C.hours ? `<div class="cs-card" data-reveal><h2 class="h3">${esc(ui('hoursTitle'))}</h2>${hoursTable()}</div>` : ''}
      ${mapBox('map cs-map')}
    </aside>
  </div></section>`;
}

function quoteForm() {
  const q = C.quote || {}, list = services();
  const pre = new URLSearchParams(location.search).get('service') || '';
  const budgets = (q.budgets || []).filter(has);
  const via = q.sendVia || 'both';
  const canWa = via !== 'endpoint' && waHref();
  const canSend = via !== 'whatsapp';
  return `<form class="qf" data-quote novalidate>
  <header class="qf-head"><p class="eyebrow">${esc(tx(q.eyebrow) || ui('freeQuote'))}</p><h2 class="h2">${esc(tx(q.title) || ui('quoteTitle'))}</h2>${has(q.text) ? `<p class="lead">${esc(tx(q.text))}</p>` : ''}</header>
  <ol class="qf-steps" aria-hidden="true"><li class="on"><span>1</span>${esc(ui('qStep1'))}</li><li><span>2</span>${esc(ui('qStep2'))}</li><li><span>3</span>${esc(ui('qStep3'))}</li></ol>
  <div class="qf-bar"><span data-qbar></span></div>
  <fieldset class="qf-page on" data-qpage="0">
    <legend class="h3">${esc(ui('qWhich'))}</legend>
    <div class="qf-opts">${list.map((v) => `<label class="opt"><input type="radio" name="service" value="${esc(tx(v.title))}" data-id="${esc(v.id)}" required${v.id === pre ? ' checked' : ''} data-label="${esc(ui('qWhich'))}"><span>${icon(v.icon || 'sparkle')}<b>${esc(tx(v.title))}</b></span></label>`).join('')}<label class="opt"><input type="radio" name="service" value="${esc(ui('qOther'))}" required data-label="${esc(ui('qWhich'))}"><span>${icon('plus')}<b>${esc(ui('qOther'))}</b></span></label></div>
  </fieldset>
  <fieldset class="qf-page" data-qpage="1">
    <legend class="h3">${esc(ui('qTell'))}</legend>
    <label class="fld"><span class="lbl">${esc(ui('qDetails'))}</span><textarea name="details" required placeholder="${esc(tx(q.detailsHint) || '')}"></textarea></label>
    <div class="row-2">
      <label class="fld"><span class="lbl">${esc(ui('qLocation'))}</span><input name="location" autocomplete="address-level2"></label>
      ${budgets.length ? `<label class="fld"><span class="lbl">${esc(ui('qBudget'))} <small>${esc(ui('optional'))}</small></span><select name="budget"><option value="">${esc(ui('qBudgetPick'))}</option>${budgets.map((b) => `<option>${esc(tx(b))}</option>`).join('')}</select></label>` : ''}
    </div>
    ${q.photoUpload !== false ? `<label class="fld upl"><span class="lbl">${esc(ui('qPhotos'))} <small>${esc(ui('optional'))}</small></span><input type="file" name="photos" accept="image/*" multiple data-files><span class="upl-box">${icon('camera')}<span data-files-label>${esc(ui('qPhotosHint'))}</span></span></label>` : ''}
  </fieldset>
  <fieldset class="qf-page" data-qpage="2">
    <legend class="h3">${esc(ui('qAbout'))}</legend>
    <label class="fld"><span class="lbl">${esc(ui('fName'))}</span><input name="name" autocomplete="name" required></label>
    <div class="row-2">
      <label class="fld"><span class="lbl">${esc(ui('fPhone'))}</span><input name="phone" type="tel" inputmode="tel" autocomplete="tel" required></label>
      <label class="fld"><span class="lbl">${esc(ui('fEmail'))}</span><input name="email" type="email" autocomplete="email"></label>
    </div>
    <label class="fld"><span class="lbl">${esc(ui('qDate'))} <small>${esc(ui('optional'))}</small></span><input name="date" type="date" min="${new Date().toISOString().slice(0, 10)}"></label>
    <input type="text" name="_gotcha" tabindex="-1" autocomplete="off" class="sr" aria-hidden="true">
  </fieldset>
  <div class="qf-done" data-qdone hidden>${icon('check', 'qf-tick')}<h3 class="h2">${esc(ui('qThanks'))}</h3><p class="lead">${esc(ui('qThanksText'))}</p></div>
  <p class="form-status" data-status role="status" hidden></p>
  <div class="qf-nav">
    <button type="button" class="btn btn-line" data-qback hidden>${icon('chevL')}${esc(ui('back'))}</button>
    <button type="button" class="btn btn-primary btn-lg" data-qnext>${esc(ui('continue'))}${icon('arrow', 'i-go')}</button>
    ${canSend ? `<button type="submit" class="btn btn-primary btn-lg" data-qsend hidden>${icon('send')}${esc(ui('qSend'))}</button>` : ''}
    ${canWa ? `<button type="button" class="btn btn-wa btn-lg" data-qwa hidden>${icon('wa')}${esc(ui('qSendWa'))}</button>` : ''}
  </div>
  <p class="form-note">${esc(ui('formPrivacy'))}</p>
</form>`;
}
function wireQuote() {
  const f = $('[data-quote]');
  if (!f) return;
  const pages = $$('[data-qpage]', f), steps = $$('.qf-steps li', f), bar = $('[data-qbar]', f);
  const back = $('[data-qback]', f), next = $('[data-qnext]', f), send = $('[data-qsend]', f), wa = $('[data-qwa]', f);
  let at = 0;
  const show = (k, dir = 1) => {
    pages[at].classList.remove('on');
    at = k;
    pages[at].style.setProperty('--dir', dir);
    pages[at].classList.add('on');
    steps.forEach((s, i) => { s.classList.toggle('on', i <= at); s.classList.toggle('done', i < at); });
    bar.style.width = ((at + 1) / pages.length) * 100 + '%';
    back.hidden = at === 0; next.hidden = at === pages.length - 1;
    if (send) send.hidden = at !== pages.length - 1;
    if (wa) wa.hidden = at !== pages.length - 1;
    if (location.hash === '#quote' || at > 0) f.scrollIntoView({ block: 'start', behavior: reduced ? 'auto' : 'smooth' });
  };
  const valid = () => $$('input, textarea, select', pages[at]).every((el) => el.checkValidity() || (el.reportValidity(), false));
  next.addEventListener('click', () => { if (valid()) show(at + 1, 1); });
  back.addEventListener('click', () => show(at - 1, -1));
  // picking a service moves straight on
  $$('input[name="service"]', f).forEach((r) => r.addEventListener('change', () => setTimeout(() => at === 0 && show(1, 1), 220)));
  const files = $('[data-files]', f);
  files && files.addEventListener('change', () => { $('[data-files-label]', f).textContent = files.files.length ? ui('qPhotosN', { n: files.files.length }) : ui('qPhotosHint'); });
  const done = () => { pages.forEach((p) => p.classList.remove('on')); $('.qf-nav', f).hidden = true; $('.qf-steps', f).hidden = true; $('[data-qdone]', f).hidden = false; bar.style.width = '100%'; };
  const summary = () => `${ui('waQuoteIntro', { name: C.name })}\n\n${formSummary(f)}${files && files.files.length ? '\n' + ui('qPhotosWa', { n: files.files.length }) : ''}`;
  f.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!valid()) return;
    const ok = await sendForm(f, { subject: ui('quoteSubject', { name: C.name }), summary: summary() });
    if (ok && !demoOn() && (C.form || {}).endpoint) done();
    if (ok && demoOn()) done();
  });
  wa && wa.addEventListener('click', () => {
    if (!valid()) return;
    const h = waHref(summary());
    if (demoOn()) { demoShow('wa', summary()); done(); return; }
    window.open(h, '_blank', 'noopener'); done();
  });
  if (new URLSearchParams(location.search).get('service') && $('input[name="service"]:checked', f)) show(1, 1);
}

boot(TIER);
})();
