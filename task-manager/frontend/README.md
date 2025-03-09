# Task Management System

A React-based task management system with user authentication and role-based access control.

## Technologies & Libraries Used

### Core Dependencies
- **React** (v19.0.0) - Frontend library for building user interfaces
- **React DOM** (v19.0.0) - React rendering for web
- **React Router DOM** (v7.3.0) - Routing library for React applications

### State Management
- **Redux Toolkit** (v2.6.1) - State management library
- **React Redux** (v9.2.0) - React bindings for Redux

### UI Components & Styling
- **Material UI** (v6.4.7) - React UI component library
  - @mui/material
  - @mui/icons-material
  - @emotion/react
  - @emotion/styled

### Form Handling & Validation
- **Formik** (v2.4.6) - Form management library
- **Yup** (v1.6.1) - Form validation library

### HTTP Client
- **Axios** (v1.8.2) - Promise-based HTTP client

### Authentication
- **JWT Decode** (v4.0.0) - JWT token decoder

### Notifications
- **SweetAlert2** (v11.17.2) - Beautiful, responsive popups

### Development & Testing
- **React Scripts** (v5.0.1) - Create React App configuration and scripts
- **Testing Library** - Testing utilities
  - @testing-library/react
  - @testing-library/jest-dom
  - @testing-library/user-event
  - @testing-library/dom

## Features
- User authentication and authorization
- Role-based access control (Super Admin and Employee roles)
- Task management (Create, Read, Update, Delete)
- User management for administrators
- Real-time form validation
- Responsive design
- Search and filter functionality
- Tag management for tasks
- Date and time handling for task deadlines

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Start the development server:
```bash
npm start
```

## Environment Variables
Create a `.env` file in the root directory with:
