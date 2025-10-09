import { Router } from 'express';
import {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
  deleteAllTasks,
} from '../controller/controller.js';
import ToDoValidations from '../validation/middlewares/taskValidator.js';

const router = Router();

const validationMiddleware = new ToDoValidations();

router.use((req, res, next) => {
  console.log(`Route middleware: ${req.method} ${req.url}`);
  next();
});

router.get('/tasks', getTasks);
router.post('/tasks', validationMiddleware.validateCreation, addTask);
router.put('/tasks/:id', validationMiddleware.validateUpdate, updateTask);
router.delete('/tasks/:id', deleteTask);
router.delete('/tasks', deleteAllTasks);

export default router;
