/* Views, part 2: product page, reservation, confirmation, stores, racket finder */
const KG = 2.2046;
function fmtTension(sport, v){
  return sport === 'badminton' ? `${v} lbs · ${(v/KG).toFixed(1)} kg` : `${v} kg · ${Math.round(v*KG)} lbs`;
}
function stringOf(p, id){ return p.stringable && id && id !== 'none' ? STRING_OPTIONS[p.sport].find(s=>s.id===id) : null; }
function lineOpts(c, p){
  const s = stringOf(p, c.string);
  return [c.weight, c.grip, c.size && 'EU ' + c.size, c.speed && `${t('opt_speed')} ${c.speed}`, c.surface && t('surface_'+c.surface),
    s ? `${s.name} @ ${fmtTension(p.sport, c.tension)}` : (p.stringable ? t('unstrung') : '')].filter(Boolean).join(' · ');
}
const holdUntil = () => { const d = new Date(Date.now() + 48*36e5); d.setMinutes(0); return d; };

/* ---------- product page ---------- */
V.product = function(p){
  const d = S.pdp, so = p.stringable ? STRING_OPTIONS[p.sport] : null, ten = TENSION[p.sport];
  const str = stringOf(p, d.string), unit = p.price + (str ? str.price : 0);
  const hints = { weight:t('weight_hint'), grip: p.sport==='badminton' ? t('grip_hint_bad') : t('grip_hint_ten'), size:t('size_hint') };
  const group = (k, vals) => `<div class="opt"><div class="opt-h">${t('opt_'+k)}${hints[k]?`<small>${hints[k]}</small>`:''}</div>
    <div class="seg">${vals.map(v=>`<button data-act="opt" data-k="${k}" data-v="${v}" class="${d[k]===v?'on':''} ${k==='surface'?'txt':''}">${k==='surface'?t('surface_'+v):v}</button>`).join('')}</div></div>`;
  const storeOk = id => p.soon || p.stock[id] > 0;
  const canReserve = storeOk(d.store);
  const related = PRODUCTS.filter(x => x.sport===p.sport && x.cat===p.cat && x.id!==p.id && !x.soon).slice(0,4);
  const po = p.preorder;

  return `<div class="wrap">
  <div class="page-h" style="padding-bottom:10px"><div class="crumbs"><a href="#/">YONEX Baltic</a>/<a href="#/${p.sport}">${t('sport_'+p.sport)}</a>/<a href="#/${p.sport}/${p.cat}">${t('cat_'+p.cat)}</a>/<span>${esc(p.name)}</span></div></div>
  <div class="pdp">
    <div class="pdp-gallery">
      <div class="pdp-stage s-${p.sport}">${ART.court(p.sport, p.sport==='tennis'?'rgba(23,120,90,.35)':'rgba(185,122,0,.35)')}${badges(p)}${ART.photo(p, 800, 1000, {strings: str ? 'rgba(12,22,38,.55)' : 'rgba(12,22,38,.12)'})}</div>
      <p class="pdp-note">${S.lang==='lv'?'Ilustrācija prototipam. Gatavajā vietnē būs produkta foto un 360° skats.':'Prototype illustration. The live site will show product photos and a 360° view.'}</p>
    </div>
    <div class="pdp-info">
      <div style="display:flex;gap:6px;flex-wrap:wrap"><span class="chip chip-${p.sport}">${t('sport_'+p.sport)}</span><span class="chip chip-line">${esc(p.series)}</span></div>
      <h1>${esc(p.name)}</h1>
      <p class="pdp-lead">${L(p.desc)}</p>
      <div class="pdp-price"><span class="price num" id="unitPrice">${money(unit)}</span>${str?`<span class="muted" id="priceNote">${money(p.price)} + ${money(str.price)} ${t('stringing').toLowerCase()} (${t('stringing_free')})</span>`:''}</div>
      ${po ? `<div class="hold-note">${ICON.clock}<span><b>${po.left} / ${po.total}</b> ${t('soon_left')} · ${t('arrives')} ${new Date(p.soon).toLocaleDateString(S.lang==='lv'?'lv-LV':'en-GB',{day:'numeric',month:'long'})}. ${t('soon_p')}</span></div>` : ''}
      ${p.opts ? Object.entries(p.opts).map(([k,v]) => group(k, v)).join('') : ''}
      ${so ? `<div class="opt"><div class="opt-h">${t('opt_string')}<small>${t('svc1_h')} · ${t('stringing_free')}</small></div>
        <div class="seg">${so.map(s=>`<button class="txt ${d.string===s.id?'on':''}" data-act="str" data-v="${s.id}">${s.id==='none'?t('unstrung'):`${s.name} <span class="muted">+${money(s.price)}</span>`}</button>`).join('')}</div>
        ${str ? `<div class="tension"><input id="tension" type="range" min="${ten.min}" max="${ten.max}" step="1" value="${d.tension}" data-act="tension" aria-label="${t('tension')}"><output id="tensionOut" class="num">${fmtTension(p.sport, d.tension)}</output><small>${t('tension')}: ${esc((p.specs.find(s=>s[0]==='tensionRange')||[])[1]||'')} · ${t('tension_hint')}</small></div>` : ''}
      </div>` : ''}
      <div class="opt"><div class="opt-h">${t('pickup')}<small>${t('pickup_hint')}</small></div>
        <div class="stores-pick">${STORES.map(s=>{ const st = stockState(p, s.id), ok = storeOk(s.id);
          return `<label class="sp-row ${ok?'':'dis'}"><input type="radio" name="store" id="st-${s.id}" value="${s.id}" data-act="store" ${d.store===s.id?'checked':''} ${ok?'':'disabled'}>
            <div><b>${L(s.name)}</b><span>${esc(s.addr)}</span></div><span class="stock"><i class="dot ${st.cls}"></i>${st.txt}</span></label>`; }).join('')}</div>
      </div>
      <div class="buy-row">
        <div class="qty"><button data-act="qty" data-d="-1" aria-label="-">−</button><span class="num">${d.qty}</span><button data-act="qty" data-d="1" aria-label="+">+</button></div>
        <button class="btn btn-primary" data-act="add" ${canReserve?'':'disabled'}>${p.soon ? t('reserve_first') : t('reserve')} · <span class="num" id="btnTotal">${money(unit*d.qty)}</span></button>
      </div>
      <div class="assure">${[1,2,3,4].map(i=>`<div>${ICON.check}<span>${t('as'+i)}</span></div>`).join('')}</div>
      <div class="opt"><div class="opt-h">${t('specs')}</div>
        <table class="specs"><tbody>${p.specs.map(s=>`<tr><th>${t('spec_'+s[0])}</th><td>${esc(s[1])}</td></tr>`).join('')}</tbody></table></div>
    </div>
  </div>
  ${related.length ? `<section class="sec" style="padding-bottom:40px"><div class="sec-h"><h2>${S.lang==='lv'?'Līdzīgas preces':'Similar products'}</h2></div><div class="grid">${related.map(V.card).join('')}</div></section>` : ''}
  </div>`;
};

