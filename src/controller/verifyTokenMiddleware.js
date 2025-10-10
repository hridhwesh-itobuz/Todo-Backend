import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

function verifyToken(req, res, next) {
  dotenv.config();
  const secretKey = process.env.JWT_SECRET_KEY;
  const token = req.header('Authorization');
  if (!token) {
    res.status(401);
    res.json({ success: false, message: 'No token found, access denied' });
  }
  try {
    const decoded = jwt.verify(token, secretKey);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: `Error: ${error}` });
  }
}

export default verifyToken;
