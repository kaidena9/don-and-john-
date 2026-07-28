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

    // One request per person per day — stops repeat submits and bot floods.
    var who = String(d.email || d.phone || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    var props = PropertiesService.getScriptProperties();
    var seenKey = 'lead_' + who;
    var lastSeen = who ? props.getProperty(seenKey) : null;
    if (lastSeen && (new Date().getTime() - Number(lastSeen)) < 24 * 60 * 60 * 1000) {
      return json({ ok: true, duplicate: true });
    }

    var services = (e.parameters && e.parameters['services[]'])
      ? e.parameters['services[]'].join(', ')
      : (d.services || '—');

    var fullName = [d.first_name, d.last_name].filter(String).join(' ').trim() || d.name || '';

    var rows = [
      ['Name', fullName],
      ['Phone', d.phone],
      ['Email', d.email],
      ['Property address', d.address],
      ['Services needed', services],
      ['Timing / notes', d.message]
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

    logToSheet(rows, services);

    MailApp.sendEmail({
      to: SEND_TO,
      subject: SUBJECT + (fullName ? ' — ' + fullName : ''),
      htmlBody: html,
      replyTo: d.email || SEND_TO,
      name: 'Don & John Website'
    });

    if (who) props.setProperty(seenKey, String(new Date().getTime()));
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function doGet() {
  return json({
    ok: true,
    status: 'Don & John form endpoint is live',
    sheet: getSheetUrl()
  });
}

/** The leads spreadsheet — created once, then reused. */
function getSheet() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('SHEET_ID');
  var ss;
  if (id) {
    try { ss = SpreadsheetApp.openById(id); } catch (e) { ss = null; }
  }
  if (!ss) {
    ss = SpreadsheetApp.create('Don & John — Website Leads');
    props.setProperty('SHEET_ID', ss.getId());
    var sh = ss.getActiveSheet();
    sh.appendRow(['Received', 'Name', 'Phone', 'Email', 'Property address', 'Services', 'Message']);
    sh.getRange(1, 1, 1, 7).setFontWeight('bold').setBackground('#143AAD').setFontColor('#FFFFFF');
    sh.setFrozenRows(1);
    sh.setColumnWidth(1, 150); sh.setColumnWidth(2, 150); sh.setColumnWidth(3, 130);
    sh.setColumnWidth(4, 200); sh.setColumnWidth(5, 240); sh.setColumnWidth(6, 200); sh.setColumnWidth(7, 320);
    // Anyone with the link can view — Don & John just open it, no account needed.
    DriveApp.getFileById(ss.getId())
      .setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  }
  return ss;
}

function getSheetUrl() {
  try { return getSheet().getUrl(); } catch (e) { return null; }
}

function logToSheet(rows, services) {
  try {
    var sh = getSheet().getActiveSheet();
    sh.appendRow([
      new Date(),
      rows[0][1] || '', rows[1][1] || '', rows[2][1] || '',
      rows[3][1] || '', services || '', rows[5][1] || ''
    ]);
  } catch (e) {
    // Never let a sheet problem stop the email going out.
  }
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

/**
 * Run this once from the editor to grant the mail permission.
 * It sends nothing — it just triggers Google's consent prompt.
 */
function authorize() {
  var quota = MailApp.getRemainingDailyQuota();
  var url = getSheetUrl();
  Logger.log('Authorized. Mail quota: ' + quota + ' | Leads sheet: ' + url);
  return url;
}
