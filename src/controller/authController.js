import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from '../schema/userModel.js';

dotenv.config();

export default class AuthenticationController {
  registerUser = async (req, res) => {
    try {
      const { username, password } = req.body;
      const hashedPass = await bcrypt.hash(password, 10);
      console.log(username, password, hashedPass);
      const user = new User({ username, password: hashedPass });
      await user.save();
      // const newUser = await User.create({
      //   username: username,
      //   password: hashedPass,
      // });
      // console.log(newUser);
      res.status(201).json({ success: true, user });
    } catch (error) {
      res.status(500).json({ success: false, Error: error });
    }
  };

  loginUser = async (req, res, next) => {
    try {
      const secretKey = process.env.JWT_SECRET_KEY;
      const { username, password } = req.body;
      //console.log(req.body);
      const user = await User.findOne({ username });

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
        expiresIn: '1h',
      });

      delete user._doc.password;

      res.status(200).json({ token, user });
    } catch (error) {
      res.status(500).json({ error: `Login failed: ${error}` });
      next();
    }
  };
}
