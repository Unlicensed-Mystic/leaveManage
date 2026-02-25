# 🏢 Employee Leave Management System

A full-stack HR Leave & Reimbursement Management System with JWT authentication, role-based access control, and a modern dark UI.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite) + Tailwind CSS v4 |
| Routing | React Router v6 |
| State | Context API |
| Backend | Node.js + Express.js |
| Database | MongoDB (Mongoose) |
| Auth | JWT (JSON Web Token) |
| Charts | Recharts |
| Notifications | react-hot-toast |

## Folder Structure

```
leaveManage/
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── leaveController.js
│   │   ├── reimbursementController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── auth.js          ← JWT verification
│   │   └── roleCheck.js     ← Role guard factory
│   ├── models/
│   │   ├── User.js
│   │   ├── Leave.js
│   │   └── Reimbursement.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── leaveRoutes.js
│   │   ├── reimbursementRoutes.js
│   │   └── adminRoutes.js
│   ├── .env
│   ├── seed.js
│   └── server.js
└── frontend/
    └── src/
        ├── api/axios.js
        ├── context/AuthContext.jsx
        ├── components/
        │   ├── ProtectedRoute.jsx
        │   ├── Sidebar.jsx
        │   ├── StatusBadge.jsx
        │   └── StatsCard.jsx
        └── pages/
            ├── Login.jsx / Register.jsx / Unauthorized.jsx
            ├── employee/ (Dashboard, ApplyLeave, LeaveHistory, Reimbursement)
            ├── manager/ (Dashboard, LeaveRequests, ReimbursementRequests)
            └── admin/ (Dashboard, UserManagement, AllLeaves, AllReimbursements)
```

## Setup Steps

### Prerequisites
- Node.js 18+
- MongoDB running locally (or Atlas URI)

### 1. Backend Setup

```bash
cd backend
npm install
```

Edit `.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/leaveManage
JWT_SECRET=your_super_secret_jwt_key_change_this
```

Seed test users:
```bash
npm run seed
```

Start dev server:
```bash
npm run dev
```

**Test Credentials (after seed):**
| Role | Email | Password |
|---|---|---|
| Admin | admin@company.com | admin123 |
| Manager | manager@company.com | manager123 |
| Employee | employee@company.com | employee123 |

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open → http://localhost:5173

## Features

### 👤 Employee
- Dashboard with leave balance cards + donut chart
- Apply leave (casual, sick, annual, unpaid) with live day counter
- View leave history with status filter
- Submit & track reimbursement expense claims (travel, food, medical, etc.)

### 🎯 Manager
- View all pending leave requests in a table
- Approve or reject leaves with an optional note
- View all pending reimbursements in a card grid
- Approve or reject expense claims

### 👑 Admin
- Full system stats dashboard
- Create, edit roles/departments, activate/deactivate, or delete users
- View ALL leaves across the organization with filters
- View ALL reimbursements with total approved amount

## API Endpoints

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

POST   /api/leaves             (employee)
GET    /api/leaves/my          (authenticated)
GET    /api/leaves/pending     (manager/admin)
PUT    /api/leaves/:id/status  (manager/admin)
GET    /api/leaves/all         (admin)

POST   /api/reimbursements              (employee)
GET    /api/reimbursements/my           (authenticated)
GET    /api/reimbursements/pending      (manager/admin)
PUT    /api/reimbursements/:id/status   (manager/admin)
GET    /api/reimbursements/all          (admin)

GET    /api/admin/stats
GET    /api/admin/users
POST   /api/admin/users
PUT    /api/admin/users/:id/role
DELETE /api/admin/users/:id
```
