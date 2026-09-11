const nodemailer = require('nodemailer');
const db = require('../db/database');
const config = require('../config');

let transporter = null;
try {
  if (config.MAIL.USER && config.MAIL.PASS) {
    transporter = nodemailer.createTransporter({
      host: config.MAIL.HOST,
      port: config.MAIL.PORT,
      secure: config.MAIL.PORT === 465,
      auth: {
        user: config.MAIL.USER,
        pass: config.MAIL.PASS
      }
    });
  }
} catch (e) {
  console.warn('Nodemailer init skipped, notifications will be logged and stored in-app.');
}

async function createNotification({
  userId,
  issueId = null,
  title,
  message,
  type = 'STATUS_CHANGE',
  actionUrl = null
}) {
  const notifId = `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  db.run(
    `INSERT INTO notifications (id, user_id, issue_id, title, message, type, is_read, email_sent, created_at)
     VALUES (?, ?, ?, ?, ?, ?, 0, 1, datetime('now'))`,
    [notifId, userId, issueId, title, message, type]
  );

  const user = db.get('SELECT * FROM users WHERE id = ?', [userId]);
  if (!user || !user.email) {
    return { id: notifId, success: true, emailSent: false };
  }

  const issue = issueId ? db.get('SELECT * FROM issues WHERE id = ?', [issueId]) : null;

  const htmlContent = generateGramSevaEmailHtml({
    userName: user.name,
    title,
    message,
    issue,
    actionUrl
  });

  let emailSent = false;
  try {
    if (transporter) {
      await transporter.sendMail({
        from: config.MAIL.FROM,
        to: user.email,
        subject: title,
        html: htmlContent
      });
      emailSent = true;
    } else {
      console.log(`\n========================================`);
      console.log(`[GRAMSEVA EMAIL DISPATCH] To: ${user.email}`);
      console.log(`Subject: ${title}`);
      console.log(`Message: ${message}`);
      if (issue) {
        console.log(`Issue ID: ${issue.id} | Status: ${issue.status} | Priority: ${issue.priority}`);
      }
      console.log(`========================================\n`);
      emailSent = true;
    }
  } catch (err) {
    console.warn(`Failed to send email to ${user.email}:`, err.message);
  }

  return { id: notifId, success: true, emailSent };
}

function generateGramSevaEmailHtml({ userName, title, message, issue, actionUrl }) {
  const issueId = issue ? issue.id : 'N/A';
  const category = issue ? issue.category : 'Public Infrastructure';
  const status = issue ? issue.status.replace(/_/g, ' ') : '';
  const targetDate = issue && issue.target_completion_date ? new Date(issue.target_completion_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'As per Panchayat SLA';
  const feedbackUrl = issue ? config.GOOGLE_FEEDBACK_FORM_URL.replace('{ISSUE_ID}', encodeURIComponent(issue.id)) : '#';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 20px; color: #1e293b; }
    .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    .header { background: #064e3b; color: #ffffff; padding: 24px; text-align: left; }
    .header h1 { margin: 0; font-size: 20px; letter-spacing: 0.5px; font-weight: 700; }
    .header p { margin: 4px 0 0 0; font-size: 13px; color: #a7f3d0; }
    .content { padding: 24px; }
    .alert-box { background: #ecfdf5; border-left: 4px solid #10b981; padding: 14px; margin-bottom: 20px; border-radius: 0 4px 4px 0; }
    .alert-box p { margin: 0; font-size: 14px; line-height: 1.5; color: #065f46; font-weight: 500; }
    .meta-table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px; }
    .meta-table td { padding: 8px 12px; border-bottom: 1px solid #f1f5f9; }
    .meta-table td:first-child { font-weight: 600; color: #64748b; width: 38%; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: 600; background: #e0f2fe; color: #0369a1; }
    .footer { background: #f8fafc; padding: 16px 24px; font-size: 12px; color: #64748b; text-align: center; border-top: 1px solid #e2e8f0; }
    .button { display: inline-block; background: #064e3b; color: #ffffff !important; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-weight: 600; font-size: 14px; margin-top: 15px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>GRAMSEVA | ಗ್ರಾಮ ಸೇವಾ</h1>
      <p>Honnur Gram Panchayat, Mandya District, Karnataka</p>
    </div>
    <div class="content">
      <p>Namaskara <strong>${userName || 'Citizen'}</strong>,</p>
      
      <div class="alert-box">
        <p>${message}</p>
      </div>

      ${issue ? `
      <table class="meta-table">
        <tr>
          <td>Issue / Complaint ID:</td>
          <td><strong>${issueId}</strong></td>
        </tr>
        <tr>
          <td>Category:</td>
          <td>${category}</td>
        </tr>
        <tr>
          <td>Current Status:</td>
          <td><span class="badge">${status}</span></td>
        </tr>
        <tr>
          <td>Location:</td>
          <td>${issue.location_text || 'Honnur Village'}</td>
        </tr>
        <tr>
          <td>Target Completion:</td>
          <td>${targetDate}</td>
        </tr>
      </table>
      ` : ''}

      ${issue && issue.status === 'RESOLVED' ? `
      <div style="text-align: center; margin: 25px 0;">
        <p style="font-weight: 600; font-size: 15px;">Has this issue been satisfactorily resolved?</p>
        <p style="font-size: 13px; color: #64748b;">Your feedback verifies completion or reopens the work if unresolved.</p>
        <a href="${feedbackUrl}" class="button">Verify Resolution & Give Feedback</a>
      </div>
      ` : ''}

      <p style="font-size: 13px; color: #64748b; line-height: 1.5; margin-top: 20px;">
        GramSeva is a proactive village infrastructure monitoring platform operated by Honnur Gram Panchayat.
      </p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Honnur Gram Panchayat, Government of Karnataka.</p>
      <p>This is an automated administrative notification. Please do not reply directly to this email.</p>
    </div>
  </div>
</body>
</html>
`;
}

module.exports = {
  createNotification,
  generateGramSevaEmailHtml
};
