import { Router } from 'express';
import ControllerFunctions from '../controller/controller.js';
import ToDoValidations from '../validation/middlewares/taskValidator.js';

const router = Router();

const controllerFunctions = new ControllerFunctions();
const validationMiddleware = new ToDoValidations();

router.use((req, res, next) => {
  console.log(`Route middleware: ${req.method} ${req.url}`);
  next();
});

router.get(
  '/tasks',
  validationMiddleware.validateFetch,
  controllerFunctions.getTasks
);
router.post(
  '/tasks',
  validationMiddleware.validateCreation,
  controllerFunctions.addTask
);
router.put(
  '/tasks/:id',
  validationMiddleware.validateUpdate,
  controllerFunctions.updateTask
);
router.delete('/tasks/:id', controllerFunctions.deleteTask);
router.delete('/tasks', controllerFunctions.deleteAllTasks);

export default router;
