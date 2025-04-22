// config/passport.ts or wherever you're setting strategies
import passport from "passport";
import {
  Strategy as GoogleStrategy,
  VerifyCallback,
} from "passport-google-oauth20";
import UserModel from "../models/Users"; // Your user model
import dotenv from "dotenv";
import { Request } from "express";
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "http://localhost:5000/api/auth/google/callback",
      passReqToCallback: true, // Required to access req in callback
    },
    async (
      req: Request,
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: VerifyCallback
    ) => {
      try {
        const role = req.query.role as string;

        if (!role || !["influencer", "brand", "manager"].includes(role)) {
          return done(null, false, { message: "Invalid or missing role." });
        }

        // Check if user already exists
        let user = await UserModel.findOne({
          email: profile.emails?.[0].value,
        });

        if (!user) {
          // Create new user
          user = new UserModel({
            name: profile.displayName,
            email: profile.emails?.[0].value,
            username: profile.emails?.[0].value.split("@")[0],
            profilePicture: profile.photos?.[0].value,
            password: "GOOGLE_AUTH", // placeholder or null
            role,
          });

          await user.save();
        }

        done(null, user);
      } catch (err) {
        done(err, undefined);
      }
    }
  )
);
