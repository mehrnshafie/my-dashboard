# OPO Social Hub — My Dashboard

A social media command center for managing **OPO Broker** and **ForFX Prop Firm** across Instagram, Telegram, and YouTube.

## Features

- **Authentication** — Login and sign-up screens with basic client-side validation
- **Dashboard Overview** — Brand summary strips showing combined audience (266.9K+), per-channel follower counts, scheduled posts, inbox preview, and weekly engagement stats
- **Analytics** — Platform breakdown (Instagram, Telegram, YouTube) with follower counts, engagement rates, and growth metrics
- **Content Calendar** — Weekly view of scheduled posts across all brands and platforms
- **Posts Library** — Grid of published and draft posts with status badges
- **Videos** — YouTube and Reel content cards with view counts
- **Campaigns** — Active and paused marketing campaigns with reach and follower stats
- **Brand Pages** — Dedicated pages for OPO Broker and ForFX Prop with channel overviews and activity feeds
- **Reports** — Combined weekly performance summary across both brands
- **Settings** — Theme toggle, notification status, connected platforms, and sign-out
- **Dark / Light Mode** — Persistent theme preference saved to `localStorage`, applied before first paint to avoid flash

## Project Structure

```
my-dashboard/
├── index.html   # HTML markup and page structure
├── style.css    # All styles including dark mode overrides and responsive breakpoints
└── script.js    # Theme switching, auth flow, and page routing logic
```

## How to Run

No build step required — open `index.html` directly in any modern browser:

```bash
open index.html
# or just double-click index.html in Finder
```

To serve over HTTP (avoids any file:// restrictions):

```bash
npx serve .
# then open http://localhost:3000
```
