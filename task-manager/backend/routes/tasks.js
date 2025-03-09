const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  searchTasks
} = require('../controllers/taskController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - category
 *         - assignedTo
 *         - dueDate
 *       properties:
 *         title:
 *           type: string
 *           description: Task title
 *         description:
 *           type: string
 *           description: Detailed task description
 *         category:
 *           type: string
 *           description: Task category
 *           enum: [work, personal, shopping, others]
 *         status:
 *           type: string
 *           description: Task status
 *           enum: [pending, completed]
 *           default: pending
 *         assignedTo:
 *           type: string
 *           description: User ID of assigned employee
 *         dueDate:
 *           type: string
 *           format: date-time
 *           description: Task due date
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of task tags
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     tags: [Tasks]
 *     summary: Create a new task (superadmin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - category
 *               - assignedTo
 *               - dueDate
 *             properties:
 *               title:
 *                 type: string
 *                 example: Complete project documentation
 *               description:
 *                 type: string
 *                 example: Write detailed documentation for the project
 *               category:
 *                 type: string
 *                 enum: [work, personal, shopping, others]
 *                 example: work
 *               assignedTo:
 *                 type: string
 *                 example: 60d5ecb8b5c9c22e54c8f2a1
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2024-04-20T10:00:00Z
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["documentation", "urgent"]
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not allowed to create tasks
 */
router.post(
  '/',
  [
    protect,
    authorize('superadmin'),
    [
      check('title', 'Title is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('category', 'Category is required').not().isEmpty(),
      check('assignedTo', 'Assigned user is required').not().isEmpty(),
      check('dueDate', 'Due date is required').not().isEmpty()
    ]
  ],
  createTask
);

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     tags: [Tasks]
 *     summary: Get all tasks (filtered by role)
 *     description: Superadmin can see all tasks, employees can only see their assigned tasks
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 */
router.get('/', protect, getTasks);

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     tags: [Tasks]
 *     summary: Get task by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 */
router.get('/:id', protect, getTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   patch:
 *     tags: [Tasks]
 *     summary: Update task
 *     description: Superadmin can update all fields, employee can only update status
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [work, personal, shopping, others]
 *               status:
 *                 type: string
 *                 enum: [pending, completed]
 *               assignedTo:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not allowed to update this task
 *       404:
 *         description: Task not found
 */
router.patch('/:id', protect, updateTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     tags: [Tasks]
 *     summary: Delete task (superadmin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not allowed to delete tasks
 *       404:
 *         description: Task not found
 */
router.delete('/:id', [protect, authorize('superadmin')], deleteTask);

/**
 * @swagger
 * /api/tasks/search/{query}:
 *   get:
 *     tags: [Tasks]
 *     summary: Search tasks by title
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query string
 *     responses:
 *       200:
 *         description: List of matching tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 */
router.get('/search/:query', protect, searchTasks);

module.exports = router; 