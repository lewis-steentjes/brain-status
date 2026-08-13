# brain-status

Hosts the **brain** PWA. GitHub Pages serves this repo at
<https://lewis-steentjes.github.io/brain-status/>.

This repo used to hold a static status page that the ThinkPad pushed to every
five minutes. That box is being decommissioned, so the repo was repurposed:
Pages is already configured here, and the app shell — unlike the data — is not
secret and can live in public.

## What's here

Everything is the app. No build step, no framework, no CDN: it must render with
no network, so there is nothing to fetch but the data.

| File | |
|---|---|
| `index.html` | the whole app — UI, markdown renderer, GitHub API client |
| `sw.js` | service worker; caches the shell only, never `api.github.com` |
| `manifest.webmanifest` | PWA manifest — standalone display, icons |
| `icon-*.png`, `icon.svg` | home screen icons; the SVG is the source |
| `.nojekyll` | serve files as-is, no Jekyll processing |

## What it does *not* contain

Any data. Nothing personal is published here, and nothing should ever be
committed to this repo that you would not put on a billboard.

The app reads private state from
[`brain-state`](https://github.com/lewis-steentjes/brain-state) at runtime,
using a fine-grained personal access token that the user pastes on first open
and that never leaves their device. That is the whole reason the shell and the
data are separated.

## Installing

Open the Pages URL in Safari, then Share → **Add to Home Screen**. The install
step is not cosmetic: iOS gives home-screen web apps storage that survives
Safari's eviction of unused site data, so a plain bookmark will silently lose
the saved token in a way the installed app will not.

Token scope: repository access limited to `brain-state`, with **Contents: read**
to view and **Actions: read and write** for the "Run now" buttons.

## Source

Developed in `brain-state/app/` and moved here so the deployed shell and its
source are the same thing. See
[`brain-hub`](https://github.com/lewis-steentjes/brain-hub) for how the pieces
fit together.
