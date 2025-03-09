import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { updateUser, getSingleUser, singleUser } from '../../store/slices/userSlice';
import { isLoading } from '../../store/slices/taskSlice';

const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  role: Yup.string()
    .oneOf(['superadmin', 'employee'], 'Invalid role')
    .required('Role is required'),
});

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const  userData = useSelector(singleUser);
  const loader = useSelector(isLoading);
  const { user: currentUser } = useSelector((state) => state.auth);

  // Redirect if not super admin
  useEffect(() => {
    if (currentUser && currentUser.role !== 'superadmin') {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    dispatch(getSingleUser(id));
  }, [dispatch, id]);

  if (loader || !userData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const handleSubmit = async (values) => {
    const { confirmPassword, ...updateData } = values;
    // Only include password if it's provided
    if (!updateData.password) {
      delete updateData.password;
    }
    const resultAction = await dispatch(updateUser({ id, userData: updateData }));
    if (updateUser.fulfilled.match(resultAction)) {
      navigate('/users');
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Edit User
        </Typography>
        <Formik
          initialValues={{
            name: userData.name || '',
            email: userData.email || '',
            password: '',
            confirmPassword: '',
            role: userData.role || 'employee',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, handleChange, handleBlur }) => (
            <Form>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="name"
                    label="Full Name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="email"
                    label="Email Address"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                  />
                </Grid>
                {/* <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="password"
                    label="New Password (optional)"
                    type="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                  />
                </Grid> */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    select
                    name="role"
                    label="Role"
                    value={values.role}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.role && Boolean(errors.role)}
                    helperText={touched.role && errors.role}
                    disabled={userData.id === currentUser.id}
                  >
                    <MenuItem value="employee">Employee</MenuItem>
                    <MenuItem value="superadmin">Super Admin</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button
                      type="button"
                      variant="outlined"
                      onClick={() => navigate('/users')}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loader}
                    >
                      {loader ? <CircularProgress size={24} /> : 'Update User'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Paper>
    </Container>
  );
};

export default EditUser; 