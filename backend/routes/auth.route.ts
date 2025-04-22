import express, { Response, Request } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { signIn } from "../controllers/auth.controller";
import { generateToken } from "../utils/generateToken";
import { IUser } from "../types/user";
const authRouter = express.Router();

authRouter.post("/signin", signIn);

authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  async (req: Request, res: Response): Promise<void> => {
    const user = req.user as IUser;

    if (!user || typeof user !== "object") {
      res.status(401).json({ message: "Authentication failed" });
      return;
    }

    // const safeUser = user as IUser;

    const token = generateToken(user._id.toString(), user.role);

    res.redirect(`http://localhost:3000/dashboard?token=${token}`);
  }
);

export default authRouter;
