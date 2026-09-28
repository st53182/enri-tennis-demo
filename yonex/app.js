/* App shell: state, hash router, event delegation */
const LS = {
  get(k, d){ try { const v = localStorage.getItem('ybx_'+k); return v ? JSON.parse(v) : d; } catch(e){ return d; } },
  set(k, v){ try { localStorage.setItem('ybx_'+k, JSON.stringify(v)); } catch(e){} }
};
const F0 = () => ({series:'all', onlyNew:false, inStock:false, sort:'pop'});
window.S = {
  lang: LS.get('lang','lv') === 'en' ? 'en' : 'lv',
  cart: LS.get('cart', []).filter(c => c && byId(c.id)),
  heroIdx: 0, f: F0(), newSport: 'all', q: '',
  pdp: null, form: LS.get('form', {}), err: {}, lastOrder: LS.get('last', null),
  fd: {step:0}, route: null, catKey: ''
};
S.form.consent = false;
const $ = id => document.getElementById(id);
const saveCart = () => LS.set('cart', S.cart);

function parse(){
  const raw = location.hash.replace(/^#\/?/, '');
  const [path, anchor] = raw.split('#');
  const [a, b] = path.split('/');
  let r = {name:'home'};
  if (a === 'tennis' || a === 'badminton') r = {name:'catalog', sport:a, cat: CATS[a].includes(b) ? b : null};
  else if (a === 'p' && byId(b)) r = {name:'product', id:b, sport: byId(b).sport};
  else if (['new','reserve','ok','stores','finder','search'].includes(a)) r = {name:a};
  r.anchor = anchor;
  return r;
}

const PREFER = ['4U','G5','G2','42','M','3','medium','all'];
function ensurePdp(id){
  if (S.pdp && S.pdp.id === id) return;
  const p = byId(id), o = {id, qty:1};
  Object.entries(p.opts || {}).forEach(([k, vals]) => { o[k] = vals.find(v => PREFER.includes(v)) || vals[0]; });
  o.string = p.stringable ? STRING_OPTIONS[p.sport][1].id : 'none';
  o.tension = TENSION[p.sport].def;
  o.store = p.soon ? 'riga' : (STORES.find(s => p.stock[s.id] > 0) || STORES[0]).id;
  S.pdp = o;
}

function render(toTop){
  const r = S.route = parse();
  document.documentElement.lang = S.lang;
  $('protoBar').innerHTML = V.protoBar();
  $('hdr').innerHTML = V.header(r.name === 'catalog' || r.name === 'product' ? {name:r.name, sport:r.sport} : r);
  let html;
  switch (r.name){
    case 'catalog': {
      const key = r.sport + '/' + r.cat;
      if (S.catKey !== key){ S.f.series = 'all'; S.catKey = key; }
      html = V.catalog(r.sport, r.cat); break;
    }
    case 'product': ensurePdp(r.id); html = V.product(byId(r.id)); break;
    case 'new': html = V.newIn(); break;
    case 'reserve':
      if (!STORES.some(s => s.id === S.form.store)) S.form.store = (S.cart[0] && STORES.some(s => s.id === S.cart[0].store)) ? S.cart[0].store : 'riga';
      if (!S.form.date) S.form.date = new Date().toISOString().slice(0,10);
      html = V.reserve(); break;
    case 'ok': html = V.confirm(); break;
    case 'stores': html = V.stores(); break;
    case 'finder': html = V.finder(); break;
    case 'search': html = V.search(); break;
    default: html = V.home();
  }
  $('app').innerHTML = html;
  $('ftr').innerHTML = V.footer();
  const names = {catalog: r.sport && t('sport_'+r.sport), product: r.id && byId(r.id).name, new: t('nav_new'), reserve: t('res_h'), stores: t('nav_stores'), finder: t('nav_finder')};
  document.title = (names[r.name] ? names[r.name] + ' · ' : '') + 'YONEX Baltic';
  if (r.anchor){ const el = $(r.anchor); if (el) el.scrollIntoView(); }
  else if (toTop) window.scrollTo(0, 0);
}

let toastTimer;
function toast(msg){
  const el = $('toast');
  el.innerHTML = `<span>${msg}</span><a href="#/reserve">${t('view_res')}</a>`;
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.hidden = true; }, 4000);
}

function addToCart(){
  const d = S.pdp, p = byId(d.id);
  const line = {id:d.id, qty:d.qty, store:d.store};
  Object.keys(p.opts || {}).forEach(k => line[k] = d[k]);
  if (p.stringable){ line.string = d.string; if (d.string !== 'none') line.tension = d.tension; }
  line.key = JSON.stringify({...line, qty:0});
  const hit = S.cart.find(c => c.key === line.key);
  if (hit) hit.qty = Math.min(9, hit.qty + line.qty); else S.cart.push(line);
  if (p.preorder && p.preorder.left > 0) p.preorder.left -= 1;
  saveCart();
  render();
  toast(`${ICON.check} ${esc(p.name)} · ${t('added').toLowerCase()}`);
}

