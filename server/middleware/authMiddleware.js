import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach decoded payload directly
    req.user = decoded;

    
    // only fetch if needed
    if (!decoded.role) {
      const user = await User.findById(decoded.id).select('role');
      if (!user) return res.status(404).json({ message: "User not found" });
      req.user.role = user.role; // attach role if missing
    }

    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

export default verifyToken;
