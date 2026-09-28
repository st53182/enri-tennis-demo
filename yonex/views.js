/* Views, part 1: helpers, header/footer, home, product card, catalogue, new-in */
const V = window.V = {};
const t = k => (I18N[S.lang] && I18N[S.lang][k]) ?? I18N.lv[k] ?? k;
const L = o => o == null ? '' : (typeof o === 'string' ? o : (o[S.lang] ?? o.lv));
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money = n => new Intl.NumberFormat(S.lang === 'lv' ? 'lv-LV' : 'en-IE', {style:'currency', currency:'EUR', minimumFractionDigits: n % 1 ? 2 : 0}).format(n);
const byId = id => PRODUCTS.find(p => p.id === id);
const totalStock = p => STORES.reduce((a,s)=>a+(p.stock[s.id]||0),0);
const fmtDate = (d, withTime) => d.toLocaleDateString(S.lang === 'lv' ? 'lv-LV' : 'en-GB', {weekday:'short', day:'numeric', month:'short', ...(withTime ? {hour:'2-digit', minute:'2-digit'} : {})});
const ICON = {
  search:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  arrow:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  bag:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 7h12l-1 13H7L6 7Z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg>',
  check:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="m5 12 5 5 9-10"/></svg>',
  clock:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>'
};

function stockState(p, storeId){
  if (p.soon) return {cls:'dot-low', txt:`${t('arrives')} ${new Date(p.soon).toLocaleDateString(S.lang==='lv'?'lv-LV':'en-GB',{day:'numeric',month:'short'})}`};
  const n = storeId ? p.stock[storeId] : totalStock(p);
  if (n <= 0) return {cls:'dot-no', txt:t('out_stock'), n};
  if (n <= 2) return {cls:'dot-low', txt:`${t('low_stock')} · ${n} ${t('pcs')}`, n};
  return {cls:'dot-ok', txt: storeId ? `${n} ${t('pcs')}` : t('in_stock'), n};
}
function badges(p){
  let b = '';
  if (p.soon) b += `<span class="chip chip-soon">${t('badge_soon')}</span>`;
  else if (p.isNew) b += `<span class="chip chip-new">${t('badge_new')}</span>`;
  return `<div class="pc-badges">${b}</div>`;
}
function metaLine(p){
  const sp = Object.fromEntries(p.specs);
  if (p.cat === 'rackets' && p.sport === 'tennis') return [sp.weight, (sp.head||'').split(' / ')[0], sp.pattern].filter(Boolean).join(' · ');
  if (p.cat === 'rackets') return [sp.balance, sp.flex, (p.opts.weight||[]).join('/')].filter(Boolean).join(' · ');
  return p.specs.slice(0,2).map(s=>s[1]).join(' · ');
}

V.card = function(p){
  const s = stockState(p);
  return `<a class="pc" href="#/p/${p.id}">
    <div class="pc-img s-${p.sport}">${badges(p)}${ART.photo(p, 360, 450)}</div>
    <div class="pc-body">
      <div class="pc-series">${esc(p.series)} · ${t('sport_'+p.sport)}</div>
      <div class="pc-name">${esc(p.name)}</div>
      <div class="pc-meta">${esc(metaLine(p))}</div>
      <div class="pc-foot"><span class="price">${money(p.price)}</span><span class="stock"><i class="dot ${s.cls}"></i>${s.txt}</span></div>
    </div></a>`;
};

V.protoBar = () => `<span><b>${t('proto')}</b> · ${t('protoNote')}</span>`;

