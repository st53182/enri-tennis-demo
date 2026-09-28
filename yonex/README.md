# YONEX Baltic — clickable prototype

Static prototype (HTML/CSS/JS, no build step). LV is the primary language, EN the second.
Focus: online racket reservation (48 h hold, pay at pickup) and new arrivals.

## Run locally

    python -m http.server 5178 --directory yonex-baltic-prototype

then open http://localhost:5178

## Deploy

Published on GitHub Pages as a copy in the public repo `st53182/enri-tennis-demo`, folder `yonex/`:
https://st53182.github.io/enri-tennis-demo/yonex/
To update it, copy this folder over `yonex/` there and push to `main`.

## Content sources

- Racket names, specs and photos: yonex.com. Photos are loaded from the yonex.com image CDN
  (`IMG_BASE` in `data.js`); if one fails, the drawn SVG in `art.js` is shown instead.
- YONEX logo: official wordmark from yonex.com, inlined in `art.js`.
- Prices, stock, store addresses and the pre-order batch are placeholders.
  Confirm with the distributor before showing the prototype outside the team.

## Files

`data.js` (catalogue, stores), `i18n.js` (LV/EN copy), `art.js` (logo, photos, SVG fallbacks),
`views.js` + `views-pages.js` (pages), `app.js` (router, reservation state).