/* ---------- reservation ---------- */
function cartTotals(){
  let goods = 0, str = 0;
  S.cart.forEach(c => { const p = byId(c.id), s = stringOf(p, c.string); goods += p.price*c.qty; if (s) str += s.price*c.qty; });
  return {goods, str, total: goods + str};
}
V.reserve = function(){
  if (!S.cart.length) return `<div class="wrap"><div class="page-h"><h1>${t('res_h')}</h1></div>
    <div class="empty" style="margin-bottom:40px"><b style="color:var(--ink);font-size:17px">${t('res_empty')}</b><span>${t('res_empty_p')}</span><a class="btn btn-primary" href="#/new">${t('res_go')}</a></div></div>`;
  const tt = cartTotals(), f = S.form, e = S.err, hold = holdUntil();
  const days = [0,1,2].map(i => { const d = new Date(); d.setDate(d.getDate()+i); return d; });
  const fld = (k, id, type, label, extra='') => `<div class="field ${e[k]?'bad':''}"><label for="${id}">${label}</label><input id="${id}" type="${type}" data-f="${k}" value="${esc(f[k]||'')}" ${extra}>${e[k]?`<span class="err">${e[k]}</span>`:''}</div>`;
  return `<div class="wrap">
  <div class="page-h"><div class="crumbs"><a href="#/">YONEX Baltic</a>/<span>${t('res_h')}</span></div><h1>${t('res_h')}</h1></div>
  <div class="res-layout">
    <div class="res-items">
      ${S.cart.map(c => { const p = byId(c.id), s = stringOf(p, c.string), unit = p.price + (s?s.price:0);
        return `<div class="ri"><a class="ri-img" href="#/p/${p.id}">${ART.photo(p, 200, 250)}</a>
          <div><div class="pc-series">${esc(p.series)} · ${t('sport_'+p.sport)}${p.soon?` · ${t('badge_soon')}`:''}</div><h3>${esc(p.name)}</h3><div class="ri-opts">${esc(lineOpts(c,p))}</div></div>
          <div class="ri-side"><span class="price num">${money(unit*c.qty)}</span>
            <div class="qty" style="height:36px"><button data-act="cqty" data-key="${c.key}" data-d="-1" aria-label="-">−</button><span class="num">${c.qty}</span><button data-act="cqty" data-key="${c.key}" data-d="1" aria-label="+">+</button></div>
            <button class="x-btn" data-act="rm" data-key="${c.key}">${t('remove')}</button></div></div>`; }).join('')}
      <div class="hold-note">${ICON.clock}<span>${t('hold_note')} <b>${fmtDate(hold, true)}</b>. ${t('pay_note')}</span></div>
    </div>
    <form class="panel" data-form="reserve" novalidate>
      <h2>${t('your_data')}</h2>
      ${fld('name','fName','text',t('f_name'),'autocomplete="name"')}
      <div class="row2">${fld('phone','fPhone','tel',t('f_phone'),'autocomplete="tel" placeholder="+371 2…"')}${fld('email','fEmail','email',t('f_email'),'autocomplete="email"')}</div>
      <div class="field"><label for="fStore">${t('f_store')}</label><select id="fStore" data-f="store">${STORES.map(s=>`<option value="${s.id}" ${f.store===s.id?'selected':''}>${L(s.name)} · ${esc(s.city)}</option>`).join('')}</select><span class="muted" style="font-size:12.5px">${t('mixed_store')}</span></div>
      <div class="field"><label for="fDate">${t('f_date')}</label><select id="fDate" data-f="date">${days.map(d=>{ const v = d.toISOString().slice(0,10); return `<option value="${v}" ${f.date===v?'selected':''}>${fmtDate(d)}</option>`; }).join('')}</select></div>
      <div class="field"><label for="fNote">${t('f_note')}</label><textarea id="fNote" data-f="note" placeholder="${t('f_note_ph')}">${esc(f.note||'')}</textarea></div>
      <label class="check"><input id="fConsent" type="checkbox" data-f="consent" ${f.consent?'checked':''}><span>${t('f_consent')}${e.consent?`<br><span class="err" style="color:var(--danger)">${e.consent}</span>`:''}</span></label>
      <div class="sum-row"><span>${t('subtotal')}</span><span class="num">${money(tt.goods)}</span></div>
      ${tt.str ? `<div class="sum-row"><span>${t('stringing')} <span class="muted">(${t('stringing_free')})</span></span><span class="num">${money(tt.str)}</span></div>` : ''}
      <div class="sum-row total"><span>${t('total')}</span><span class="num">${money(tt.total)}</span></div>
      <button class="btn btn-primary btn-block" type="submit">${t('f_submit')}</button>
      <span class="muted" style="font-size:12.5px;text-align:center">${t('pay_note')}</span>
    </form>
  </div></div>`;
};

