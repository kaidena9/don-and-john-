# Estimate form — how leads reach Don & John

Live and working. No activation step, no dashboard login, no approval.

## What happens on submit

1. The browser posts the form to a Google Apps Script web app running under
   kaidena9@gmail.com.
2. The script emails a formatted table to **donandjohnglass@gmail.com**
   (reply-to is set to the customer, so hitting Reply answers them).
3. The same lead is appended to the **leads spreadsheet**:
   https://docs.google.com/spreadsheets/d/1rhCALNP4v4TmttK0zdb6K7mMfWFcx1OjToNl-m5Svoo/edit
   Shared as "anyone with the link can view" — send Don & John the link and
   they can browse every lead, no account needed.
4. The visitor lands on `thanks.html`.

## Spam controls

- **One submission per person per 24h**, keyed on email/phone, enforced
  server-side in the script.
- **Honeypot field** (`_honey`) — bots that fill every field are dropped
  silently, no email, no row.

## Where things live

- Script project: https://script.google.com/d/1EOuPpdYEEWRZYvJO15HDjiDqlgEf4jjQCpVV2kiw01ZNOrVcs6obyhtw/edit
- Source of truth for the script: `form-endpoint.gs` in this repo
- Endpoint URL: `FORM_ENDPOINT` at the top of the form block in `js/script.js`

## Changing things

- **Different destination inbox**: edit `SEND_TO` at the top of the script,
  then redeploy (Deploy > Manage deployments > edit > New version).
  Two inboxes: `SEND_TO = 'a@x.com,b@y.com'`.
- **Redeploying from the CLI**: `clasp push && clasp deploy`. A *new*
  deployment gets a new URL — update `FORM_ENDPOINT` if so. Editing the
  existing deployment keeps the URL.
