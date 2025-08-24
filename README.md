# Tuitix – Smart Tuition Management System

A comprehensive tuition management platform designed to streamline educational administration, student engagement, and payment processing.

## Features

### ✅ Completed Features
- **User Management System**
  - Student Registration & Management
  - Tutor Registration with Admin Approval
  - Role-based Authentication (Admin, Tutor, Student)
  - Secure Password Reset with Email Verification

- **Class Management**
  - Class Schedule Updates
  - Class Creation & Assignment
  - Student Enrollment System

- **File Management**
  - Document Upload & Storage (Cloudinary Integration)
  - File Sharing Between Tutors & Students
  - Assignment Submission System

- **Communication**
  - Feedback System
  - Announcement Management
  - Gallery for Educational Content

## 🚀 Development Roadmap

### Phase 1: Enhanced Communication & Notifications
- **Email Notification System**
  - Tutor approval/decline notifications
  - Student registration confirmation emails
  - Tutor application pending notifications
- **Authentication Enhancements**
  - OAuth Google Integration
  - Google Two-Factor Authentication (2FA)
  - Sign in with Google option

### Phase 2: Payment & Performance
- **Payment Gateway Integration**
  - Fee payment processing
  - Automated payment reminders
  - Payment history tracking
- **Performance Analytics**
  - AI-powered student performance analysis
  - Progress tracking and reporting
  - Personalized learning insights

### Phase 3: User Experience Enhancement
- **Frontend Improvements**
  - Home page redesign and enhancement
  - About page with comprehensive information
  - Three distinct login portals (Admin/Tutor/Student)
- **Student Dashboard**
  - Performance metrics visualization
  - Assignment tracking
  - Payment status overview

### Phase 4: Advanced Features
- **Live Learning Platform**
  - Real-time online classes
  - Interactive whiteboard for tutors
  - Screen sharing capabilities
- **Real-time Communication**
  - Chat system using Socket.io
  - Study rooms for group discussions
  - AI-powered chatbot for instant support

## Tech Stack

- **Frontend:** React/Next.js
- **Backend:** Node.js with Express
- **Database:** MongoDB
- **Authentication:** JWT, OAuth (Google)
- **Email Service:** Nodemailer with Gmail SMTP
- **File Storage:** Cloudinary
- **Real-time Communication:** Socket.io
- **Payment Processing:** Stripe/Razorpay (Planned)
- **AI Integration:** OpenAI API (Planned)

## Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd tuition-app

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Start backend server
cd ../backend
npm start

# Start frontend development server
cd ../frontend
npm start
```

## Environment Setup

Create a `.env` file in the backend directory:

```env
MONGO_URI=mongodb://localhost:27017/tuitionApp
JWT_SECRET=your-jwt-secret
PORT=5000
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Project Structure

```
tuition-app/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── config/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── styles/
│   └── public/
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

MIT License

---

**Current Status:** Phase 1 Development - Password Reset System Completed ✅