V.header = function(route){
  const n = S.cart.reduce((a,c)=>a+c.qty,0);
  const on = k => route.name === k || (route.sport && route.sport === k) ? 'on' : '';
  return `<div class="wrap hdr-in">
    <a class="logo" href="#/" aria-label="YONEX Baltic">${ART.logo}<span class="logo-b">BALTIC</span></a>
    <nav class="nav" aria-label="Main">
      <a class="${on('tennis')}" href="#/tennis">${t('nav_tennis')}</a>
      <a class="${on('badminton')}" href="#/badminton">${t('nav_badminton')}</a>
      <a class="${on('new')}" href="#/new">${t('nav_new')}<i class="new-dot"></i></a>
      <a class="${on('finder')}" href="#/finder">${t('nav_finder')}</a>
      <a class="${on('stores')}" href="#/stores">${t('nav_stores')}</a>
    </nav>
    <div class="tools">
      <form class="search" data-form="search" role="search">${ICON.search}<input id="q" name="q" type="search" placeholder="${t('search')}" value="${esc(S.q||'')}" aria-label="${t('search')}"></form>
      <div class="lang" role="group" aria-label="Language">
        <button data-act="lang" data-v="lv" class="${S.lang==='lv'?'on':''}">LV</button><button data-act="lang" data-v="en" class="${S.lang==='en'?'on':''}">EN</button>
      </div>
      <a class="res-btn" href="#/reserve">${ICON.bag}<span class="lbl">${t('reservation')}</span><span class="cnt num">${n}</span></a>
    </div>
  </div>`;
};

V.footer = () => `<div class="wrap ftr-in">
    <div><a class="logo" href="#/" aria-label="YONEX Baltic">${ART.logo}<span class="logo-b">BALTIC</span></a><p style="margin-top:14px">${t('foot_about')}</p></div>
    <div><h4>${t('foot_shop')}</h4><a href="#/tennis">${t('nav_tennis')}</a><a href="#/badminton">${t('nav_badminton')}</a><a href="#/new">${t('nav_new')}</a><a href="#/finder">${t('nav_finder')}</a></div>
    <div><h4>${t('foot_help')}</h4><a href="#/#how">${t('foot_help1')}</a><a href="#/#svc">${t('foot_help2')}</a><a href="#/stores">${t('foot_help3')}</a><a href="#/#svc">${t('foot_help4')}</a></div>
    <div><h4>${t('foot_contact')}</h4><p>SIA SETS<br>${esc(STORES[0].addr)}<br>${esc(L(STORES[0].hours))}</p><p class="mono" style="margin-top:8px">${STORES[0].phone}<br>${STORES[0].email}</p></div>
  </div>
  <div class="wrap ftr-bottom"><span>${t('rights')}</span><span>LV · EE · LT</span></div>`;

/* ---------- home ---------- */
const HERO = [
  {id:'muse-98', sub:'hero_sub_muse', bg:'#E8ECF2', cs:'rgba(12,22,38,.13)'},
  {id:'astrox-99-pro', sub:'hero_sub_ax99', bg:'#E2F0E6', cs:'rgba(23,120,90,.22)'},
  {id:'vcore-100', sub:'hero_sub_vcore', bg:'#F5E4E6', cs:'rgba(176,18,43,.16)'}
];
V.home = function(){
  const h = HERO[S.heroIdx % HERO.length], p = byId(h.id);
  const words = p.name.split(' ');
  const newIn = PRODUCTS.filter(x => x.isNew && !x.soon).slice(0, 8);
  const soon = PRODUCTS.find(x => x.soon);
  return `
  <section class="hero wrap">
    <div class="hero-grid">
      <div class="hero-copy">
        <span class="eyebrow">${t('hero_eyebrow')} · ${t('sport_'+p.sport)}</span>
        <h1 class="hero-title">${esc(words[0])}<br>${esc(words.slice(1).join(' '))}</h1>
        <p class="hero-sub">${t(h.sub)}</p>
        <div class="hero-specs">${p.specs.slice(0,3).map(s=>`<div><b>${esc(s[1].split(' / ')[0])}</b><small>${t('spec_'+s[0])}</small></div>`).join('')}</div>
        <div class="hero-cta"><span class="hero-price">${money(p.price)}</span><a class="btn btn-primary" href="#/p/${p.id}">${t('hero_cta')}</a><a class="btn btn-ghost" style="color:#fff;border-color:rgba(255,255,255,.35)" href="#/new">${t('hero_more')}</a></div>
      </div>
      <div class="hero-art" style="background:${h.bg}">
        ${ART.court(p.sport, h.cs)}
        ${ART.photo(p, 640, 800)}
        <div class="hero-dots">${HERO.map((x,i)=>`<button data-act="hero" data-i="${i}" class="${i===S.heroIdx%HERO.length?'on':''}" aria-label="${byId(x.id).name}"></button>`).join('')}</div>
      </div>
    </div>
  </section>

  <section class="sec wrap">
    <div class="doors">
      <a class="door door-tennis" href="#/tennis">${ART.court('tennis','rgba(255,255,255,.3)')}<div><h3>${t('sport_tennis')}</h3><p>${t('door_tennis')}</p></div><span class="go">${ICON.arrow}</span></a>
      <a class="door door-badminton" href="#/badminton">${ART.court('badminton','rgba(12,22,38,.22)')}<div><h3>${t('sport_badminton')}</h3><p>${t('door_badminton')}</p></div><span class="go">${ICON.arrow}</span></a>
    </div>
  </section>

  <section class="sec wrap">
    <div class="sec-h"><div><h2>${t('new_h')}</h2><p>${t('new_p')}</p></div><a class="link-arrow" href="#/new">${t('see_all')}</a></div>
    <div class="grid">${newIn.map(V.card).join('')}</div>
  </section>

  ${soon ? `<section class="sec wrap">${V.soonBanner(soon)}</section>` : ''}

  <section class="sec wrap" id="how">
    <div class="sec-h"><h2>${t('how_h')}</h2></div>
    <div class="steps">${[1,2,3].map(i=>`<div class="step"><span class="step-n">${i}</span><h3>${t('how'+i+'_h')}</h3><p>${t('how'+i+'_p')}</p></div>`).join('')}</div>
  </section>

  <section class="sec wrap" id="svc">
    <div class="sec-h"><h2>${t('svc_h')}</h2></div>
    <div class="services">${[1,2,3].map(i=>`<div class="svc"><span class="kpi">${t('svc'+i+'_k')}</span><h3>${t('svc'+i+'_h')}</h3><p>${t('svc'+i+'_p')}</p></div>`).join('')}</div>
  </section>`;
};

