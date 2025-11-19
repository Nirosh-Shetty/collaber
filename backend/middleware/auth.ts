import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AccessTokenPayload } from "../types/jwt";
 
export const auth =
  (required: boolean = true) =>
  (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
 
    if (!header) {
      if (!required) return next();
      return res.status(401).json({ error: "No token provided" });
    }
 
    const token = header.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Invalid auth header" });
    }
 
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET!
      ) as AccessTokenPayload;
 
      req.user = {
        uid: decoded.uid,
        role: decoded.role,
        username: decoded.username,
      };
 
      next();
    } catch (err) {
      return res.status(401).json({ error: "Token expired or invalid" });
    }
  };
 
