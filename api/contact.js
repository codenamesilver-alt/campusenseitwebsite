const nodemailer = require('nodemailer');

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method not allowed.' });
  }

  const {
    name = '',
    email = '',
    company = '',
    service = '',
    message = ''
  } = req.body || {};

  if (!name.trim() || !email.trim() || !message.trim()) {
    return res.status(400).json({ success: false, error: 'Name, email and message are required.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, error: 'Please provide a valid email address.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const mailOptions = {
      from: `"Campusense IT Website" <${process.env.SMTP_USER}>`,
      to: process.env.RECIPIENT_EMAIL || process.env.SMTP_USER,
      replyTo: email,
      subject: `New Website Inquiry from ${name}`,
      html: `
        <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:auto;border:1px solid #2fbf6d;border-radius:12px;overflow:hidden;">
          <div style="background:#07130c;padding:20px;text-align:center;">
            <h2 style="color:#3ddc84;margin:0;">Campusense IT</h2>
            <p style="color:#9fb8a8;margin:4px 0 0;">New Contact Form Submission</p>
          </div>
          <div style="padding:24px;background:#ffffff;color:#222;">
            <table style="width:100%;border-collapse:collapse;font-size:15px;">
              <tr><td style="padding:8px 0;color:#666;width:140px;"><strong>Name</strong></td><td style="padding:8px 0;color:#222;">${escapeHtml(name)}</td></tr>
              <tr><td style="padding:8px 0;color:#666;"><strong>Email</strong></td><td style="padding:8px 0;color:#222;">${escapeHtml(email)}</td></tr>
              <tr><td style="padding:8px 0;color:#666;"><strong>Company</strong></td><td style="padding:8px 0;color:#222;">${escapeHtml(company || '—')}</td></tr>
              <tr><td style="padding:8px 0;color:#666;"><strong>Service</strong></td><td style="padding:8px 0;color:#222;">${escapeHtml(service || '—')}</td></tr>
            </table>
            <hr style="border:none;border-top:1px solid #e5e5e5;margin:16px 0;">
            <p style="color:#666;margin:0 0 6px;"><strong>Message</strong></p>
            <p style="color:#222;margin:0;line-height:1.6;white-space:pre-wrap;">${escapeHtml(message)}</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Email send error:', err);
    return res.status(500).json({ success: false, error: 'We could not send your message right now. Please try again later.' });
  }
};
