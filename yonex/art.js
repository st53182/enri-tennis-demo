/* Product drawings generated as inline SVG, so the prototype needs no photos.
   Racket heads use the square-ish "isometric" shape Yonex is known for. */
window.ART = (function(){
  let uid = 0;
  const range = (a,b,s) => { const r=[]; for(let v=a; v<=b; v+=s) r.push(v); return r; };

  function racket(sport, c1, c2, strings){
    const id = 'rk' + (++uid);
    const sc = strings || 'rgba(60,70,85,.55)';
    if (sport === 'badminton'){
      const head = 'M70,6 C112,6 129,30 129,66 C129,108 104,142 70,142 C36,142 11,108 11,66 C11,30 28,6 70,6 Z';
      const mains = range(17,123,6).map(x=>`<line x1="${x}" y1="0" x2="${x}" y2="150"/>`).join('');
      const cross = range(12,138,6).map(y=>`<line x1="0" y1="${y}" x2="140" y2="${y}"/>`).join('');
      const wrap = range(300,386,7).map(y=>`<line x1="61" y1="${y+6}" x2="79" y2="${y}"/>`).join('');
      return `<svg class="rk" viewBox="0 0 140 400" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs><clipPath id="${id}"><path d="${head}"/></clipPath></defs>
        <g clip-path="url(#${id})" stroke="${sc}" stroke-width=".8">${mains}${cross}</g>
        <path d="${head}" fill="none" stroke="${c1}" stroke-width="7"/>
        <path d="${head}" fill="none" stroke="${c2}" stroke-width="7" stroke-dasharray="70 330" stroke-dashoffset="-150"/>
        <rect x="64" y="140" width="12" height="12" rx="3" fill="${c1}"/>
        <rect x="67.6" y="150" width="4.8" height="152" rx="2" fill="${c1}"/>
        <rect x="67.6" y="190" width="4.8" height="40" rx="2" fill="${c2}"/>
        <rect x="61" y="296" width="18" height="94" rx="4" fill="#17191E"/>
        <g stroke="rgba(255,255,255,.14)" stroke-width="1.4">${wrap}</g>
        <rect x="59.5" y="386" width="21" height="10" rx="3" fill="${c2}"/>
      </svg>`;
    }
    const head = 'M100,6 C158,6 176,44 176,96 C176,158 144,198 100,198 C56,198 24,158 24,96 C24,44 42,6 100,6 Z';
    const mains = range(32,168,9).map(x=>`<line x1="${x}" y1="0" x2="${x}" y2="200"/>`).join('');
    const cross = range(14,194,10).map(y=>`<line x1="0" y1="${y}" x2="200" y2="${y}"/>`).join('');
    const wrap = range(266,382,8).map(y=>`<line x1="86" y1="${y+8}" x2="114" y2="${y}"/>`).join('');
    return `<svg class="rk" viewBox="0 0 200 400" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs><clipPath id="${id}"><path d="${head}"/></clipPath></defs>
      <g clip-path="url(#${id})" stroke="${sc}" stroke-width="1">${mains}${cross}</g>
      <path d="M58,178 C76,212 88,238 91,266 M142,178 C124,212 112,238 109,266" fill="none" stroke="${c1}" stroke-width="10" stroke-linecap="round"/>
      <path d="${head}" fill="none" stroke="${c1}" stroke-width="11"/>
      <path d="${head}" fill="none" stroke="${c2}" stroke-width="11" stroke-dasharray="120 500" stroke-dashoffset="-235"/>
      <path d="M62,186 C78,214 88,236 90,258" fill="none" stroke="${c2}" stroke-width="3" stroke-linecap="round"/>
      <rect x="86" y="258" width="28" height="134" rx="6" fill="#17191E"/>
      <g stroke="rgba(255,255,255,.14)" stroke-width="2">${wrap}</g>
      <rect x="84" y="384" width="32" height="12" rx="4" fill="${c1}"/>
    </svg>`;
  }

  function shoe(c1,c2){
    return `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M14,92 C12,70 20,54 40,50 L78,40 C92,36 100,24 112,22 L140,20 C150,20 154,30 156,40 C160,56 176,66 188,72 C197,77 196,86 190,92 Z" fill="${c1}" stroke="rgba(12,22,38,.25)" stroke-width="1.2"/>
      <path d="M44,78 C80,70 120,58 158,62 C170,64 180,70 186,78" fill="none" stroke="${c2}" stroke-width="7" stroke-linecap="round"/>
      <path d="M96,40 l10,8 M104,34 l10,8 M112,29 l10,8 M120,25 l10,7" stroke="rgba(12,22,38,.45)" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M10,92 L192,92 Q198,92 198,100 L198,103 Q198,110 190,110 L18,110 Q8,110 8,101 Z" fill="#F4F6F8" stroke="rgba(12,22,38,.25)" stroke-width="1.2"/>
      <path d="M12,106 L194,106" stroke="${c2}" stroke-width="4"/>
    </svg>`;
  }
  function bag(c1,c2){
    return `<svg viewBox="0 0 200 130" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M70,34 C74,14 126,14 130,34" fill="none" stroke="#17191E" stroke-width="6"/>
      <rect x="8" y="32" width="184" height="80" rx="34" fill="${c1}"/>
      <path d="M8,72 H192" stroke="rgba(255,255,255,.35)" stroke-width="2" stroke-dasharray="4 4"/>
      <rect x="130" y="32" width="36" height="80" fill="${c2}"/>
      <rect x="26" y="50" width="44" height="12" rx="3" fill="rgba(255,255,255,.9)"/>
    </svg>`;
  }
  function shuttle(c1,c2){
    const f = range(0,8,1).map(i=>{ const x=30+i*7.5; return `<line x1="${x}" y1="18" x2="${52+i*2}" y2="112" />`; }).join('');
    return `<svg viewBox="0 0 120 170" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M24,14 L96,14 L70,114 L50,114 Z" fill="${c1}" stroke="rgba(12,22,38,.3)" stroke-width="1.2"/>
      <g stroke="rgba(12,22,38,.18)" stroke-width="1">${f}</g>
      <path d="M30,40 L90,40 M37,66 L83,66" stroke="${c2}" stroke-width="3"/>
      <rect x="46" y="112" width="28" height="12" fill="${c2}"/>
      <path d="M46,124 L74,124 C74,146 66,156 60,156 C54,156 46,146 46,124 Z" fill="#EFE6D4" stroke="rgba(12,22,38,.25)" stroke-width="1.2"/>
    </svg>`;
  }
  function ball(c1,c2){
    return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="60" cy="60" r="50" fill="${c1}"/>
      <path d="M20,30 C48,48 48,72 20,90 M100,30 C72,48 72,72 100,90" fill="none" stroke="${c2}" stroke-width="4.5"/>
      <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(12,22,38,.2)" stroke-width="1.2"/>
    </svg>`;
  }
  function reel(c1,c2){
    const rings = range(18,46,4).map(r=>`<circle cx="60" cy="60" r="${r}" fill="none"/>`).join('');
    return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="60" cy="60" r="52" fill="${c2}"/>
      <g stroke="${c1}" stroke-width="3">${rings}</g>
      <circle cx="60" cy="60" r="12" fill="#F3F5F8"/>
    </svg>`;
  }
  function shirt(c1,c2){
    return `<svg viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M40,14 L56,8 C62,17 78,17 84,8 L100,14 L128,36 L114,58 L102,50 L102,130 L38,130 L38,50 L26,58 L12,36 Z" fill="${c1}" stroke="rgba(12,22,38,.25)" stroke-width="1.2"/>
      <path d="M38,50 L38,130 L50,130 L50,56 Z M102,50 L102,130 L90,130 L90,56 Z" fill="${c2}"/>
      <path d="M56,8 C62,17 78,17 84,8" fill="none" stroke="${c2}" stroke-width="3"/>
    </svg>`;
  }
  function grip(c1,c2){
    const s = range(0,6,1).map(i=>`<path d="M${22+i*14},30 l14,60" />`).join('');
    return `<svg viewBox="0 0 140 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="18" y="30" width="104" height="60" rx="12" fill="${c1}" stroke="rgba(12,22,38,.25)" stroke-width="1.2"/>
      <g stroke="${c2}" stroke-width="3" opacity=".7">${s}</g>
    </svg>`;
  }

  function product(p, o){
    const a = p.art, st = o && o.strings;
    switch(a.kind){
      case 'racket': return racket(p.sport, a.c1, a.c2, st);
      case 'shoe': return shoe(a.c1,a.c2);
      case 'bag': return bag(a.c1,a.c2);
      case 'shuttle': return shuttle(a.c1,a.c2);
      case 'ball': return ball(a.c1,a.c2);
      case 'string': return reel(a.c1,a.c2);
      case 'shirt': return shirt(a.c1,a.c2);
      default: return grip(a.c1,a.c2);
    }
  }

  /* Court line backgrounds drawn to the real proportions:
     tennis 23.77 × 10.97 m, badminton 13.40 × 6.10 m */
  function court(kind, stroke){
    const s = stroke || 'rgba(255,255,255,.28)';
    if (kind === 'badminton'){
      return `<svg class="court" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g fill="none" stroke="${s}" stroke-width="2.2" transform="rotate(-12 200 150)">
          <rect x="66" y="-40" width="268" height="380"/>
          <line x1="81" y1="-40" x2="81" y2="340"/><line x1="319" y1="-40" x2="319" y2="340"/>
          <line x1="66" y1="-12" x2="334" y2="-12"/><line x1="66" y1="312" x2="334" y2="312"/>
          <line x1="66" y1="85" x2="334" y2="85"/><line x1="66" y1="215" x2="334" y2="215"/>
          <line x1="200" y1="-40" x2="200" y2="85"/><line x1="200" y1="215" x2="200" y2="340"/>
          <line x1="50" y1="150" x2="350" y2="150" stroke-dasharray="3 5"/>
        </g></svg>`;
    }
    return `<svg class="court" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g fill="none" stroke="${s}" stroke-width="2.2" transform="rotate(-12 200 150)">
        <rect x="90" y="-110" width="220" height="520"/>
        <line x1="117" y1="-110" x2="117" y2="410"/><line x1="283" y1="-110" x2="283" y2="410"/>
        <line x1="117" y1="30" x2="283" y2="30"/><line x1="117" y1="270" x2="283" y2="270"/>
        <line x1="200" y1="30" x2="200" y2="270"/>
        <line x1="70" y1="150" x2="330" y2="150" stroke-dasharray="3 5"/>
      </g></svg>`;
  }

  /* Official product photo from yonex.com, resized by their image CDN.
     If it fails to load, the drawn illustration takes its place. */
  function photo(p, w, h, o){
    if (!p.img) return product(p, o);
    const src = `${window.IMG_BASE}${p.img}?quality=85&fit=bounds&width=${w}&height=${h}`;
    return `<img class="ph" src="${src}" alt="${p.name}" loading="lazy" decoding="async" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><span class="ph-fb" hidden>${product(p, o)}</span>`;
  }

  /* Official YONEX wordmark (from yonex.com), without the tagline */
  const logo = `<svg class="ylogo" viewBox="0 0 160 42.7" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="YONEX">
    <path fill="#00a84f" d="M0,26.066H101.227V16.6l10.455,19.779V26.066H160V47.54H0V26.066" transform="translate(0 -4.874)"/>
    <path fill="#006cb7" d="M111.682,21.333H160V0H0V21.333H101.227V11.868l10.455,19.779V21.333"/>
    <g fill="#fff">
    <path d="M48.147,42.834a7.417,7.417,0,1,0,0-14.834,7.418,7.418,0,0,0,0,14.834" transform="translate(-11.979 -8.221)"/>
    <path d="M70.533,12.4H49.2A21.373,21.373,0,0,1,59.867,30.908L70.533,12.4" transform="translate(-14.445 -3.641)"/>
    <path d="M40.333,12.4H19A21.227,21.227,0,0,1,29.667,30.908L40.333,12.4" transform="translate(-5.578 -3.641)"/>
    <path d="M17.947,42.834A7.418,7.418,0,1,0,10.6,35.417a7.356,7.356,0,0,0,7.347,7.417" transform="translate(-3.112 -8.221)"/>
    <path d="M128.8,24.751c0,1.7-.141,3.532-.212,4.1-.424,5.157-1.766,9.113-8.124,9.113-6.146,0-7.77-4.168-8.053-9.113,0-.283-.212-1.907-.212-4.168a37.017,37.017,0,0,1,.212-4.168c.353-4.592,1.7-9.113,8.053-9.113,6.781,0,7.77,4.309,8.124,9.113a41.228,41.228,0,0,1,.212,4.238m-4.733-.071c0-2.331-.141-3.461-.141-4.168,0-2.4-.636-4.662-3.32-4.662-2.826,0-3.32,2.26-3.32,4.662,0,.636-.141,1.837-.141,4.168,0,2.19.141,3.673.141,4.168.071,3.461,1.2,4.662,3.249,4.662,2.119,0,3.32-1.2,3.391-4.733C123.926,28.283,124.068,27.153,124.068,24.68Z" transform="translate(-32.942 -3.347)"/>
    <path d="M100.657,12.4l-4.1,8.9-3.744-8.9H87.8l6.428,14.905V37.689H98.82V27.234L105.6,12.4h-4.945" transform="translate(-25.778 -3.641)"/>
    <path d="M166.1,12.4V37.689h13.351V33.1h-8.759V27.234h7.982V22.643h-7.982V16.992h8.759V12.4H166.1" transform="translate(-48.767 -3.641)"/>
    <path d="M198.061,24.974,204.136,12.4H199.05l-3.532,7.276L191.986,12.4H186.9l6.075,12.574L186.9,37.689h5.015l3.6-7.417,3.6,7.417h5.086l-6.146-12.715" transform="translate(-54.874 -3.641)"/>
    <path d="M150.467,12.4V26.175L143.826,12.4H139.8V37.689h4.592v-13.7l6.57,13.7h4.1V12.4h-4.592" transform="translate(-41.045 -3.641)"/>
    <path d="M212.2,45.454a1.554,1.554,0,1,1,1.554,1.554,1.568,1.568,0,0,1-1.554-1.554m1.554,1.413a1.413,1.413,0,1,0-1.413-1.413A1.417,1.417,0,0,0,213.754,46.867Zm-.424-2.119v.636h.565a.259.259,0,0,0,.283-.283c0-.283-.141-.353-.283-.353Zm-.212-.141h.777c.283,0,.494.071.565.424a.5.5,0,0,1-.212.424c.141.141.212.141.212.424,0,.212,0,.283.071.353V46.3h-.353c0-.071-.071-.141-.071-.212,0-.212.071-.494-.283-.494h-.565V46.3h-.212v-1.7Z" transform="translate(-62.302 -12.889)"/>
    </g></svg>`;

  return { product, racket, court, photo, logo };
})();
