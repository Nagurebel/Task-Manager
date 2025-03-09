import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';

const PrivateRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);

  if (!token) {
    Swal.fire({
      icon: 'warning',
      title: 'Access Denied',
      text: 'Please login to access this page',
    });
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute; 