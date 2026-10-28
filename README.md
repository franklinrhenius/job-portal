# Job Portal System — IA3 Full Stack Project

## Technologies
- Frontend: React + Vite + Bootstrap
- Backend: Node.js + Express.js
- Database: MongoDB Atlas + Mongoose

## Requirements
Install Node.js LTS first: https://nodejs.org/

## 1. Configure MongoDB
1. In MongoDB Atlas, create a database user and allow your current IP under Network Access.
2. Copy your Atlas connection string.
3. In `backend`, copy `.env.example` to `.env`.
4. Replace `YOUR_USERNAME` and `YOUR_PASSWORD` in `MONGO_URI`. Keep the URI on one line.
5. Do not share or upload `.env`.

Example:
`mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/JobPortalDB?retryWrites=true&w=majority`

If your password contains special characters, URL-encode them.

## 2. Install dependencies
Open the project folder in VS Code. Open two terminals.

Terminal 1:
```bash
cd backend
npm install
```

Terminal 2:
```bash
cd frontend
npm install
```

## 3. Run the application
Terminal 1:
```bash
cd backend
npm run dev
```

Terminal 2:
```bash
cd frontend
npm run dev
```

Open the local URL printed by Vite, usually http://localhost:5173.

## Features
- Create job postings
- View all jobs
- Search by title, company, or location
- Edit job postings
- Delete job postings
- MongoDB persistence
- Responsive Bootstrap-based interface

## API endpoints
- `GET /api/jobs` — list jobs, optional `?search=developer`
- `GET /api/jobs/:id` — get one job
- `POST /api/jobs` — create job
- `PUT /api/jobs/:id` — update job
- `DELETE /api/jobs/:id` — delete job
- `GET /api/health` — API status

This is a student demonstration project. Add authentication and further validation before using it for a real public job portal.
