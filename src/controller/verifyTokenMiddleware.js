import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export default function verifyToken(req, res, next) {
  const secretKey = process.env.JWT_SECRET_KEY;
  const refreshKey = process.env.JWT_REFRESH_KEY;
  const tokens = req.header('Authorization');

  const accessToken = tokens ? tokens.split(' ')[1] : null;
  const refreshToken = tokens ? tokens.split(' ')[2] : null;

  if (!accessToken || !refreshToken) {
    return res
      .status(401)
      .json({ success: false, message: 'No token found, access denied' });
  }
  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
    console.log(decoded);
    req.user = decoded;
    return next();
  } catch (err) {
    console.log(err);
    if (err.name === 'TokenExpiredError' && refreshToken) {
      try {
        const decoded = jwt.verify(refreshToken, refreshKey);
        console.log(decoded);
        req.user = decoded;
        const newAccessToken = jwt.sign({ userId: decoded.userId }, secretKey, {
          expiresIn: '60000',
        });

        console.log('New Access Token:', newAccessToken);
        res.setHeader(
          'Authorization',
          `Bearer ${newAccessToken} ${refreshToken}`
        );
        next();
      } catch (error) {
        return res
          .status(401)
          .json({ success: false, message: `Error: ${error}` });
      }
    } else {
      return res.status(401).json({ success: false, message: `Error: ${err}` });
    }
  }
}
