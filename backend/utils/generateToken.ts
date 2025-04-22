import jwt from "jsonwebtoken";

export const generateToken = (userId: string, role: String) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET!, {
    expiresIn: "5d",
  });
};
