import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRouter from './router/authRoutes.js';
import router from './router/routes.js';
import protectedRoute from './router/authProtectedRoute.js';
import loggerMiddleware from './middlewares/logger.js';
import connectDB from './dbConfig/mongo.js';
import otpRouter from './router/otpRoutes.js';

dotenv.config();
const port = process.env.PORT;

connectDB();

const app = express();
app.use(express.json());

app.use(cors());

const sc = {
  success: true,
  message: `server is up and running ${port}`,
};

app.get('/', (req, res) => {
  res.send(sc);
});

app.use(loggerMiddleware);
app.use(router);
app.use('/auth', authRouter);
app.use('/protected', protectedRoute);
app.use('/otp', otpRouter);

// eslint-disable-next-line
app.use((err, req, res, next) => {
  try {
    return res.status(res.statusCode === 200 ? 500 : res.statusCode).send({
      success: false,
      message: err.message,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`"message": "server is up and running"`);
});
