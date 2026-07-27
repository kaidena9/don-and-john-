# Estimate form — email delivery setup

Goal: customer fills the form → the details land in Don & John's inbox.
No activation email, no approval step, no dashboard.

The site is static, so the email has to be sent by *some* authenticated
account. We use a Google Apps Script web app on an account we control
(Kaiden's), which sends straight to `donandjohnglass@gmail.com`. Don & John
never have to confirm anything.

## One-time setup (~3 minutes, in a browser)

1. Go to **https://script.google.com** → **New project**.
2. Delete the placeholder code, paste in the contents of `form-endpoint.gs`
   from this repo, and save.
3. **Deploy → New deployment** → gear icon → **Web app**:
   - *Execute as*: **Me**
   - *Who has access*: **Anyone**
   - Deploy → authorize the script when Google prompts (it needs permission
     to send mail as you).
4. Copy the **Web app URL** (it looks like
   `https://script.google.com/macros/s/AKfy…/exec`) and send it to me.
   I paste it into `js/script.js` as `FORM_ENDPOINT` and push — done.

## What happens after that

- Submit → the browser POSTs the fields to the script → the script emails
  the table to `donandjohnglass@gmail.com` and the visitor lands on
  `thanks.html`.
- **Reply** on that email replies to the customer, not to us.
- The hidden `_honey` field drops bots silently.
- To change the destination later, edit `SEND_TO` at the top of the script
  and redeploy. To send to two inboxes, use `to: 'a@x.com,b@y.com'`.

## Fallback currently in place

Until `FORM_ENDPOINT` is filled in, the form still posts to FormSubmit
(`formsubmit.co/donandjohnglass@gmail.com`), which works only after the
one-time activation link in that inbox is clicked. Filling in the Apps
Script URL removes that dependency entirely.
