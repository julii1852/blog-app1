# Blog App (Minimal Full-Stack)
This repository contains a **minimal** full-stack blog application implementing:
- user registration / login (JWT)
- create/edit/delete posts
- public posts and "on-request" (private) posts
- follow/unfollow users (subscriptions)
- feed generation based on subscriptions
- tags support and filtering
- comments on posts

**Stack**
- Backend: Node.js, Express, MongoDB (Mongoose), JWT
- Frontend: Plain HTML + JavaScript (fetch API)

---

## Quick setup (local)

### Prerequisites
- Node.js (>=16)
- MongoDB (local or Atlas). Example connection string: `mongodb://localhost:27017/blogapp`

### Backend
```bash
cd backend
npm install
# create .env file (or set env vars) with:
# MONGODB_URI=mongodb://localhost:27017/blogapp
# JWT_SECRET=your_jwt_secret_here
node server.js
```

Backend runs on http://localhost:4000 by default.

### Frontend
Open `frontend/index.html` in a browser (you can use a static server or open file directly). The demo frontend is minimal and uses `fetch` to call the backend.

---

## What is included
- `backend/` - express server, routes for auth, users, posts, comments
- `frontend/` - simple single-page frontend for demo interactions
- `analysis_and_recommendations.md` - required analysis (>=7 points) and remediation recommendations

---

## Notes
This is a minimal educational starter project. For production, follow recommendations in `analysis_and_recommendations.md` (CORS, HTTPS, validation, rate-limiting, file uploads, tests, CI/CD, etc.)
