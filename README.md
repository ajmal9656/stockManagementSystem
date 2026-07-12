# Stock Management System

A Stock Management System that allows admins to manage products, stores and stocks. Shoppers can view products and stock availability per store.


## Features

- User Authentication (JWT)
- Role based Authorization (Admin&Shopper)
- Product Management
- Store Management
- Stock Assignment
- Stock Adjustment (Increase or Decrease)
- Stock Transfer Between Stores
- Low Stock Filter
- Swagger API Documentation
- Jest & Supertest API Testing



## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Jest

### Frontend
- React
- Redux Toolkit

---

## Prerequisites

- Node.js (v18 or above)
- MongoDB 7+
- Git

---

## Clone Repository

```
git clone https://github.com/ajmal9656/stockManagementSystem.git
```

---

# Backend Setup

```
cd backend
npm install
```

Create a `.env` file using `.env.example`.

Example:

```env
PORT=5000

MONGODB_URI=mongodb://127.0.0.1:27017/stockManagementSystem?replicaSet=rs0

JWT_SECRET=abcd1234

JWT_EXPIRES_IN=1d

CLIENT_URL=http://localhost:5173

NODE_ENV=development
```

Run backend

```
npm run dev
```

---

# Frontend Setup

```
cd frontend
npm install
```

Create a `.env` file using `.env.example`.

Example:

```env
VITE_API_URL=http://localhost:5000/api
```

Run frontend

```
npm run dev
```

# Database Setup

MongoDB Replica Set is required because stock transfers use MongoDB transactions.

Initialize replica set in local

---

# Running Tests

```
npm test
```

---

# API Documentation

Swagger UI

```
http://localhost:5000/api-docs
```

---

# Environment Variables

 PORT - Backend Port 
 MONGODB_URI - MongoDB Connection String 
 JWT_SECRET - JWT Secret 
 JWT_EXPIRES_IN - Token Expiration 
 CLIENT_URL - Frontend URL 
 NODE_ENV - Environment 
 VITE_API_URL - Backend API base URL

---

# Assumptions

- Only administrators can manage products, stores, and stock.
- Shoppers have read-only access.
- Stock cannot become negative.
- Stock transfers occur only between active stores.
- Products and stores must be active before stock operations.

---

# Trade-offs

- Transactions are used only for stock transfers because multiple documents are modified.
- Stock adjustments use atomic update operators ($inc) instead of transactions since only one document is updated.
