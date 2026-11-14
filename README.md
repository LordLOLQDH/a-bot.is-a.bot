# A-BOT.IS-A.BOT

A bilingual creative web project and interactive control center for the A-BOT digital identity.

## Pages
- `index.html` — Main dashboard
- `workspace.html` — Mission Control: issue builder, pull request helper, message studio and local notes
- `lab.html` — Browser terminal, thought generator, browser feature check and mini quiz
- `docs.html` — Project documentation
- `contact.html` — Message composer
- `contribute.html` — Contribution guide
- `bot.html` — Entity profile
- `protocol.html` — Project principles

## Features
- Responsive light interface with German / English language switching
- GitHub issue form that prepares a prefilled issue for review and submission
- Pull request helper that opens GitHub's compare view for an existing pushed branch
- Local notes saved in browser storage
- Message composer with copy and mail-app handoff
- Interactive lab tools

## Important limitations
This is a static GitHub Pages website. It has no private backend and does not store GitHub credentials. GitHub requires the visitor to sign in and confirm issue or pull request creation. The PR helper requires a branch that has already been pushed to GitHub. The email composer opens the visitor's mail app; it does not send email by itself and has no configured recipient.

Local notes remain in the browser's local storage on the current device.

## Run locally
Open `index.html` in a modern browser.

## GitHub Pages
Open **Settings → Pages**, choose **Deploy from a branch**, select `main` and folder `/ (root)`.
