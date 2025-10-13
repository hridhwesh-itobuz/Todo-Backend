import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

//import axios from 'axios';
import User from '../schema/userModel.js';
import OTP from '../schema/otpModel.js';

dotenv.config();

export default class AuthenticationController {
  registerUser = async (req, res) => {
    try {
      const { email, password, otp } = req.body;
      if (!email || !password || !otp) {
        return res.status(403).json({
          success: false,
          message: 'All fields are required',
        });
      }
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User already exists',
        });
      }
      const response = await OTP.find({ email })
        .sort({ createdAt: -1 })
        .limit(1);
      if (response.length === 0 || otp !== response[0].otp) {
        return res.status(400).json({
          success: false,
          message: 'The OTP is not valid',
        });
      }
      let hashedPassword;
      try {
        hashedPassword = await bcrypt.hash(password, 10);
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: `Hashing password error for ${password}: ` + error.message,
        });
      }
      const newUser = await User.create({
        email,
        password: hashedPassword,
      });
      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user: newUser,
      });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ success: false, error: error.message });
    }
  };

  loginUser = async (req, res, next) => {
    try {
      const secretKey = process.env.JWT_SECRET_KEY;
      const refreshKey = process.env.JWT_REFRESH_KEY;
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        res.status(404);
        throw new Error('User not found! ❌');
      }

      const passwordMatched = await bcrypt.compare(password, user.password);

      if (!passwordMatched) {
        res.status(401);
        throw new Error('Authentication failed, password not matched');
      }

      const token = jwt.sign({ userId: user._id }, secretKey, {
        expiresIn: '60',
      });

      const refreshToken = jwt.sign({ userId: user._id }, refreshKey, {
        expiresIn: '180d',
      });

      delete user._doc.password;

      res
        .status(200)
        .json({ access_token: token, refresh_token: refreshToken, user });
      //.writeHead(301, { Location: 'https://localhost:8080/tasks' });
    } catch (error) {
      res.status(500).json({ error: `Login failed: ${error}` });
      next();
    }
  };
}
