# Mini_Event_Platform

🎉 MiniEvents – MERN Stack Event Platform

A full-stack MERN web application that allows users to create, view, and RSVP to events, with strict capacity enforcement and concurrency safety.
Built as part of a Full Stack Developer Intern Technical Screening Assignment.

🚀 Live Demo

Frontend: https://mini-event-platform-pi.vercel.app/

Backend API: https://mini-event-platform-t5uf.onrender.com

GitHub Repository: https://github.com/jjnawaaz/Mini_Event_Platform

🧩 Tech Stack
Frontend

React.js

React Router DOM

Axios

Tailwind CSS

Lucide Icons

Backend

Node.js

Express.js

MongoDB + Mongoose

JWT Authentication

HTTP-only Cookies

Multer (Image Uploads)

MongoDB Transactions

Deployment

Frontend: Vercel

Backend: Render

Database: MongoDB Atlas

✨ Features
🔐 User Authentication

Secure Register & Login

JWT-based authentication stored in HTTP-only cookies

Persistent login with /auth/me

Protected routes for authenticated users

📅 Event Management

Authenticated users can:

Create events with:

Title

Description

Date & Time

Location

Capacity

Image upload

Edit & delete only their own events

View all upcoming events (public)

🎟 RSVP System (Critical Logic)

Users can RSVP or cancel RSVP

Strict capacity enforcement

No duplicate RSVPs

Concurrency-safe using MongoDB transactions

Prevents overbooking even under simultaneous requests

🖼 Image Uploads

Event images uploaded using Multer

Stored locally on backend (/uploads)

Served as static assets

📱 Responsive UI

Fully responsive design

Mobile sidebar navigation

Dark theme optimized for night events

🧠 RSVP Capacity & Concurrency Handling (Technical Explanation)

To prevent race conditions and overbooking:

RSVP logic is wrapped inside a MongoDB transaction

Steps inside the transaction:

Fetch event document

Check:

Event exists

User is not already RSVP’d

Capacity is not full

Add user to attendees array

Commit transaction

If any step fails, the transaction is aborted, ensuring data consistency.

const session = await mongoose.startSession();
session.startTransaction();

try {
const event = await Event.findById(id).session(session);

if (event.attendees.length >= event.capacity)
throw new Error("Event is full");

event.attendees.push(userId);
await event.save({ session });

await session.commitTransaction();
} catch {
await session.abortTransaction();
}

This guarantees atomic updates and prevents multiple users from taking the last seat simultaneously.

🗂 Folder Structure
Backend
server/
├── controllers/
├── routes/
├── models/
├── middleware/
├── uploads/
├── db/
├── index.js

Frontend
client/
├── components/
├── pages/
├── context/
├── hooks/
├── api/
├── svg/
├── App.jsx

⚙️ Environment Variables
Backend (.env)
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
COOKIE_NAME=token
FRONTEND_URL=https://your-frontend-domain
NODE_ENV=production

Frontend (.env)
VITE_API_URL=https://your-backend-domain/api
VITE_ASSETS_URL=https://your-backend-domain

🧪 Run Locally
Backend
cd server
npm install
npm run dev

Frontend
cd client
npm install
npm run dev

🧼 Security Practices Used

HTTP-only cookies (prevents XSS token theft)

Proper CORS configuration

Protected routes using middleware

Password hashing with bcrypt

Role-based access (event ownership checks)
