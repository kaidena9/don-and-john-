# Domain cutover — COMPLETED 2026-07-29

The site is live at **https://www.donandjohn.com**, hosted on Vercel and
deployed from `frankiecampbellchicago-debug/don-and-john-` on push to `main`.

Every absolute URL on the site uses one base:
`https://www.donandjohn.com`

`www` is the canonical host. The redirect chain is verified working:

```
http://donandjohn.com/   → 308 → https://donandjohn.com/
https://donandjohn.com/  → 308 → https://www.donandjohn.com/   (200)
```

DNS at GoDaddy: apex `A` → Vercel, `www` `CNAME` → the project's
`*.vercel-dns-017.com` target. Nameservers stay on `domaincontrol.com`.

## If the domain ever changes again

1. **Find-and-replace across the repo:**
   `https://www.donandjohn.com` → the new base
   Files: `index.html`, `services.html`, `reviews.html`, `thanks.html`,
   `robots.txt`, `sitemap.xml`, `js/script.js` (the form's `_next` fallback).
   That covers canonicals, Open Graph/Twitter URLs, all JSON-LD `@id`/`url`
   fields (including the per-service `@id`s on `services.html`), the schema
   logo and image URLs, and the sitemap entries.
2. **Keep the `@id` graph consistent.** `services.html` and `reviews.html`
   reference `#business` and `#website`, which are defined on `index.html`.
   If the base changes on one page but not the others, those references go
   dangling and the pages stop resolving to the same business entity.
3. **404 page paths:** `404.html` uses root-relative links (`/`, `/services.html`,
   `/css/style.css`). These are correct for a root-domain deploy — no project
   prefix. Only revisit if the site ever moves back under a subpath.
4. **DNS:** point the apex and `www` at the new host. On Vercel, add both
   domains to the project and let Vercel own the apex → www redirect; don't
   duplicate that redirect in `vercel.json`.
5. **Verify the chain** before calling it done:
   `curl -sSI http://<domain>/ https://<domain>/ https://www.<domain>/`
   Expect 308 → 308 → 200, and a real 404 on a junk path.
6. **Search Console:** add the new domain as a property, verify, and submit
   `https://www.<domain>/sitemap.xml`. Request indexing for the three
   indexable pages (`/`, `/services.html`, `/reviews.html`). `thanks.html`
   is `noindex` and `Disallow`ed on purpose — don't submit it.
7. **Google Business Profile:** set the website field to the new domain so
   the NAP (name, address, phone) matches the site exactly — mismatches
   dilute local ranking. Also update the `sameAs` profiles in the
   `HomeAndConstructionBusiness` schema on `index.html` if any URLs change.
8. **Favicon:** Google re-crawls favicons on its own schedule; `favicon.ico`
   plus the PNG set are already at the site root and referenced on every page,
   so nothing to change beyond the domain swap.
9. **Old site:** if `donandjohnglass.com` currently serves the Landingsite
   build, make sure it is fully replaced (not left on a subdomain) so the two
   don't compete for the same keywords.

Everything else — nav links, form endpoint, images, CSS/JS — is relative and
needs no change.
