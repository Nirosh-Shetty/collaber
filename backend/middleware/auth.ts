// middleware/auth.js
import jwt from "jsonwebtoken";
 
export function auth(required = true) {
  return function (req, res, next) {
    const authHeader = req.headers.authorization;
 
    if (!authHeader) {
      if (!required) return next();
      return res.status(401).json({ error: "No token provided" });
    }
 
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Invalid auth format" });
    }
 
    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
 
      // Attach to request
      req.user = {
        uid: decoded.uid,
        role: decoded.role,
        username: decoded.username
      };
 
      next();
    } catch (err) {
      return res.status(401).json({ error: "Token expired or invalid" });
    }
  };
}

