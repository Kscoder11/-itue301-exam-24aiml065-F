import jwt from 'jsonwebtoken';

// Validates the "Authorization: Bearer <token>" header and sets req.user.
const authGuard = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Authorization token is missing. Use header: Authorization: Bearer <token>',
    });
  }

  const token = authorizationHeader.split(' ')[1];

  try {
    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decodedPayload.id,
      email: decodedPayload.email,
      role: decodedPayload.role,
    };
    next();
  } catch (verificationError) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Invalid or expired token',
    });
  }
};

export default authGuard;
