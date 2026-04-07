# DiaSense — Diabetes Risk Prediction Platform

A modern full-stack web application for predicting diabetes risk using health parameters.

## Tech Stack
- **Frontend:** React + Vite, Framer Motion, Lucide Icons
- **Backend:** Python FastAPI, SQLAlchemy, SQLite, bcrypt

## Setup

### Backend
```bash
cd backend
pip install -r requirements.txt
python main.py
```
Backend runs on `http://localhost:8000`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`

## Features
- User Registration & Login with secure password hashing
- Forgot Password / Reset Password flow
- Diabetes risk prediction based on health metrics
- Beautiful, responsive UI with animations