V.confirm = function(){
  const o = S.lastOrder;
  if (!o) return V.reserve();
  const st = STORES.find(s=>s.id===o.store) || STORES[0];
  return `<div class="wrap"><div class="ticket">
    <div class="ticket-top"><span class="eyebrow">${t('ok_eyebrow')}</span><h1>${t('ok_h')}</h1>
      <span class="muted" style="color:#9AA6BA;font-size:13px">${t('ok_code')}</span><span class="ticket-code">${o.code}</span><span style="color:#C5CFDE;font-size:14px">${t('ok_show')}</span></div>
    <div class="ticket-cut"></div>
    <div class="ticket-body">
      <dl class="kv">
        <dt>${t('ok_where')}</dt><dd>${L(st.name)}<br><span class="muted">${esc(st.addr)}<br>${esc(L(st.hours))}${st.phone?`<br>${st.phone}`:''}</span></dd>
        <dt>${t('ok_until')}</dt><dd>${fmtDate(new Date(o.until), true)}</dd>
        <dt>${t('ok_items')}</dt><dd>${o.lines.map(l=>`${esc(l.name)} × ${l.qty}<br><span class="muted mono">${esc(l.opts)}</span>`).join('<br>')}</dd>
        <dt>${t('ok_total')}</dt><dd class="price num">${money(o.total)}</dd>
      </dl>
      <p class="muted" style="font-size:13px">${t('ok_next')}</p>
      <a class="btn btn-ghost" href="#/new">${t('ok_back')}</a>
    </div></div></div>`;
};

