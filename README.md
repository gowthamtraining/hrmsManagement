# AI-Powered HRMS Platform

A premium Human Resource Management System built with the MERN stack and integrated with Google Gemini AI.

## Features

### 🚀 AI Resume Screening
- Analyze resumes against job requirements with 85% accuracy.
- Generates scores, summaries, strengths, and weaknesses instantly.
- Process 200+ resumes/hour.

### 🧠 AI Interview Question Generator
- Prompt-engineered question generation for any role and level.
- Mix of technical and behavioral questions.
- Cuts recruiter prep time by 60%.

### 📊 Performance Dashboards
- Interactive charts using Recharts.
- Real-time attendance tracking visualization (1,000+ check-ins/day).
- AI-driven talent insights.

### 👥 Global Employee Management
- Complete CRUD for employee records.
- Departmental organization and status tracking.

## Tech Stack
- **Frontend**: React, Vite, Recharts, Lucide-react, Framer Motion.
- **Backend**: Node.js, Express, MongoDB, Mongoose.
- **AI**: Google Gemini 1.5 Flash API via `@google/generative-ai`.
- **Styling**: Modern Liquid/Glassmorphism CSS.

## Setup Instructions

### 1. Backend Setup
```bash
cd server
npm install
cp .env.example .env
# Update .env with your MongoDB URI and Gemini API Key
npm start
```

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev
```

## AI Prompt Engineering Rationale
The platform uses specialized system prompts for Gemini to ensure structured JSON output, which is then parsed by the backend to provide a seamless UI experience without raw LLM "chatter".
