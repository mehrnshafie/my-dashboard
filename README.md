# OPO Social Hub

A full-stack social media command center for managing **OPO Broker** and **ForFX Prop Firm** across Instagram, YouTube, and Telegram.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vanilla HTML / CSS / JavaScript (no build step) |
| Backend | Node.js + Express |
| ORM | Prisma |
| Database | PostgreSQL |
| Password hashing | bcrypt |

---

## Project Structure

```
my-dashboard/
├── frontend/
│   ├── index.html      # All pages (SPA via JS routing)
│   ├── style.css       # Dark/light mode, full design system
│   └── script.js       # Auth flow, page routing, Social Posts CRUD
├── backend/
│   ├── .env            # ← NOT in git (copy from .env.example)
│   ├── .env.example    # Safe template — commit this
│   ├── server.js       # Entry point — starts Express on PORT
│   ├── app.js          # Express app, CORS, route wiring
│   ├── routes/         # auth, brands, posts, social-posts, campaigns, analytics
│   ├── controllers/    # Business logic for each route group
│   └── prisma/
│       ├── schema.prisma
│       └── migrations/ # All migration files — committed to git
├── .gitignore
└── README.md
```

---

## Features

- **Authentication** — Register and login with bcrypt-hashed passwords; user name displayed in header after login
- **Social Posts** — Full CRUD (create, read, update, delete) backed by the `social_posts` table; platform/status badges, inline edit modal, delete confirmation
- **Dashboard Overview** — Brand summary strips, per-channel follower counts, scheduled posts, inbox preview, weekly engagement stats
- **Analytics** — Platform breakdown (Instagram, Telegram, YouTube) with follower counts, engagement rates, growth metrics
- **Content Calendar** — Weekly view of scheduled posts across all brands
- **Campaigns** — Active and paused marketing campaigns with reach and follower stats
- **Brand Pages** — Dedicated pages for OPO Broker and ForFX Prop
- **Reports** — Combined weekly performance summary across both brands
- **Dark / Light Mode** — Persistent via `localStorage`, applied before first paint

---

## Local Setup

### Prerequisites

- Node.js ≥ 18
- PostgreSQL running locally (or update `DATABASE_URL` to point elsewhere)

### 1. Clone the repo

```bash
git clone https://github.com/mehrnshafie/my-dashboard.git
cd my-dashboard
```

### 2. Set up the backend

```bash
cd backend
cp .env.example .env          # then fill in your real DATABASE_URL and PORT
npm install
npx prisma migrate dev        # creates all tables in your database
```

### 3. Start the backend server

```bash
npm run dev       # starts with --watch (auto-restarts on file changes)
# or
npm start         # production start
```

Server runs on `http://localhost:3001` by default (set `PORT` in `.env` to change).

### 4. Open the frontend

No build step required — open `frontend/index.html` directly in any browser:

```bash
open frontend/index.html
```

Or serve it over HTTP to avoid any `file://` restrictions:

```bash
npx serve frontend
# then open http://localhost:3000
```

> **Note:** `frontend/script.js` has a single line `const API = 'http://localhost:3001'` near the top. Update this if your backend runs on a different host or port.

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/auth/register` | Create account (name, email, password, role) |
| `POST` | `/api/auth/login` | Login → returns name and role |
| `GET` | `/api/social-posts` | All posts, newest first |
| `POST` | `/api/social-posts` | Create post |
| `PUT` | `/api/social-posts/:id` | Update post |
| `DELETE` | `/api/social-posts/:id` | Delete post |
| `GET` | `/api/brands` | List brands |
| `GET` | `/api/campaigns` | List campaigns |
| `GET` | `/api/analytics` | List analytics records |

---

## Database

Managed by Prisma. Migration files are committed to git — teammates can apply them by running:

```bash
cd backend
npx prisma migrate dev
```

Key models: `User`, `Brand`, `Channel`, `SocialPost`, `Post`, `Campaign`, `Analytics`.
