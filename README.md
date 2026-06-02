# Kalviyagam — Tuition Management System

A full-stack tuition centre management platform with role-based access for admins, tutors, and students. Handles class scheduling, assignments, study materials, payments, performance tracking, and gamification.

**Live:** [kalviyagam.vercel.app](https://kalviyagam.vercel.app)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 (CRA), React Router 7, Axios |
| Backend | Node.js, Express 4, Mongoose 8 |
| Database | MongoDB Atlas |
| Auth | JWT + Google OAuth 2.0 (Passport.js) |
| File Storage | Cloudinary (images, documents, screenshots) |
| AI | Groq API (Llama 3.1 text + Llama 3.2 vision) |
| Email | Resend (HTTP API) with Nodemailer (local dev) |
| Deployment | Vercel (frontend), Render (backend) |

## Features

- **Auth** — Email/password registration, Google OAuth, password reset via email, JWT sessions
- **Roles** — Admin (full control + approval workflow), Tutor (sessions, assignments, grading, study materials), Student (enrollment, submissions, payments)
- **Profile** — Editable profile page for students (name, email, class, subjects) and tutors (name, email, specialization)
- **Sessions** — Create, schedule, assign tutors with time-slot dropdowns, automatic tutor conflict detection (Class 6–12). Students only see sessions matching their registered class + subjects
- **Assignments** — Create with class → subject hierarchy, student submissions, grading with feedback
- **Study Materials** — Upload/manage resources via Cloudinary, organized by class, subject & category. Students see materials matching their registered class + subjects
- **Payments** — GPay QR screenshot upload (Cloudinary), admin verification workflow, monthly tracking, email reminders
- **Performance** — Exam records, grade calculation, subject-wise analytics
- **Gamification** — Badges, points, levels, streaks, leaderboard
- **AI Doubt Clarification** — ChatGPT-style AI tutor powered by Groq (Llama 3.1 for text, Llama 3.2 Vision for image questions). Conversation threads with history persistence, image attachment support
- **Notifications** — Real-time in-app notification system with bell icon, unread count, auto-polling. Triggered on registrations, approvals, assignments, payments, announcements, resources
- **Email Notifications** — Branded HTML email templates for registration, approval/decline, password reset, payment status, admin alerts on new registrations
- **Gallery** — Educational content sharing with Cloudinary-hosted images
- **Announcements** — Admin can post global announcements from any admin page
- **Exam Schedule** — Students add upcoming exam timetables, visible to admin and tutors with filters
- **Dark Mode** — Full light/dark theme support across all dashboards with CSS variables
- **Mobile Responsive** — Hamburger menu, drawer sidebar, responsive grids and tables

## Project Structure

```
tuition-app/
├── backend/
│   ├── config/          # Passport.js (Google OAuth), Cloudinary config
│   ├── controllers/     # Route handlers (16 controllers)
│   ├── Middleware/       # auth, file upload, ObjectId validation
│   ├── models/          # Mongoose schemas (19 models)
│   ├── routes/          # Express routes (23 route files)
│   ├── services/        # Email service (Nodemailer), Notification service
│   ├── seed.js          # Admin user seeder
│   └── server.js        # App entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI (Layout, Header, Sidebar, Toast, NotificationDropdown, etc.)
│   │   ├── constants/   # Shared data (CLASS_LEVELS, SUBJECTS_BY_CLASS)
│   │   ├── pages/       # Route pages (35+ pages including AI Doubt, Profile)
│   │   ├── services/    # Axios API client with interceptors
│   │   ├── config/      # API base URL config, Cloudinary file URL helper
│   │   ├── contexts/    # Theme context
│   │   └── styles/      # theme.css, animations.css, layout.css
│   └── public/
└── README.md
```

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org) v18+
- [Git](https://git-scm.com)
- MongoDB Atlas account
- Cloudinary account (free tier)

### 1. Clone & Install

```bash
git clone https://github.com/Rajalakshmi2110/tuition-app.git
cd tuition-app

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment

Create `backend/.env` (copy from `backend/.env.example`):

```env
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/tuitionApp
JWT_SECRET=generate-a-strong-random-secret
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Email — see "Email Setup" section below
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-char-app-password

# Google OAuth — see "Google OAuth Setup" section below
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Cloudinary — see "Cloudinary Setup" section below
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# AI Doubt Clarification (Groq) — see "Groq AI Setup" section below
GROQ_API_KEY=your-groq-api-key

# Admin seed
ADMIN_EMAIL=admin@kalviyagam.com
ADMIN_PASSWORD=change-me-to-a-strong-password
```

Generate a strong JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Seed Admin User

```bash
cd backend
npm run seed
```

### 4. Run

```bash
# Terminal 1 — Backend
cd backend
node server.js          # http://localhost:5000

# Terminal 2 — Frontend
cd frontend
npm start               # http://localhost:3000
```

Frontend auto-detects environment — uses `localhost:5000` in dev, Render URL in production (see `frontend/src/config/apiConfig.js`).

---

## Cloudinary Setup

Cloudinary is used for persistent file storage (gallery images, study materials, payment screenshots). Files survive server redeployments.

1. Go to [cloudinary.com](https://cloudinary.com) and sign up for a **free account**
2. From your **Dashboard**, copy:
   - Cloud Name
   - API Key
   - API Secret
3. Update `backend/.env`:
   ```env
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

**Free tier includes:** 25GB storage, 25GB bandwidth/month — more than enough for a tuition app.

Files are organized into folders:
- `kalviyagam/gallery/` — Gallery images
- `kalviyagam/resources/` — Study materials (PDFs, docs, images)
- `kalviyagam/payments/` — Payment screenshots

> **Note:** If Cloudinary credentials are not set, file uploads will fail. This is a required service for production.

> **Important:** In Cloudinary Dashboard → Settings → Security, ensure **"PDF and ZIP files delivery"** is set to **"Allow delivery of PDF and ZIP files"**. Without this, uploaded PDFs will return 401 errors.

---

## Email Setup

Email notifications are used for registration confirmations, admin approvals, password resets, and payment updates.

The app supports two email providers:
- **Resend** (HTTP API) — used in production (works on Render free tier)
- **Gmail SMTP** (Nodemailer) — used for local development

### Production: Resend (Recommended)

1. Go to [resend.com](https://resend.com) and create a free account
2. Go to **API Keys** → Create an API key
3. Copy the key and add to Render environment:
   ```env
   RESEND_API_KEY=re_your-api-key
   ```

**Free tier:** 100 emails/day, 3000 emails/month. Sends from `onboarding@resend.dev` by default.

> **Note:** Render's free tier blocks SMTP (port 465/587), so Gmail SMTP won't work in production. Resend uses HTTP API which bypasses this.

### Local Development: Gmail SMTP

1. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. **2-Step Verification** must be enabled on your Google account first
3. Generate an app password — name it "Kalviyagam"
4. Google gives you a 16-character password (e.g. `abcd efgh ijkl mnop`)
5. Update `backend/.env`:
   ```env
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASS=abcdefghijklmnop
   ```

> **Note:** Remove spaces from the app password. If neither Resend nor Gmail is configured, emails are skipped gracefully.

---

## Google OAuth Setup

Google Sign-In allows users to register/login with their Google account.

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a project (or select an existing one)
3. Go to **APIs & Services → Credentials**
4. If prompted, configure the **OAuth consent screen**:
   - Choose **External**
   - App name: `Kalviyagam`
   - Add your email as support and developer contact
   - Save and continue through the rest
5. Click **Create Credentials → OAuth Client ID**
6. Application type: **Web application**
7. Name: `Kalviyagam`
8. Add **Authorized JavaScript origins**:
   - `http://localhost:5000`
   - `https://tuitionapp-yq06.onrender.com`
9. Add **Authorized redirect URIs**:
   - `http://localhost:5000/api/auth/google/callback` (local dev)
   - `https://tuitionapp-yq06.onrender.com/api/auth/google/callback` (production)
10. Click **Create** — copy the Client ID and Client Secret
11. Update `backend/.env`:
    ```env
    GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
    GOOGLE_CLIENT_SECRET=GOCSPX-your-client-secret
    ```

> **Note:** If Google OAuth credentials are not set, the app still works — the "Continue with Google" button will show an error message, but email/password login works fine.

---

## Groq AI Setup

The AI Doubt Clarification feature uses Groq's API for fast LLM inference.

1. Go to [console.groq.com](https://console.groq.com) and create a free account
2. Go to **API Keys** → **Create API Key**
3. Copy the key and update `backend/.env`:
   ```env
   GROQ_API_KEY=gsk_your-groq-api-key
   ```

**Models used:**
- `llama-3.1-8b-instant` — Text-based doubt clarification (fast)
- `llama-3.2-11b-vision-preview` — Image analysis (when student attaches a photo)

> **Note:** If Groq API key is not set, the AI Doubt feature will show an error. All other features work independently.

---

## MongoDB Atlas Setup

The app uses MongoDB Atlas (cloud-hosted). You need your own free cluster.

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) and create a free account
2. Click **Build a Database** → choose **M0 (Free)** tier
3. Pick a cloud provider & region (any works), click **Create Cluster**
4. Under **Database Access** → **Add New Database User**:
   - Username & password (save these — you'll need them for the connection string)
5. Under **Network Access** → **Add IP Address**:
   - Click **Allow Access from Anywhere** (`0.0.0.0/0`) for development
   - Or add your specific IP for tighter security
6. Go back to **Database** → click **Connect** → **Drivers**
7. Copy the connection string and replace `<username>`, `<password>`, and `<dbname>`:
   ```env
   MONGO_URI=mongodb+srv://yourUsername:yourPassword@yourCluster.mongodb.net/kalviyagam
   ```
8. Paste it in `backend/.env`

> **Note:** The database and collections are created automatically when the app first connects — no manual setup needed.

---

## Academic Structure

The app targets **Class 6–12** students with the following subject mapping:

| Class | Subjects |
|-------|----------|
| 6–7 | Tamil, English, Maths, Science, Social Science |
| 8–10 | Tamil, English, Maths, Physics, Chemistry, Biology, Social Science |
| 11–12 | Stream-based: Science CS, Science Bio, or Commerce |

This mapping is defined in `frontend/src/constants/academic.js` and used across sessions, assignments, study materials, and performance tracking.

---

## Security

- Helmet HTTP headers
- MongoDB query injection prevention (express-mongo-sanitize)
- Rate limiting on auth routes (20 attempts per 15 min)
- JWT auth with role-based middleware (protect, adminOnly, tutorOnly)
- Strong random JWT secret (not default placeholder)
- Global ObjectId validation on all route params
- File upload limits (10 MB) with MIME type whitelist
- Cloudinary for secure file storage (no local file serving in production)
- CORS whitelist (Vercel + localhost)
- No stack traces in production error responses

## Scripts

| Command | Location | Description |
|---------|----------|-------------|
| `npm run dev` | root | Run backend + frontend concurrently |
| `npm start` | backend | Start production server |
| `npm run seed` | backend | Seed admin user |
| `npm start` | frontend | Start dev server |
| `npm run build` | frontend | Production build |

## Deployment

| Service | Purpose | URL |
|---------|---------|-----|
| Vercel | Frontend hosting | [kalviyagam.vercel.app](https://kalviyagam.vercel.app) |
| Render | Backend API | [tuitionapp-yq06.onrender.com](https://tuitionapp-yq06.onrender.com) |
| MongoDB Atlas | Database | Cloud-hosted (M0 free tier) |
| Cloudinary | File storage | Images, PDFs, screenshots |
| cron-job.org | Keep backend awake | Pings every 14 minutes |

## Keeping Backend Awake (Free Tier)

Render's free tier sleeps the server after 15 minutes of inactivity. To prevent cold starts for students:

1. Sign up at [cron-job.org](https://cron-job.org) (free)
2. Create a cronjob:
   - **URL:** `https://tuitionapp-yq06.onrender.com/api/health`
   - **Interval:** Every 14 minutes
3. Done — backend stays awake 24/7 at no cost

## License

MIT
