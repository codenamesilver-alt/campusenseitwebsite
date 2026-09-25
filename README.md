# Campusense IT — Landing Page + Contact Backend

An elegant, dark & green themed landing page for **Campusense IT** with a working
contact form that emails submissions via Gmail SMTP.

## Getting emails to work (one-time setup)

The contact form sends its submissions by email to **syedmoosirazaabidi@gmail.com**
using Gmail's SMTP. It needs YOUR Gmail + an **App Password**.

### 1. Create a Gmail App Password
1. Go to your Google account: https://myaccount.google.com/security
2. Turn on **2-Step Verification** (required for app passwords).
3. Search for **"App passwords"** (Security → App passwords).
4. Name it something like `Campusense Website`, create it, and copy the
   **16-character** password (shown once).

### 2. Fill in your credentials
Open `.env` and replace only the `REPLACE_WITH_...` values:

```
SMTP_USER=your.gmail@gmail.com
SMTP_PASS=your-16-character-app-password
```

The recipient is already set:
```
RECIPIENT_EMAIL=syedmoosirazaabidi@gmail.com
```
(Leave it unless you want the form to go somewhere else.)

> `.env` holds secrets — do not commit it to version control. `.env.example`
> is a safe template you can commit.

### 3. Run the server
```bash
npm install       # first time only (already done)
npm start
```
Open **http://localhost:3000** and the site loads. Submitting the contact form
will now send you an email.

## How it works
- The page is served by `server.js` (Express) at `/` (the `index.html` file).
- The contact form POSTs JSON to `/api/contact`.
- `server.js` validates the input and sends an HTML email via Nodemailer/Gmail.
- `GET /api/health` returns `{"status":"ok"}` to confirm the server is up.

## Files
- `index.html` — the landing page (Bootstrap + custom CSS/JS).
- `server.js` — Express backend + email sending.
- `package.json` — dependencies (express, nodemailer, cors, dotenv).
- `.env` / `.env.example` — email configuration.

## Notes
- Works locally. To go live, deploy this Node app to any host (Render, Railway,
  Vercel serverless, a VPS) and set the same `.env` variables there.
- Audio autoplay: browsers block sound autoplay; the soundtrack starts muted on
  load and unmutes on the visitor's first interaction.
