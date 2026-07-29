# Domain cutover — COMPLETED 2026-07-29

The site is live at **https://donandjohn.com**, hosted on Vercel and deployed
from `frankiecampbellchicago-debug/don-and-john-` on push to `main`.

Every absolute URL on the site uses one base:
`https://donandjohn.com`

DNS at GoDaddy: apex `A` → Vercel, `www` `CNAME` → the project's
`*.vercel-dns-017.com` target. Nameservers stay on `domaincontrol.com`.

## If the domain ever changes again

1. **Find-and-replace across the repo:**
   `https://donandjohn.com` → the new base
   Files: `index.html`, `services.html`, `reviews.html`, `thanks.html`,
   `robots.txt`, `sitemap.xml`, `js/script.js` (the form's `_next` fallback).
   That covers canonicals, Open Graph/Twitter URLs, all JSON-LD `@id`/`url`
   fields, the schema logo and image URLs, and the sitemap entries.
2. **404 page paths:** `404.html` uses root-relative links with the project
   prefix `/don-and-john-/`. Replace that prefix with `/`.
3. **CNAME + DNS:** add a `CNAME` file containing the bare domain, then point
   DNS at GitHub Pages (A records to 185.199.108–111.153, or a CNAME record
   to `kaidena9.github.io`).
4. **HTTPS:** in repo Settings → Pages, tick "Enforce HTTPS" once the
   certificate issues (can take an hour).
5. **Search Console:** add the domain as a property, verify, and submit
   `https://<domain>/sitemap.xml`. Request indexing for the three pages.
6. **Google Business Profile:** set the website field to the new domain so
   the NAP (name, address, phone) matches the site exactly — mismatches
   dilute local ranking.
7. **Favicon:** Google re-crawls favicons on its own schedule; `favicon.ico`
   plus the PNG set are already at the site root and referenced on every page,
   so nothing to change beyond the domain swap.
8. **Old site:** if `donandjohnglass.com` currently serves the Landingsite
   build, make sure it is fully replaced (not left on a subdomain) so the two
   don't compete for the same keywords.

Everything else — nav links, form endpoint, images, CSS/JS — is relative and
needs no change.
