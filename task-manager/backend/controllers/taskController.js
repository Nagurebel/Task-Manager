const { validationResult } = require('express-validator');
const Task = require('../models/Task');

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private/Superadmin
exports.createTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const task = new Task({
      ...req.body,
      createdBy: req.user.id
    });

    await task.save();

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res) => {
  try {
    let tasks;
    if (req.user.role === 'superadmin') {
      tasks = await Task.find()
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name email');
    } else {
      tasks = await Task.find({ assignedTo: req.user.id })
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name email');
    }

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check if user is authorized to view the task
    if (req.user.role !== 'superadmin' && task.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this task'
      });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check authorization
    if (req.user.role === 'employee') {
      // Employees can only update status
      if (Object.keys(req.body).length > 1 || !req.body.status) {
        return res.status(403).json({
          success: false,
          message: 'Employees can only update task status'
        });
      }
      
      if (task.assignedTo.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this task'
        });
      }
    }

    task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private/Superadmin
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    await Task.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Search tasks
// @route   GET /api/tasks/search/:query
// @access  Private
exports.searchTasks = async (req, res) => {
  try {
    const searchQuery = req.params.query;
    let tasks;

    if (req.user.role === 'superadmin') {
      tasks = await Task.find({ $text: { $search: searchQuery } })
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name email');
    } else {
      tasks = await Task.find({
        $and: [
          { assignedTo: req.user.id },
          { $text: { $search: searchQuery } }
        ]
      })
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name email');
    }

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
}; 