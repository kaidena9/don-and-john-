/**
 * Don & John — estimate form relay.
 * Receives the website form POST and emails it to the business.
 * Deployed as a Google Apps Script Web App; no third-party service,
 * no activation step, no per-submission approval.
 */

var SEND_TO = 'donandjohnglass@gmail.com';
var SUBJECT = 'New estimate request from the website';

function doPost(e) {
  try {
    var d = (e && e.parameter) ? e.parameter : {};

    // Honeypot: bots fill every field, humans never see this one.
    if (d._honey) return json({ ok: true });

    var services = (e.parameters && e.parameters['services[]'])
      ? e.parameters['services[]'].join(', ')
      : (d.services || '—');

    var rows = [
      ['Name', d.name],
      ['Phone', d.phone],
      ['Email', d.email],
      ['Property address', d.address],
      ['Services needed', services],
      ['Message', d.message]
    ];

    var html =
      '<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#0A0A0C">' +
      '<h2 style="margin:0 0 14px;color:#143AAD">New estimate request</h2>' +
      '<table cellpadding="8" cellspacing="0" border="0" style="border-collapse:collapse">' +
      rows.map(function (r) {
        return '<tr>' +
          '<td style="background:#F6F8FA;font-weight:bold;border:1px solid #E2E6EA">' + esc(r[0]) + '</td>' +
          '<td style="border:1px solid #E2E6EA">' + esc(r[1] || '—').replace(/\n/g, '<br>') + '</td>' +
          '</tr>';
      }).join('') +
      '</table>' +
      '<p style="margin-top:16px;color:#8A909B;font-size:13px">Sent from the Don &amp; John website. Reply to this email to answer the customer directly.</p>' +
      '</div>';

    MailApp.sendEmail({
      to: SEND_TO,
      subject: SUBJECT + (d.name ? ' — ' + d.name : ''),
      htmlBody: html,
      replyTo: d.email || SEND_TO,
      name: 'Don & John Website'
    });

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function doGet() {
  return json({ ok: true, status: 'Don & John form endpoint is live' });
}

function esc(v) {
  return String(v == null ? '' : v)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
