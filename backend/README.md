# 🏏 Basic Activity Booking App - Backend API

This is a RESTful API built with **Node.js**, **Express**, and **MongoDB** for booking various activities like cricket matches, movies, football, and more. The API supports user registration, login with JWT-based authentication, activity listing, activity booking, and retrieving user-specific bookings.

## 📦 Features

- ✅ User Registration & Login with hashed passwords
- 🔐 JWT-based Authentication
- 📃 Public Endpoint to List All Activities
- 🧾 Book Activities (Authenticated Users Only)
- 📑 View My Bookings
- 🧼 Clean Code Structure (Controllers, Routes, Models)
- 🛡️ Data Validation using `express-validator`
- 🔒 Password Hashing using `bcrypt`

---

## 🛠 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JSON Web Tokens (JWT)
- **Validation**: express-validator
- **Security**: bcrypt for password hashing
- **API Testing**: Postman

---

## 🚀 Setup Instructions

1. Clone the Repository


git clone https://github.com/yourusername/activity-booking-app.git
cd activity-booking-app


2. Install Dependencies
npm install


3. Environment Variables
Create a .env file in the root directory and add:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key


4. Start the Server

nodemon server.js/ node server.js

Server will run on http://localhost:5000



🧪 API Endpoints

🔓 Public

POST /api/auth/register – Register a new user

POST /api/auth/login – Login and receive JWT

GET /api/activities – Get all available activities


🔒 Protected (Requires JWT)

POST /api/bookings – Book an activity by ID

GET /api/bookings/:id – View your own bookings



📁 Folder Structure

Backend/

├── controllers/
│   ├── userAuthController.js       #auth functions for user
│   ├── activityController.js       # activities fetching logic
│   └── bookingController.js        # booking an activity and listing logic
├── models/
│   ├── userModel.js                
│   ├── activityModel.js
│   └── bookingModel.js
├── routes/
│   ├── userAuthRoutes.js
│   ├── activityRoutes.js
│   └── bookingRoutes.js
├── middleware/
│   └── authMiddleware.js
├── config/
│   └── db.js
├── .env
├── server.js
└── README.md


frontend/
├── node_modules/
├── public/
├── src/
│   ├── assets/                    # Static assets like images, fonts, etc.
│   ├── components/                # Reusable UI components
│   │   └── ProtectedRoute.jsx
│   ├── context/                   # Context providers for global state
│   ├── pages/                     # Application pages
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── services/                  # API service handlers
│   │   └── api.js
│   ├── App.jsx                    # Main component
│   ├── App.css
│   ├── index.css
│   └── main.jsx                   # Entry point of the React app
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
└── README.md






✅ Bonus Implementations
✔️ express-validator for input validation

✔️ bcrypt for password hashing

✔️ JWT for secure authentication

✔️ Clean and modular folder structure

✔️ Postman Collection included