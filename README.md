# 🍽️ Lien Resto - Reservation System (REST API)

A robust RESTful API built for managing users and restaurant reservations. Developed with Node.js, Express, and MongoDB, this project emphasizes security, strict schema validations, and role-based access control (RBAC).

---

## 🚀 Key Features

* Authentication & Authorization: User registration and login utilizing encrypted passwords via bcrypt and token management via JWT.
* Role-Based Access Control (RBAC):
  * Customer (user): Can create, view, update, and cancel their own reservations.
  * Administrator (admin): Full privileges to query, manage, or delete any reservation across the system.
* Data Validation: Strict schema validation powered by Zod to enforce data integrity on incoming payloads (POST / PUT).
* Security & Protection: Rate-limiting middleware (express-rate-limit) to prevent brute-force attacks and abuse.
* Cloud Deployment: Live production API hosted on Render and backed by MongoDB Atlas.

---

## 🛠️ Tech Stack

* Runtime Environment: Node.js
* Web Framework: Express.js
* Database: MongoDB & Mongoose
* Data Validation: Zod
* Security: JWT (JSON Web Tokens), Bcrypt, Express Rate Limit, CORS
* Package Manager: pnpm / npm

---

## 🌐 Live Production API

* Render Base URL: https://restaurant-reservation-api-t4xb.onrender.com
* API Metadata Endpoint: https://restaurant-reservation-api-t4xb.onrender.com/api

---

## 💻 Local Installation and Setup

Follow these steps to run the project locally:

1. Clone the repository:
   git clone https://github.com/Chu-l/restaurant-reservation-system.git
   cd restaurant-reservation-system

2. Install dependencies:
   pnpm install

3. Environment Variables:
   Create a .env file in the root directory based on .env.example:
   PORT=4000
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES=7d

4. Start the development server:
   pnpm dev

The server will start running at http://localhost:4000.

---

## 📖 Endpoint Documentation

### 1. Public & Information Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| GET | / | API Root Welcome Message | No |
| GET | /api | API Information and Route Directory | No |

---

### 2. User & Authentication Endpoints (/api/users)

| Method | Endpoint | Description | Auth Required | Role |
| :--- | :--- | :--- | :--- | :--- |
| POST | /api/users/register | Register a new user account | No | Public |
| POST | /api/users/login | Authenticate and obtain JWT token | No | Public |
| GET | /api/users/profile | Retrieve current user profile | Yes | user / admin |

Registration Payload Example (POST /api/users/register):
{
  "name": "Maria Lopez",
  "email": "maria@example.com",
  "password": "password123",
  "phone": "123456789"
}

Login Payload Example (POST /api/users/login):
{
  "email": "maria@example.com",
  "password": "password123"
}

---

### 3. Reservation Endpoints (/api/reservations)

Note: All reservation endpoints require an HTTP Authorization Header: Authorization: Bearer <JWT_TOKEN>

| Method | Endpoint | Description | Auth Required | Role |
| :--- | :--- | :--- | :--- | :--- |
| POST | /api/reservations | Create a new reservation | Yes | user / admin |
| GET | /api/reservations | List reservations (Users see own; Admins see all) | Yes | user / admin |
| GET | /api/reservations/:id | Get details of a specific reservation | Yes | Owner / admin |
| PUT | /api/reservations/:id | Update a reservation's details/status | Yes | Owner / admin |
| DELETE | /api/reservations/:id | Cancel/Delete a reservation | Yes | Owner / admin |

Create Reservation Payload Example (POST /api/reservations):
{
  "date": "2026-11-15T20:30:00.000Z",
  "guests": 4,
  "specialRequests": "Table near the window"
}

---

## 🧪 Testing with Postman

1. Send a POST request to /api/users/login with valid credentials.
2. Copy the token returned in the JSON response.
3. In your requests to protected endpoints (like /api/reservations), navigate to the Authorization tab, select Bearer Token, and paste your token.
