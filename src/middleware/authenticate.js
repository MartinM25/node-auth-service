const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {

  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({
      message: 'Access denied. No token provided.'
    });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({
      message: 'Access denied. Token missing.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({
      message: 'Invalid token.'
    });
  }
}