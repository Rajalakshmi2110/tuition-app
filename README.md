# Kalviyagam — Tuition Management System

A full-stack tuition centre management platform with role-based access for admins, tutors, and students. Handles class scheduling, assignments, study materials, payments, performance tracking, and gamification.

**Live:** [rajituitionapp.netlify.app](https://rajituitionapp.netlify.app)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 (CRA), React Router 7, Axios |
| Backend | Node.js, Express 4, Mongoose 8 |
| Database | MongoDB Atlas |
| Auth | JWT + Google OAuth 2.0 (Passport.js) |
| Email | Nodemailer (Gmail SMTP) |
| Deployment | Netlify (frontend), Render (backend) |

## Features

- **Auth** — Email/password registration, Google OAuth, password reset via email, JWT sessions
- **Roles** — Admin (full control + approval workflow), Tutor (sessions, assignments, grading, study materials), Student (enrollment, submissions, payments)
- **Sessions** — Create, schedule, assign tutors, hierarchical class → subject dropdowns (Class 6–12)
- **Assignments** — Create with class → subject hierarchy, student submissions, grading with feedback
- **Study Materials** — Upload/manage resources organized by class, subject & category. Students see materials matching their registered class + subjects
- **Payments** — GPay QR screenshot upload, admin verification workflow, monthly tracking, email reminders
- **Performance** — Exam records, grade calculation, subject-wise analytics
- **Gamification** — Badges, points, levels, streaks, leaderboard
- **Email Notifications** — Registration, approval/decline, password reset, payment status
- **Gallery** — Educational content sharing
- **Mobile Responsive** — Hamburger menu, drawer sidebar, responsive grids and tables

## Project Structure

```
tuition-app/
├── backend/
│   ├── config/          # Passport.js (Google OAuth)
│   ├── controllers/     # Route handlers (15 controllers)
│   ├── Middleware/       # auth, file upload, ObjectId validation
│   ├── models/          # Mongoose schemas (17 models)
│   ├── routes/          # Express routes (21 route files)
│   ├── services/        # Email service (Nodemailer)
│   ├── uploads/         # Local file storage (gitignored)
│   ├── seed.js          # Admin user seeder
│   └── server.js        # App entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI (Layout, Header, Sidebar, Toast, etc.)
│   │   ├── constants/   # Shared data (CLASS_LEVELS, SUBJECTS_BY_CLASS)
│   │   ├── pages/       # Route pages (30+ pages)
│   │   ├── services/    # Axios API client with interceptors
│   │   ├── config/      # API base URL config
│   │   ├── contexts/    # Theme context
│   │   └── styles/      # theme.css, animations.css, layout.css
│   └── public/
└── README.md
```

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org) v18+
- [Git](https://git-scm.com)
- MongoDB Atlas account (or local MongoDB)

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
JWT_SECRET=your-jwt-secret
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Email — see "Email Setup" section below
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-char-app-password

# Google OAuth — see "Google OAuth Setup" section below
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Admin seed
ADMIN_EMAIL=admin@kalviyagam.com
ADMIN_PASSWORD=change-me-to-a-strong-password
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

## Email Setup (Gmail SMTP)

Email notifications are used for registration confirmations, admin approvals, password resets, and payment updates.

1. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. **2-Step Verification** must be enabled on your Google account first
3. Generate an app password — name it "Kalviyagam"
4. Google gives you a 16-character password (e.g. `abcd efgh ijkl mnop`)
5. Update `backend/.env`:
   ```env
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASS=abcdefghijklmnop
   ```

> **Note:** Remove spaces from the app password. If you don't configure email, the app still works — emails are skipped gracefully.

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
9. Add **Authorized redirect URIs**:
   - `http://localhost:5000/api/auth/google/callback` (local dev)
   - `https://your-backend-url.onrender.com/api/auth/google/callback` (production — add later)
10. Click **Create** — copy the Client ID and Client Secret
11. Update `backend/.env`:
    ```env
    GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
    GOOGLE_CLIENT_SECRET=GOCSPX-your-client-secret
    ```

> **Note:** If Google OAuth credentials are not set, the app still works — the "Continue with Google" button will show an error message, but email/password login works fine.

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
- Global ObjectId validation on all route params
- File upload limits (10 MB) with MIME type whitelist
- Path traversal protection on file serving routes
- CORS whitelist (Netlify + localhost)
- No stack traces in production error responses

## Scripts

| Command | Location | Description |
|---------|----------|-------------|
| `npm run dev` | root | Run backend + frontend concurrently |
| `npm start` | backend | Start production server |
| `npm run seed` | backend | Seed admin user |
| `npm start` | frontend | Start dev server |
| `npm run build` | frontend | Production build |

## License

MIT
