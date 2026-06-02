# Kalviyagam — Feature Documentation

Detailed breakdown of every feature in the Kalviyagam Tuition Management System.

🔗 **Live:** [kalviyagam.me](https://kalviyagam.me)
📂 **Source:** [github.com/Rajalakshmi2110/tuition-app](https://github.com/Rajalakshmi2110/tuition-app)

---

## Authentication & Authorization

- Email/password registration with admin approval workflow
- Google OAuth 2.0 (one-click sign in via Google account)
- Password reset via email with time-limited secure tokens
- JWT-based sessions with role-based route protection
- Three roles: Admin (full control), Tutor (teaching tools), Student (learning tools)

---

## Session Management

- Admin creates class sessions with subject, tutor, day, and time-slot
- Automatic tutor conflict detection — prevents double-booking a tutor at the same time
- Students only see sessions matching their registered class and subjects
- Session status tracking (Scheduled → Completed)

---

## Assignments & Grading

- Tutors create assignments with class → subject hierarchy, due dates, difficulty levels, and instructions
- Students submit answers with text content and file attachments (via Cloudinary)
- Resubmission allowed until graded or overdue
- Tutors grade with points and written feedback
- Students see all their submissions and grades in one place
- Gamification points awarded automatically based on score (90%+ = 20pts, 70%+ = 10pts, else 5pts)

---

## Study Materials

- Tutors upload resources (PDFs, images, docs) organized by class, subject, and category (Notes, Guides, Question Banks, etc.)
- Stored on Cloudinary — survives server redeployments, no local file dependencies
- Students only see materials matching their registered class + subjects
- Admin can manage all resources across all classes

---

## Payment System

- GPay QR code displayed on payment page with UPI ID
- Students upload payment screenshot after paying
- Admin verification workflow — approve or reject with reason
- Monthly payment tracking
- Email notifications on submission, approval, and rejection
- Payment reminder system for unpaid months

---

## Performance Tracking

- Exam records with subject-wise scores
- Grade calculation and analytics
- Subject-wise performance breakdown
- Integrated with gamification for automatic badge unlocking

---

## Gamification

- Points system — earn XP for assignments, streaks, and badges
- Levels — level up every 100 XP, increasing threshold per level
- Streaks — consecutive login days tracked, resets on missed days
- 6 badge types:
  - First Steps (1 assignment completed)
  - Assignment Master (10 assignments completed)
  - Streak Starter (3-day streak)
  - Dedication (7-day streak)
  - Excellence (90% average score)
  - Regular Student (30 login days)
- Automatic badge eligibility checking after every activity
- Leaderboard — ranked by total points, weekly, monthly, or streak
- All stats visible on the student Achievement dashboard

---

## AI Doubt Clarification

- ChatGPT-style conversational AI tutor
- Powered by Groq API (Llama 3.1 for text, Llama 3.2 Vision for images)
- Students type questions or attach photos of problems
- Full conversation history persistence — pick up where you left off
- Instant responses with educational context

---

## Notifications

- Real-time in-app notification system with bell icon and unread count
- Auto-polling for new notifications
- Triggered on: registrations, approvals, assignments, payments, announcements, exam schedules, resources
- Notification dropdown with mark-as-read functionality

---

## Email Notifications

- Branded HTML email templates with Kalviyagam branding
- Sent via Resend (HTTP API) — works on free hosting without SMTP
- Triggers:
  - Registration confirmation (student + tutor)
  - Admin alert on new registrations
  - Account approval/decline
  - Password reset link
  - Payment submission confirmation
  - Payment verified/rejected
- Verified custom domain (kalviyagam.me) for professional delivery

---

## Exam Schedule

- Students add upcoming exam timetables (subject, date, time, exam type)
- Visible to admin and tutors with type-based filters
- Admin and tutors can see all students' upcoming exams in one view
- In-app notifications sent to admin/tutors when students add exams

---

## Gallery

- Educational content sharing with Cloudinary-hosted images
- Admin manages gallery uploads

---

## Announcements

- Admin can post global announcements from any admin page
- All users receive in-app notifications for new announcements

---

## Dark Mode

- Full light/dark theme support across all dashboards
- CSS variables for consistent theming
- Toggle accessible from any page

---

## Mobile Responsive

- Hamburger menu with slide-in drawer sidebar on mobile
- Responsive grids that stack on smaller screens
- Touch-friendly interactions
- Works on all screen sizes

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 (CRA), React Router 7, Axios |
| Backend | Node.js, Express 4, Mongoose 8 |
| Database | MongoDB Atlas (M0 free tier) |
| Auth | JWT + Google OAuth 2.0 (Passport.js) |
| AI | Groq API (Llama 3.1 + 3.2 Vision) |
| Email | Resend (HTTP API) + Nodemailer (local dev) |
| File Storage | Cloudinary |
| Hosting | Vercel (frontend) + Render (backend) |
| Uptime | cron-job.org (pings backend every 14 min) |

---

## Deployment

| Service | Purpose | URL |
|---------|---------|-----|
| Vercel | Frontend hosting | [kalviyagam.me](https://kalviyagam.me) |
| Render | Backend API | [tuitionapp-yq06.onrender.com](https://tuitionapp-yq06.onrender.com) |
| MongoDB Atlas | Database | Cloud-hosted (M0 free tier) |
| Cloudinary | File storage | Images, PDFs, screenshots |
| Resend | Email delivery | HTTP API (100 emails/day free) |
| cron-job.org | Keep backend awake | Pings every 14 minutes |

---

## Key Learnings

- Deploying a full-stack app across multiple free-tier services (Vercel, Render, Atlas, Cloudinary, Resend)
- Working around SMTP limitations on free hosting by switching to HTTP-based email APIs
- DNS configuration for custom domains — connecting Namecheap, Vercel, and Resend
- Building role-based access control with admin approval workflows
- Integrating AI (LLM + Vision models) into a real product
- Implementing gamification that motivates consistent engagement
- Handling file uploads with cloud storage instead of local filesystem
