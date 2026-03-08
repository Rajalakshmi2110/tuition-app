# Tuitix — Tuition Management System

A full-stack tuition centre management platform with role-based access for admins, tutors, and students. Handles class scheduling, assignments, file sharing, payments, performance tracking, and gamification.

**Live:** [rajituitionapp.netlify.app](https://rajituitionapp.netlify.app)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 (CRA), React Router 7, Axios |
| Backend | Node.js, Express 4, Mongoose 8 |
| Database | MongoDB Atlas |
| Auth | JWT + Google OAuth 2.0 (Passport.js) |
| File Storage | Cloudinary |
| Email | Nodemailer (Gmail SMTP) |
| Deployment | Netlify (frontend), Render (backend) |

## Features

- **Auth** — Email/password registration, Google OAuth, password reset via email, JWT sessions
- **Roles** — Admin (full control + tutor approval workflow), Tutor (classes, assignments, grading), Student (enrollment, submissions, payments)
- **Classes** — Create, schedule, assign tutors, enroll students by class level (8–12)
- **Assignments** — Create with file attachments, student submissions, grading with feedback
- **Files** — Upload/download study materials via Cloudinary, role-based access
- **Payments** — GPay QR screenshot upload, admin verification workflow, monthly tracking
- **Performance** — Exam records, grade calculation, subject-wise analytics
- **Gamification** — Badges, points, levels, streaks, leaderboard
- **Announcements** — Global and class-specific, admin-managed
- **Gallery** — Educational content sharing
- **Dark Mode** — System-wide theme toggle with CSS variables

## Project Structure

```
tuition-app/
├── backend/
│   ├── config/          # Cloudinary, Passport.js
│   ├── controllers/     # Route handlers (15 controllers)
│   ├── Middleware/       # auth, file upload, ObjectId validation
│   ├── models/          # Mongoose schemas (17 models)
│   ├── routes/          # Express routes (21 route files)
│   ├── services/        # Email service
│   ├── uploads/         # Local file storage (gitignored)
│   ├── seed.js          # Admin user seeder
│   └── server.js        # App entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI (Layout, Header, Sidebar, etc.)
│   │   ├── pages/       # Route pages (35 pages)
│   │   ├── services/    # Axios API client with interceptors
│   │   ├── config/      # API base URL config
│   │   ├── contexts/    # Theme context
│   │   └── styles/      # theme.css, animations.css, layout.css
│   └── public/
└── package.json         # Root scripts (dev, build, start)
```

## Quick Start

```bash
git clone <repository-url>
cd tuition-app

# Backend
cd backend
npm install
cp .env.example .env     # Fill in your values
npm run seed             # Create admin user (requires ADMIN_EMAIL + ADMIN_PASSWORD in .env)
npm start                # http://localhost:5000

# Frontend (new terminal)
cd frontend
npm install
npm start                # http://localhost:3000

# Or run both from root
cd ..
npm run dev
```

## Environment Variables

Create `backend/.env` from `backend/.env.example`:

```env
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/tuitionApp
JWT_SECRET=your-jwt-secret
PORT=5000
NODE_ENV=production

# Email (Gmail SMTP)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Frontend URL (for CORS + email links)
FRONTEND_URL=https://rajituitionapp.netlify.app

# Admin seed
ADMIN_EMAIL=admin@tuitix.com
ADMIN_PASSWORD=change-me-to-a-strong-password

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
SESSION_SECRET=your-session-secret
```

Frontend auto-detects environment — uses `localhost:5000` in dev, Render URL in production (see `frontend/src/config/apiConfig.js`). Override with `REACT_APP_USE_LOCAL=true`.

## Security

- Helmet HTTP headers
- MongoDB query injection prevention (express-mongo-sanitize)
- Rate limiting on auth routes
- JWT auth with role-based middleware (protect, adminOnly, tutorOnly)
- Global ObjectId validation on all route params
- File upload limits (10 MB) with type whitelist
- Path traversal protection on file serving routes
- Mass assignment protection on class updates
- CORS whitelist (Netlify + localhost)
- No error message leaks in API responses

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
