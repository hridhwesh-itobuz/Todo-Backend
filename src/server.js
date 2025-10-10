// import express from 'express';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import router from './router/routes.js';
// import connectDB from './dbConfig/mongo.js';

// dotenv.config();
// const port = process.env.PORT;

// connectDB();

// const app = express();
// app.use(express.json());

// app.use(cors());

// const sc = {
//   success: true,
//   message: `server is up and running ${port}`,
// };

// app.get('/', (req, res) => {
//   res.send(sc);
// });

// app.use(router);

// app.use((err, req, res, next) => {
//   try {
//     return res.status(res.statusCode === 200 ? 500 : res.statusCode).send({
//       success: false,
//       message: err.message,
//     });
//   } catch (error) {
//     return res.status(500).send({
//       success: false,
//       message: error.message,
//     });
//   }
// });

// app.listen(port, () => {
//   console.log(`"message": "server is up and running"`);
// });
import express from 'express';
import router from './router/authRoutes.js';
import protectedRoute from './router/authProtectedRoute.js';
import loggerMiddleware from './middlewares/logger.js';
//import AuthenticationController from './controller/authController.js';
import connectDB from './dbConfig/mongo.js';
connectDB();

const app = express();
app.use(express.json());

app.use(loggerMiddleware);

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

//const auth = new AuthenticationController();

app.use('/auth', router);
app.use('/protected', protectedRoute);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
