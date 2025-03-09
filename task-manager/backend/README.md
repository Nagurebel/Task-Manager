# Task Manager API

A RESTful API for a Task Management System with role-based authentication and authorization.

## Features

- User Authentication (JWT)
- Role-based Authorization (Superadmin and Employee)
- CRUD operations for Tasks
- User Management (Superadmin only)
- Task Search and Filtering
- API Documentation with Swagger

## Requirements

- Node.js
- MongoDB Atlas account
- npm or yarn

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=30d
   ```

## Running the Application

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Documentation

Access the Swagger documentation at:
```
http://localhost:5000/api-docs
```

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user

### Tasks
- POST /api/tasks - Create a new task (Superadmin only)
- GET /api/tasks - Get all tasks (filtered by role)
- GET /api/tasks/:id - Get task by ID
- PUT /api/tasks/:id - Update task
- DELETE /api/tasks/:id - Delete task (Superadmin only)
- GET /api/tasks/search/:query - Search tasks by title

### Users (Superadmin only)
- GET /api/users - Get all users
- GET /api/users/:id - Get user by ID
- PUT /api/users/:id - Update user
- DELETE /api/users/:id - Delete user

## Role-based Access

### Superadmin
- Full access to all endpoints
- Can manage users
- Can create, update, and delete tasks
- Can assign tasks to any user

### Employee
- Can view assigned tasks
- Can update task status (pending/completed)
- Can search through assigned tasks

## Security Features

- JWT Authentication
- Password Hashing
- Input Validation
- Role-based Authorization
- MongoDB Atlas Security 