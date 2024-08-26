const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    // Verify and decode token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Check if token has expired
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    if (decoded.exp < currentTime) {
      return res.status(401).json({ message: 'Token expired' });
    }

    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

module.exports = authenticate;