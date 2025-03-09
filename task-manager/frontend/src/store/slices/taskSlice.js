import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Swal from 'sweetalert2';

const API_URL = 'http://localhost:5000/api';

// Create task
export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      console.log('Creating task with data:', taskData); // Debug log
      const response = await axios.post(`${API_URL}/tasks`, taskData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Task creation response:', response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error('Task creation error:', error.response?.data || error); // Debug log
      return rejectWithValue(error.response?.data || error);
    }
  }
);

// Get all tasks
export const getTasks = createAsyncThunk(
  'tasks/getTasks',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.get(`${API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Get single task
export const getSingleTask = createAsyncThunk(
  'tasks/getSingleTask',
  async (id, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.get(`${API_URL}/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update task
export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, taskData }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.patch(`${API_URL}/tasks/${id}`, taskData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Delete task
export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      await axios.delete(`${API_URL}/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  tasks: [],
  task: null,
  isLoading: false,
  error: null,
  filters: {
    category: 'all',
    status: 'all',
    search: '',
  },
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create task cases
      .addCase(createTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks.push(action.payload);
        Swal.fire({
          icon: 'success',
          title: 'Task Created',
          text: 'Task has been created successfully',
        });
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to create task';
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: state.error,
        });
      })
      // Get tasks cases
      .addCase(getTasks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload;
      })
      .addCase(getTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch tasks';
      })
      // Get single task cases
      .addCase(getSingleTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSingleTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.task = action.payload;
      })
      .addCase(getSingleTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch task';
      })
      // Update task cases
      .addCase(updateTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.tasks.findIndex((task) => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        Swal.fire({
          icon: 'success',
          title: 'Task Updated',
          text: 'Task has been updated successfully',
        });
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to update task';
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: state.error,
        });
      })
      // Delete task cases
      .addCase(deleteTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = state.tasks.filter((task) => task._id !== action.payload);
        Swal.fire({
          icon: 'success',
          title: 'Task Deleted',
          text: 'Task has been deleted successfully',
        });
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to delete task';
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: state.error,
        });
      });
  },
});

export const { setFilters, clearFilters } = taskSlice.actions;
export default taskSlice.reducer;

export const allTasks = (state) => state.tasks.tasks;
export const singleTask = (state) => state.tasks.task;
export const isLoading = (state) => state.tasks.isLoading;
export const error = (state) => state.tasks.error;

