import { Router } from 'express';
import AuthenticationController from '../controller/authController.js';

const router = Router();

const authentication = new AuthenticationController();

router.use((req, res, next) => {
  console.log(`Route middleware: ${req.method} ${req.url}`);
  next();
});

router.post('/sign-up', authentication.registerUser);
router.post('/login', authentication.loginUser);

export default router;
