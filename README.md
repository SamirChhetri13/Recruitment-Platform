# Recruitment & Job Management Platform

A clean and modular RESTful API for a recruitment platform built with Node.js, Express, and MongoDB using modern ES Modules.

---

## 🛠 Tech Stack

- **Backend:** Node.js, Express.js (ES Modules)
- **Database:** MongoDB & Mongoose
- **Auth & Security:** JWT (JSON Web Tokens), bcryptjs
- **Validation:** express-validator

---

## 📁 Project Structure

```plaintext
backend/
├── src/
│   ├── config/          # Database connection (db.js)
│   ├── controllers/     # Request handlers (auth, job, application)
│   ├── middleware/      # Auth protection (JWT/RBAC) & error handling
│   ├── models/          # Mongoose schemas (User, Job, Application)
│   ├── routes/          # Express route definitions
│   ├── validations/     # Input validation rules
│   ├── app.js           # Express app & middleware setup
│   └── server.js        # App entry point & DB initialization
├── .env                 # Environment variables
└── package.json         # Dependencies & scripts
```

---

## 🔄 How It Works (Code Flow)

1. **Request Received:** Client sends an HTTP request to an API endpoint (`/api/...`).
2. **Validation:** `express-validator` validates input fields. If invalid, returns a `400 Bad Request`.
3. **Authentication & Authorization:**
   - `protect` verifies the JWT Bearer token and attaches `req.user`.
   - `authorize` ensures the user has the required role (`candidate`, `recruiter`, `admin`).
4. **Controller & Database:** The controller executes business logic with Mongoose models (`User`, `Job`, `Application`) and sends back a JSON response.

---

## 📡 API Endpoints

### 1. Auth (`/api/auth`)
| Method | Route | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a candidate, recruiter, or admin |
| `POST` | `/api/auth/login` | Public | Login and receive a JWT token |
| `GET` | `/api/auth/me` | Logged in | Get current user profile |

### 2. Jobs (`/api/jobs`)
| Method | Route | Access | Description |
|---|---|---|---|
| `GET` | `/api/jobs` | Public | List & search jobs (supports filters & pagination) |
| `GET` | `/api/jobs/mine` | Recruiter/Admin | List jobs posted by logged-in recruiter |
| `GET` | `/api/jobs/:id` | Public | Get single job details |
| `POST` | `/api/jobs` | Recruiter/Admin | Create a new job |
| `PATCH` | `/api/jobs/:id` | Job Owner/Admin | Update job details |
| `DELETE` | `/api/jobs/:id` | Job Owner/Admin | Delete job and its applications |

### 3. Applications (`/api/applications` & `/api/jobs/:jobId/applications`)
| Method | Route | Access | Description |
|---|---|---|---|
| `POST` | `/api/jobs/:jobId/applications` | Candidate | Apply to a job |
| `GET` | `/api/jobs/:jobId/applications` | Job Owner/Admin | View all applicants for a job |
| `GET` | `/api/applications/me` | Candidate | View all jobs applied by candidate |
| `PATCH` | `/api/applications/:id/status` | Job Owner/Admin | Update status (`applied`, `shortlisted`, `rejected`, `hired`) |
| `DELETE` | `/api/applications/:id` | Candidate | Withdraw an application |

---

## 🚀 Quick Start

### 1. Configure Environment (`backend/.env`)
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/recruitment_platform
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1d
```

### 2. Install & Run
```bash
# Go to backend
cd backend

# Install dependencies
npm install

# Start development server
npm run dev
```

The API will be live at `http://localhost:5000`.