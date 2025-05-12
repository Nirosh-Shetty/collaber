import express, { Response, Request } from "express";
import passport from "passport";
import {
  requestOtp,
  signIn,
  signout,
  signUpBasicInfo,
  verifyOtp,
} from "../controllers/auth.controller";
import { generateToken } from "../utils/generateToken";
import { IUser } from "../types/user";
import { checkUsernameUnique } from "../controllers/checkUsernameUnique.controller";
const authRouter = express.Router();

authRouter.post("/signin", signIn);
authRouter.post("/signup", signUpBasicInfo);

authRouter.get("/google", (req, res, next): any => {
  const { role } = req.query;

  // if (!role || !["influencer", "brand", "manager"].includes(role as string)) {
  //   return res.status(400).json({ message: "Missing or invalid role" });
  // }
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: role as string,
  })(req, res, next);
});

authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/signup/select-role`,
    session: false,
  }),
  async (req: Request, res: Response): Promise<void> => {
    const user = req.user as IUser;
    // console.log(req.query);
    if (!user || typeof user !== "object") {
      res.status(401).json({ message: "Authentication failed" });
      return;
    }

    // const safeUser = user as IUser;

    const token = generateToken(user.id.toString(), user.role);

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days in milliseconds
      sameSite: "lax",
    });
    // TODO: keep this in .env file
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  }
);

authRouter.get("/facebook", (req, res, next) => {
  const { role } = req.query;

  passport.authenticate("facebook", {
    scope: ["email"],
    state: role as string,
  })(req, res, next);
});
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

    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  }
);

authRouter.post("/signup/basic-info", signUpBasicInfo);
//TODO: change the url and controller name. give a signup related name like above
authRouter.post("/signup/request-otp", requestOtp);
authRouter.post("/signup/verify-otp", verifyOtp);

// POST /api/auth/signout
authRouter.post("/signout", signout);

authRouter.post("/check-username-unique", checkUsernameUnique);

export default authRouter;