/* ---------- stores ---------- */
V.stores = function(){
  const rk = PRODUCTS.filter(p=>p.cat==='rackets');
  return `<div class="wrap">
    <div class="page-h"><div class="crumbs"><a href="#/">YONEX Baltic</a>/<span>${t('nav_stores')}</span></div><h1>${t('stores_h')}</h1><p class="muted">${t('stores_p')}</p></div>
    <div class="stores">${STORES.map(s => { const n = rk.reduce((a,p)=>a+(p.stock[s.id]||0),0);
      return `<div class="store"><span class="flag">${s.country} · ${esc(s.city).toUpperCase()}</span><h3>${L(s.name)}</h3>
        <span>${esc(s.addr)}</span><span class="hrs">${esc(L(s.hours))}</span>
        ${s.phone ? `<span class="hrs">${s.phone} · ${s.email}</span>` : ''}
        ${s.example ? `<span class="chip chip-line" style="align-self:flex-start">${t('example')}</span>` : ''}
        <ul>${s.services.map(x=>`<li class="chip chip-line">${t('srv_'+x)}</li>`).join('')}</ul>
        <span class="stock"><i class="dot ${n?'dot-ok':'dot-no'}"></i><span class="num">${n}</span>&nbsp;${S.lang==='lv'?'raķetes uz vietas':'rackets in store'}</span></div>`; }).join('')}</div></div>`;
};

/* ---------- racket finder ---------- */
const FINDER = {
  styles:{ badminton:['attack','speed','control'], tennis:['spin','power','control'] },
  picks:{ attack:['astrox-99-pro','astrox-100zz','astrox-88d-pro'], speed:['nanoflare-1000z','nanoflare-700-pro','nanoflare-800-pro'], control:{badminton:['arcsaber-11-pro','arcsaber-7-pro','nanoflare-700-pro'], tennis:['muse-98','percept-97','ezone-98']},
    spin:['vcore-100','vcore-98','ezone-100'], power:['ezone-100','muse-100','vcore-100'] },
  easy:{ badminton:['astrox-77-pro','nanoflare-001-feel'], tennis:['ezone-100','muse-100'] }
};
function finderResult(){
  const {sport, style, level} = S.fd;
  let ids = FINDER.picks[style]; if (!Array.isArray(ids)) ids = ids[sport];
  if (level === 'new') ids = [...FINDER.easy[sport], ...ids];
  if (level === 'pro') ids = ids.filter(id => !FINDER.easy[sport].includes(id));
  return [...new Set(ids)].slice(0,3).map(byId);
}
V.finder = function(){
  const fd = S.fd, step = fd.step;
  const opt = (k, v, title, sub) => `<button class="q-opt" data-act="fd" data-k="${k}" data-v="${v}"><b>${title}</b>${sub?`<span>${sub}</span>`:''}</button>`;
  let body;
  if (step === 0) body = `<h2>${t('q1')}</h2><div class="q-opts">${opt('sport','tennis',t('sport_tennis'),t('door_tennis'))}${opt('sport','badminton',t('sport_badminton'),t('door_badminton'))}</div>`;
  else if (step === 1) body = `<h2>${t('q2')}</h2><div class="q-opts">${FINDER.styles[fd.sport].map(s=>opt('style',s,t('a_'+s),t('a_'+s+'_s'))).join('')}</div>`;
  else if (step === 2) body = `<h2>${t('q3')}</h2><div class="q-opts">${['new','club','pro'].map(s=>opt('level',s,t('a_'+s),t('a_'+s+'_s'))).join('')}</div>`;
  else body = `<h2>${t('result_h')}</h2><p class="muted">${t('sport_'+fd.sport)} · ${t('a_'+fd.style)} · ${t('a_'+fd.level)}</p><div class="grid">${finderResult().map(V.card).join('')}</div>`;
  return `<div class="wrap">
    <div class="page-h"><div class="crumbs"><a href="#/">YONEX Baltic</a>/<span>${t('nav_finder')}</span></div><h1>${t('finder_h')}</h1><p class="muted">${t('finder_p')}</p></div>
    <div class="finder"><div class="q-prog">${[0,1,2,3].map(i=>`<i class="${i<=step?'on':''}"></i>`).join('')}</div>${body}
      ${step>0?`<div style="display:flex;gap:10px"><button class="btn btn-ghost btn-sm" data-act="fdBack">${t('back')}</button>${step===3?`<button class="btn btn-ghost btn-sm" data-act="fdReset">${t('restart')}</button>`:''}</div>`:''}
    </div></div>`;
};
