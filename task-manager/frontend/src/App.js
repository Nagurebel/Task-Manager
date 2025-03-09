import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { Provider } from 'react-redux';
import store from './store/store';

// Components
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import Login from './screens/auth/Login';
import Register from './screens/auth/Register';
import Dashboard from './screens/Dashboard';
import Users from './screens/users/Users';
import Tasks from './screens/tasks/Tasks';
import AddTask from './screens/tasks/AddTask';
import EditTask from './screens/tasks/EditTask';
import AddUser from './screens/users/AddUser';
import EditUser from './screens/users/EditUser';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="users" element={<Users />} />
              <Route path="users/add" element={<AddUser />} />
              <Route path="users/edit/:id" element={<EditUser />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="tasks/add" element={<AddTask />} />
              <Route path="tasks/edit/:id" element={<EditTask />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
