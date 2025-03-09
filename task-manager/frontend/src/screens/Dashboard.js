import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import { allTasks, getTasks, isLoading } from '../store/slices/taskSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const tasks = useSelector(allTasks);
  const loader = useSelector(isLoading);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getTasks());
  }, [dispatch]);

  const completedTasks = tasks?.filter(task => task.status === 'completed');
  const pendingTasks = tasks?.filter(task => task.status === 'pending');

  const tasksByCategory = tasks?.reduce((acc, task) => {
    if (task.category) {
      acc[task.category] = (acc[task.category] || 0) + 1;
    }
    return acc;
  }, {});

  if (loader) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.name}!
      </Typography>
      <Grid container spacing={3}>
        {/* Task Statistics */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Task Statistics
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Total Tasks
                    </Typography>
                    <Typography variant="h4">{tasks?.length}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Completed
                    </Typography>
                    <Typography variant="h4">{completedTasks?.length}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Pending
                    </Typography>
                    <Typography variant="h4">{pendingTasks?.length}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Completion Rate
                    </Typography>
                    <Typography variant="h4">
                      {tasks?.length
                        ? Math.round((completedTasks?.length / tasks?.length) * 100)
                        : 0}
                      %
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Tasks by Category */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Tasks by Category
            </Typography>
            <List>
              {Object.entries(tasksByCategory).map(([category, count]) => (
                <ListItem key={category}>
                  <ListItemText
                    primary={category}
                    secondary={`${count} task${count !== 1 ? 's' : ''}`}
                  />
                  <Chip
                    label={`${Math.round((count / tasks?.length) * 100)}%`}
                    color="primary"
                    size="small"
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Recent Tasks */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Recent Tasks
            </Typography>
            <List>
              {tasks?.slice(0, 5).map((task) => (
                <ListItem key={task._id}>
                  <ListItemText
                    primary={task.title}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="textSecondary">
                          {task.category}
                        </Typography>
                        <Chip
                          size="small"
                          label={task.status}
                          color={task.status === 'completed' ? 'success' : 'warning'}
                          sx={{ ml: 1 }}
                        />
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 