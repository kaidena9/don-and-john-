# Domain cutover checklist

All absolute URLs use one base: `https://kaidena9.github.io/don-and-john-`

To move to a real domain (e.g. https://donandjohnglass.com):

1. Find-and-replace across the repo:
   `https://kaidena9.github.io/don-and-john-` -> `https://donandjohnglass.com`
   Files: index.html, services.html, reviews.html, thanks.html, robots.txt, sitemap.xml
2. 404.html uses root-relative paths with the `/don-and-john-/` project prefix.
   On a real domain replace `/don-and-john-/` with `/`.
3. Add a `CNAME` file containing the bare domain, and point DNS at GitHub Pages
   (A records to 185.199.108-111.153, or CNAME to kaidena9.github.io).
4. Enable "Enforce HTTPS" in repo Settings > Pages once the cert issues.
5. Submit https://<domain>/sitemap.xml in Google Search Console; add the domain
   to the Google Business Profile.
6. Everything else (nav links, form action, images, CSS/JS) is already relative
   and needs no change.