V.soonBanner = function(p){
  const ms = Math.max(0, new Date(p.soon + 'T10:00:00') - Date.now());
  const d = Math.floor(ms/864e5), h = Math.floor(ms%864e5/36e5), m = Math.floor(ms%36e5/6e4);
  return `<div class="soon">
    <div class="soon-art">${ART.photo(p, 240, 300)}</div>
    <div>
      <span class="eyebrow">${t('soon_h')} · ${new Date(p.soon).toLocaleDateString(S.lang==='lv'?'lv-LV':'en-GB',{day:'numeric',month:'long'})}</span>
      <h3 style="margin-top:6px">${esc(p.name)}</h3>
      <p>${L(p.desc)} ${t('soon_p')}</p>
      <div class="countdown num"><div><b>${d}</b><small>${t('d')}</small></div><div><b>${h}</b><small>${t('h')}</small></div><div><b>${m}</b><small>${t('m')}</small></div><div><b>${p.preorder.left}/${p.preorder.total}</b><small>${t('soon_left')}</small></div></div>
    </div>
    <a class="btn btn-primary" href="#/p/${p.id}">${t('soon_btn')}</a>
  </div>`;
};

/* ---------- catalogue ---------- */
const CATS = { tennis:['rackets','strings','balls','shoes','bags','apparel'], badminton:['rackets','strings','shuttles','shoes','bags','apparel','accessories'] };
function applyFilters(list){
  const f = S.f;
  list = list.filter(p => (f.series==='all' || p.series===f.series) && (!f.onlyNew || p.isNew) && (!f.inStock || totalStock(p)>0));
  const sorters = { pop:(a,b)=>(b.top?1:0)-(a.top?1:0), new:(a,b)=>(b.isNew?1:0)-(a.isNew?1:0), low:(a,b)=>a.price-b.price, high:(a,b)=>b.price-a.price };
  return list.slice().sort(sorters[f.sort] || sorters.pop);
}
V.catalog = function(sport, cat){
  const all = PRODUCTS.filter(p => p.sport === sport);
  const inCat = cat ? all.filter(p => p.cat === cat) : all;
  const series = cat === 'rackets' ? [...new Set(inCat.map(p=>p.series))] : [];
  const list = applyFilters(inCat);
  const f = S.f;
  return `<div class="wrap">
    <div class="page-h">
      <div class="crumbs"><a href="#/">YONEX Baltic</a>/<a href="#/${sport}">${t('sport_'+sport)}</a>${cat?`/<span>${t('cat_'+cat)}</span>`:''}</div>
      <h1>${cat ? t('cat_'+cat) : t('sport_'+sport)}</h1>
    </div>
    <div class="cat-layout">
      <aside class="filters">
        <div class="sport-switch"><a class="${sport==='tennis'?'on':''}" href="#/tennis${cat?'/'+cat:''}">${t('sport_tennis')}</a><a class="${sport==='badminton'?'on':''}" href="#/badminton${cat && CATS.badminton.includes(cat)?'/'+cat:''}">${t('sport_badminton')}</a></div>
        <div class="fgroup cats"><h4>${t('f_cat')}</h4>
          <a class="fopt ${!cat?'on':''}" href="#/${sport}" style="text-decoration:none">${t('cat_all')}<small>${all.length}</small></a>
          ${CATS[sport].map(c=>`<a class="fopt ${cat===c?'on':''}" href="#/${sport}/${c}" style="text-decoration:none">${t('cat_'+c)}<small>${all.filter(p=>p.cat===c).length}</small></a>`).join('')}
        </div>
        ${series.length ? `<div class="fgroup series"><h4>${t('f_series')}</h4>
          <button class="fopt ${f.series==='all'?'on':''}" data-act="series" data-v="all">${t('f_all')}</button>
          ${series.map(s=>`<button class="fopt ${f.series===s?'on':''}" data-act="series" data-v="${esc(s)}">${esc(s)}<small>${inCat.filter(p=>p.series===s).length}</small></button>`).join('')}</div>` : ''}
        <div class="fgroup">
          <label class="toggle"><input id="fNew" type="checkbox" data-act="onlyNew" ${f.onlyNew?'checked':''}>${t('f_only_new')}</label>
          <label class="toggle"><input id="fStock" type="checkbox" data-act="inStock" ${f.inStock?'checked':''}>${t('f_in_stock')}</label>
        </div>
      </aside>
      <div>
        <div class="cat-bar"><span class="muted num">${list.length} ${t('items')}</span>
          <select id="sort" data-act="sort" aria-label="Sort">${['pop','new','low','high'].map(s=>`<option value="${s}" ${f.sort===s?'selected':''}>${t('sort_'+s)}</option>`).join('')}</select></div>
        ${list.length ? `<div class="grid">${list.map(V.card).join('')}</div>` : `<div class="empty">${t('empty')}<button class="btn btn-ghost btn-sm" data-act="resetF">${t('reset')}</button></div>`}
      </div>
    </div></div>`;
};

