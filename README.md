# 🚀 Full-Stack Task & Internship Tracker

A full-stack web application built to help users track tasks or internship/job applications with authentication, status management, and a clean user interface.

This project demonstrates end-to-end web development skills, including frontend, backend, authentication, database design, and REST API integration.

---

## ✨ Features

- 🔐 User Authentication (Signup / Login)
- 🛡️ JWT-based protected routes
- 📝 Create, edit, and delete tasks / applications
- 📊 Status tracking (Applied / Interview / Completed / Pending)
- 🔍 Search and filter functionality
- 👤 User-specific data isolation
- 🌙 Dark mode support
- 📱 Responsive UI

---

## 🛠️ Tech Stack

### Frontend
- React
- JavaScript / TypeScript
- Tailwind CSS
- React Router

### Backend
- Node.js
- Express.js
- JWT Authentication
- bcrypt (password hashing)

### Database
- MongoDB
- Mongoose

### Tools & Deployment
- Git & GitHub
- Postman (API testing)
- Vercel / Netlify (Frontend)
- Render / Railway (Backend)
- MongoDB Atlas

---

## 🧠 System Design Overview

- Frontend communicates with backend via REST APIs
- JWT is used for authentication and authorization
- Protected routes are secured using middleware
- Each user has isolated access to their own data
- MongoDB schemas manage users and task/application data

---

## 📂 Folder Structure

client/
├── src/
│ ├── components/
│ ├── pages/
│ ├── services/
│ └── App.jsx

server/
├── controllers/
├── models/
├── routes/
├── middleware/
└── server.js

---

## 🔐 Authentication Flow

1. User registers or logs in
2. Passwords are securely hashed using bcrypt
3. JWT token is generated on successful login
4. Token is stored on the client
5. Protected routes verify the token using middleware

---

## 📡 API Endpoints (Sample)

### Auth
- POST `/api/auth/register`
- POST `/api/auth/login`

### Tasks / Applications
- GET `/api/tasks`
- POST `/api/tasks`
- PUT `/api/tasks/:id`
- DELETE `/api/tasks/:id`

---

## 🧪 Run Locally

### 1️⃣ Clone the repository

-git clone https://github.com/your-username/task-tracker.git
-cd task-tracker

### 2️⃣ Backend setup

-cd server
-npm install
-npm run dev

## Create a .env file:

-MONGO_URI=your_mongodb_url
-JWT_SECRET=your_secret_key

### 3️⃣ Frontend setup

-cd client
-npm install
-npm run dev

## 🎯 Purpose of the Project

This project was built to:
Practice real-world full-stack development
Understand authentication and authorization
Design scalable REST APIs
Build production-ready applications
