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
    failureRedirect: "/signin",
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

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days in milliseconds
      sameSite: "strict",
    });
    // TODO: keep this in .env file
    res.redirect(`http://localhost:3000/dashboard?token=${token}`);
  }
);

authRouter.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

authRouter.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/login",
    session: false,
  }),
  (req: Request, res: Response): any => {
    const user = req.user as IUser;

    if (!user || typeof user !== "object") {
      return res.status(401).json({ message: "Authentication failed" });
    }

    // const safeUser = user as { _id: string; email: string };

    const token = generateToken(user._id.toString(), user.role);

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 5 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });

    res.redirect(`http://localhost:3000/dashboard`);
  }
);

export default authRouter;
