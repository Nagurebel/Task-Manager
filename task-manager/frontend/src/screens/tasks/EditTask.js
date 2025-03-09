import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, FieldArray } from 'formik';
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
  Chip,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { updateTask, getTasks, singleTask, getSingleTask, isLoading } from '../../store/slices/taskSlice';
import { getUsers } from '../../store/slices/userSlice';

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters')
    .required('Title is required'),
  description: Yup.string()
    .min(10, 'Description must be at least 10 characters')
    .required('Description is required'),
  category: Yup.string().required('Category is required'),
  assignedTo: Yup.string().required('Assigned user is required'),
  dueDate: Yup.date().required('Due date is required'),
  status: Yup.string().required('Status is required'),
  tags: Yup.array().of(Yup.string()),
});

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const singletaskData = useSelector(singleTask);
  const loader = useSelector(isLoading);
  const { users } = useSelector((state) => state.users);
  const { user: currentUser } = useSelector((state) => state.auth);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    dispatch(getSingleTask(id));
    dispatch(getUsers());
  }, [id, dispatch]);

  useEffect(() => {
    if (singletaskData) {
      console.log('Task Data:', singletaskData);
    }
  }, [singletaskData]);

  if (loader || !singletaskData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Format the date for the datetime-local input
  const formatDateForInput = (dateString) => {
    try {
      if (!dateString) return '';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return ''; // Check if date is valid
      
      // Format: YYYY-MM-DDThh:mm
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  const handleSubmit = async (values) => {
    try {
      console.log('Submitting values:', values);
      const taskData = {
        ...values,
        assignedTo: values.assignedTo,
        dueDate: new Date(values.dueDate).toISOString(),
        tags: values.tags || []
      };
      console.log('Formatted task data:', taskData);

      const resultAction = await dispatch(updateTask({ id, taskData }));
      if (updateTask.fulfilled.match(resultAction)) {
        navigate('/tasks');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  // Get initial values from singletaskData
  const initialValues = {
    title: singletaskData?.title ?? '',
    description: singletaskData?.description ?? '',
    category: singletaskData?.category ?? '',
    assignedTo: singletaskData?.assignedTo?._id ?? '',
    dueDate: formatDateForInput(singletaskData?.dueDate) || new Date().toISOString().slice(0, 16),
    status: singletaskData?.status ?? '',
    tags: singletaskData?.tags ?? [],
  };

  console.log('Initial values:', initialValues);

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Edit Task
        </Typography>
        <Formik
          initialValues={initialValues}
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
                    name="title"
                    label="Task Title"
                    value={values.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.title && Boolean(errors.title)}
                    helperText={touched.title && errors.title}
                    disabled={currentUser.role !== 'superadmin'}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    name="description"
                    label="Description"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.description && Boolean(errors.description)}
                    helperText={touched.description && errors.description}
                    disabled={currentUser.role !== 'superadmin'}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    name="category"
                    label="Category"
                    value={values.category}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.category && Boolean(errors.category)}
                    helperText={touched.category && errors.category}
                    disabled={currentUser.role !== 'superadmin'}
                  >
                    <MenuItem value="work">Work</MenuItem>
                    <MenuItem value="personal">Personal</MenuItem>
                    <MenuItem value="shopping">Shopping</MenuItem>
                    <MenuItem value="others">Others</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    name="assignedTo"
                    label="Assign To"
                    value={values.assignedTo}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.assignedTo && Boolean(errors.assignedTo)}
                    helperText={touched.assignedTo && errors.assignedTo}
                    disabled={currentUser.role !== 'superadmin'}
                  >
                    {Array.isArray(users) && users.map((user) => (
                      <MenuItem key={user._id} value={user._id}>
                        {user.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="datetime-local"
                    name="dueDate"
                    label="Due Date"
                    value={values.dueDate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.dueDate && Boolean(errors.dueDate)}
                    helperText={touched.dueDate && errors.dueDate}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    disabled={currentUser.role !== 'superadmin'}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    name="status"
                    label="Status"
                    value={values.status}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.status && Boolean(errors.status)}
                    helperText={touched.status && errors.status}
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Tags
                  </Typography>
                  <FieldArray name="tags">
                    {({ push, remove }) => (
                      <Box>
                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                          <TextField
                            fullWidth
                            label="Add Tag"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                if (tagInput.trim()) {
                                  push(tagInput.trim());
                                  setTagInput('');
                                }
                              }
                            }}
                            placeholder="Type a tag and press Enter"
                            disabled={currentUser.role !== 'superadmin'}
                          />
                          <Button
                            variant="contained"
                            onClick={() => {
                              if (tagInput.trim()) {
                                push(tagInput.trim());
                                setTagInput('');
                              }
                            }}
                            disabled={currentUser.role !== 'superadmin'}
                          >
                            <AddIcon />
                          </Button>
                        </Box>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {values.tags && values.tags.map((tag, index) => (
                            <Chip
                              key={`tag-${index}`}
                              label={tag}
                              onDelete={currentUser.role === 'superadmin' ? () => remove(index) : undefined}
                              color="primary"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </Box>
                    )}
                  </FieldArray>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button
                      type="button"
                      variant="outlined"
                      onClick={() => navigate('/tasks')}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loader}
                    >
                      {loader ? <CircularProgress size={24} /> : 'Update Task'}
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

export default EditTask; 