import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  TextField,
  Grid,
  MenuItem,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { getTasks, deleteTask, setFilters, allTasks, isLoading } from '../../store/slices/taskSlice';
import Swal from 'sweetalert2';

const Tasks = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tasks = [], isLoading, filters } = useSelector((state) => state.tasks);
  const { user } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(getTasks());
  }, [dispatch]);

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteTask(id));
      }
    });
  };

  const handleFilterChange = (event) => {
    dispatch(setFilters({ [event.target.name]: event.target.value }));
  };

  const filteredTasks = Array.isArray(tasks) 
    ? tasks.filter((task) => {
        const matchesSearch = task.title?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !filters.category || filters.category === 'all' || task.category === filters.category;
        const matchesStatus = !filters.status || filters.status === 'all' || task.status === filters.status;
        return matchesSearch && matchesCategory && matchesStatus;
      })
    : [];

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Tasks</Typography>
        {user?.role === 'superadmin' && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/tasks/add')}
          >
            Add Task
          </Button>
        )}
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Search Tasks"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              select
              label="Category"
              name="category"
              value={filters.category || 'all'}
              onChange={handleFilterChange}
            >
              <MenuItem value="all">All Categories</MenuItem>
              <MenuItem value="work">Work</MenuItem>
              <MenuItem value="personal">Personal</MenuItem>
              <MenuItem value="shopping">Shopping</MenuItem>
              <MenuItem value="others">Others</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              select
              label="Status"
              name="status"
              value={filters.status || 'all'}
              onChange={handleFilterChange}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {/* Tasks Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Created By</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Tags</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTasks.map((task) => task && (
              <TableRow key={task._id}>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.description}</TableCell>
                <TableCell>
                  <Chip label={task.category} color="primary" size="small" />
                </TableCell>
                <TableCell>
                  <Chip
                    label={task.status}
                    color={task.status === 'completed' ? 'success' : 'warning'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {task.assignedTo?.name}
                  <Typography variant="caption" display="block" color="textSecondary">
                    {task.assignedTo?.email}
                  </Typography>
                </TableCell>
                <TableCell>
                  {task.createdBy?.name}
                  <Typography variant="caption" display="block" color="textSecondary">
                    {task.createdBy?.email}
                  </Typography>
                </TableCell>
                <TableCell>
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : ''}
                </TableCell>
                <TableCell>
                  {task.tags?.map((tag, index) => (
                    <Chip
                      key={`${task._id}-tag-${index}`}
                      label={tag}
                      size="small"
                      sx={{ m: 0.5 }}
                    />
                  ))}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => navigate(`/tasks/edit/${task._id}`)}
                  >
                    <EditIcon />
                  </IconButton>
                  {user?.role === 'superadmin' && (
                    <IconButton color="error" onClick={() => handleDelete(task._id)}>
                      <DeleteIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Tasks; 