V.search = function(){
  const q = (S.q||'').trim().toLowerCase();
  const list = PRODUCTS.filter(p => (p.name+' '+p.series+' '+L(p.desc)+' '+t('cat_'+p.cat)).toLowerCase().includes(q));
  return `<div class="wrap"><div class="page-h"><div class="crumbs"><a href="#/">YONEX Baltic</a>/<span>${t('search').replace('…','')}</span></div><h1>“${esc(S.q||'')}”</h1><span class="muted num">${list.length} ${t('items')}</span></div>
    ${list.length ? `<div class="grid" style="padding-bottom:40px">${list.map(V.card).join('')}</div>` : `<div class="empty">${t('empty')}<a class="btn btn-ghost btn-sm" href="#/new">${t('res_go')}</a></div>`}</div>`;
};

V.newIn = function(){
  const sp = S.newSport;
  const list = PRODUCTS.filter(p => p.isNew && !p.soon && (sp==='all' || p.sport===sp));
  const soon = PRODUCTS.filter(p => p.soon && (sp==='all' || p.sport===sp));
  return `<div class="wrap">
    <div class="page-h"><div class="crumbs"><a href="#/">YONEX Baltic</a>/<span>${t('nav_new')}</span></div><h1>${t('new_h')}</h1><p class="muted" style="max-width:60ch">${t('new_p')}</p></div>
    <div class="sport-switch" style="max-width:420px;margin-bottom:20px">
      ${['all','tennis','badminton'].map(s=>`<a href="#/new" class="${sp===s?'on':''}" data-act="newSport" data-v="${s}">${s==='all'?t('f_all'):t('sport_'+s)}</a>`).join('')}
    </div>
    ${soon.map(p=>`<div style="margin-bottom:20px">${V.soonBanner(p)}</div>`).join('')}
    <div class="grid" style="padding-bottom:40px">${list.map(V.card).join('')}</div>
  </div>`;
};
