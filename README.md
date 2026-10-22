# EventHub Ticket Booking System

React + Express.js + MongoDB (Mongoose) — ITUE301 SET F.

## Prerequisites
- Node.js 18+
- MongoDB running locally (or a MongoDB Atlas URI)

## Backend Setup
1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env` and set `PORT`, `MONGO_URI`, `JWT_SECRET`.
4. (Optional) Load sample events: `npm run seed`
5. Start the server: `npm start`

The backend runs from `server.js` — `npm start` executes `node server.js`
(`npm run dev` does the same with auto-restart). API base: `http://localhost:5000/api/v1`.

## Frontend Setup
1. `cd frontend`
2. `npm install`
3. `npm run dev`
4. Open `http://localhost:5173`

The Vite dev server proxies `/api` requests to `http://localhost:5000`, so start the backend first.

## Usage
- Log in with any email. Unknown emails are auto-created as attendees.
- An email containing the word `organizer` (e.g. `organizer@test.com`) gets the `organizer` role and can open `/organizer`.
- Redirects: no token -> `/` (login); wrong role -> `/events`.

## Endpoints
| Method | Path | Auth |
|--------|------|------|
| POST | /api/v1/auth/login | Public |
| GET | /api/v1/events | Public |
| POST | /api/v1/tickets | Bearer JWT |
| GET | /api/v1/tickets/my | Bearer JWT |
| PATCH | /api/v1/tickets/:id/status | Bearer JWT |
