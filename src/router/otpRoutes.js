import { Router } from 'express';
import sendOTP from '../controller/otpController.js';

const otpRouter = Router();

otpRouter.post('/send-otp', sendOTP);

export default otpRouter;
