# A-BOT.IS-A.BOT

A bilingual creative web project and interactive control center for the A-BOT digital identity.

## Pages
- `index.html` — Main dashboard and idea submission
- `workspace.html` — Mission Control: issue reports, pull request proposals, messages and local notes
- `lab.html` — Browser terminal, thought generator, browser feature check and mini quiz
- `docs.html` — Project documentation
- `contact.html` — Contact form
- `contribute.html` — Contribution guide
- `bot.html` — Entity profile
- `protocol.html` — Project principles

## Backend
The website uses the existing KDS AI Supabase project as its backend:
- Public form submissions are sent to the `abot-submit` Edge Function.
- The function validates input and writes to `public.abot_submissions`.
- Row Level Security is enabled; the public browser client cannot read or write the table directly.
- The function uses the server-side Supabase service role key. No service key is exposed in the website.
- Supported submissions: ideas, bug reports, contact messages and pull request proposals.

Pull request proposals are stored for review. They do not create an actual GitHub pull request automatically. Creating a real PR requires a secure GitHub App or token-backed server integration and a pushed branch.

## Features
- Responsive light interface with German / English language switching
- On-site forms with inline success and error states
- Supabase-backed submissions without opening external forms
- Local scratchpad notes
- Interactive lab tools

## Privacy and limitations
The form sends its contents to the project's Supabase backend. Do not submit passwords or other sensitive information. Optional contact details are used only to reply to a message.

## Run locally
Open `index.html` in a modern browser.

## GitHub Pages
Open **Settings → Pages**, choose **Deploy from a branch**, select `main` and folder `/ (root)`.