function submitReserve(){
  const f = S.form, e = {};
  if (!(f.name||'').trim()) e.name = t('f_req');
  const digits = (f.phone||'').replace(/\D/g,'');
  if (!(f.phone||'').trim()) e.phone = t('f_req');
  else if (!/^\+/.test(f.phone.trim()) || digits.length < 10) e.phone = t('f_bad_phone');
  if (!(f.email||'').trim()) e.email = t('f_req');
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = t('f_bad_email');
  if (!f.consent) e.consent = t('f_req');
  S.err = e;
  if (Object.keys(e).length){
    render();
    const first = {name:'fName', phone:'fPhone', email:'fEmail', consent:'fConsent'}[Object.keys(e)[0]];
    if ($(first)) $(first).focus();
    return;
  }
  const abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const code = 'YB-' + Array.from({length:4}, () => abc[Math.floor(Math.random()*abc.length)]).join('') + '-' + String(new Date().getDate()).padStart(2,'0');
  const tt = cartTotals();
  S.lastOrder = { code, store: f.store, until: holdUntil().toISOString(), total: tt.total,
    lines: S.cart.map(c => { const p = byId(c.id); return {name:p.name, qty:c.qty, opts: lineOpts(c, p)}; }) };
  S.cart = []; saveCart(); LS.set('last', S.lastOrder);
  LS.set('form', {name:f.name, phone:f.phone, email:f.email, store:f.store});
  location.hash = '#/ok';
}

/* ---------- events ---------- */
document.addEventListener('click', ev => {
  const el = ev.target.closest('[data-act]');
  if (!el || el.tagName === 'INPUT' || el.tagName === 'SELECT') return;
  const a = el.dataset.act, v = el.dataset.v;
  switch (a){
    case 'lang': S.lang = v; LS.set('lang', v); render(); break;
    case 'hero': S.heroIdx = +el.dataset.i; render(); break;
    case 'series': S.f.series = v; render(); break;
    case 'resetF': S.f = F0(); render(); break;
    case 'newSport': ev.preventDefault(); S.newSport = v; render(); break;
    case 'opt': S.pdp[el.dataset.k] = v; render(); break;
    case 'str': S.pdp.string = v; render(); break;
    case 'qty': S.pdp.qty = Math.max(1, Math.min(9, S.pdp.qty + (+el.dataset.d))); render(); break;
    case 'add': addToCart(); break;
    case 'cqty': case 'rm': {
      const c = S.cart.find(x => x.key === el.dataset.key); if (!c) break;
      c.qty = a === 'rm' ? 0 : Math.min(9, c.qty + (+el.dataset.d));
      S.cart = S.cart.filter(x => x.qty > 0); saveCart(); render(); break;
    }
    case 'fd': S.fd[el.dataset.k] = v; S.fd.step++; render(); break;
    case 'fdBack': S.fd.step = Math.max(0, S.fd.step - 1); render(); break;
    case 'fdReset': S.fd = {step:0}; render(); break;
  }
});

document.addEventListener('change', ev => {
  const el = ev.target, a = el.dataset.act;
  if (a === 'onlyNew' || a === 'inStock'){ S.f[a] = el.checked; render(); }
  else if (a === 'sort'){ S.f.sort = el.value; render(); }
  else if (a === 'store'){ S.pdp.store = el.value; render(); }
  else if (el.dataset.f){ S.form[el.dataset.f] = el.type === 'checkbox' ? el.checked : el.value; }
});

document.addEventListener('input', ev => {
  const el = ev.target;
  if (el.dataset.act === 'tension'){
    S.pdp.tension = +el.value;
    const out = $('tensionOut'); if (out) out.textContent = fmtTension(byId(S.pdp.id).sport, S.pdp.tension);
  } else if (el.dataset.f && el.type !== 'checkbox'){ S.form[el.dataset.f] = el.value; }
});

document.addEventListener('submit', ev => {
  const form = ev.target.closest('[data-form]'); if (!form) return;
  ev.preventDefault();
  if (form.dataset.form === 'search'){
    S.q = form.querySelector('input').value.trim();
    if (!S.q) return;
    if (location.hash === '#/search') render(true); else location.hash = '#/search';
  } else if (form.dataset.form === 'reserve') submitReserve();
});

window.addEventListener('hashchange', () => { S.err = {}; render(true); $('app').focus({preventScroll:true}); });
render();
