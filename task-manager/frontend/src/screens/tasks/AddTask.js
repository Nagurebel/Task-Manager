import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  IconButton,
} from '@mui/material';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import { createTask } from '../../store/slices/taskSlice';
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
  dueDate: Yup.date()
    .min(new Date(), 'Due date cannot be in the past')
    .required('Due date is required'),
  tags: Yup.array().of(Yup.string()),
});

const AddTask = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading: isTaskLoading } = useSelector((state) => state.tasks);
  const { users = [], isLoading: isUsersLoading } = useSelector((state) => state.users);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const handleSubmit = async (values) => {
    // Format the data for the API
    const taskData = {
      title: values.title,
      description: values.description,
      category: values.category,
      assignedTo: values.assignedTo,
      dueDate: new Date(values.dueDate).toISOString(),
      status: values.status,
      tags: values.tags || [] // Ensure tags is always an array
    };

    console.log('Submitting task with data:', taskData);

    const resultAction = await dispatch(createTask(taskData));
    if (createTask.fulfilled.match(resultAction)) {
      navigate('/tasks');
    }
  };

  if (isUsersLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Add New Task
        </Typography>
        <Formik
          initialValues={{
            title: '',
            description: '',
            category: '',
            assignedTo: '',
            dueDate: '',
            status: 'pending',
            tags: [],
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
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
                  />
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
                          />
                          <Button
                            variant="contained"
                            onClick={() => {
                              if (tagInput.trim()) {
                                push(tagInput.trim());
                                setTagInput('');
                              }
                            }}
                          >
                            <AddIcon />
                          </Button>
                        </Box>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {values.tags && values.tags.map((tag, index) => (
                            <Chip
                              key={`tag-${index}`}
                              label={tag}
                              onDelete={() => remove(index)}
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
                      disabled={isTaskLoading}
                    >
                      {isTaskLoading ? <CircularProgress size={24} /> : 'Create Task'}
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

export default AddTask; 