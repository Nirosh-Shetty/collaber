// config/passport.ts or wherever you're setting strategies
import passport from "passport";
import {
  Strategy as GoogleStrategy,
  VerifyCallback,
} from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import UserModel from "../models/Users"; // Your user model
import dotenv from "dotenv";
import { Request } from "express";
import { generateUsernameSuggestions } from "../utils/generateUsernameSuggestions";
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "http://localhost:8000/api/auth/google/callback",
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
        const role = req.query?.state as string;

        // console.log(role, "this is role from query");
        // if (!role || !["influencer", "brand", "manager"].includes(role)) {
        //   return done(null, false, { message: "Invalid or missing role." });
        // }
        // console.log("this is google profile", profile);

        // Check if user already exists
        let user = await UserModel.findOne({
          email: profile.emails?.[0].value,
        });

        if (!user) {
          if (!role) {
            return done(null, false, {
              message: "Role missing during signup.",
            });
          }
          // Create new user
          const usernameSuggested = await generateUsernameSuggestions(
            profile.emails?.[0].value.split("@")[0],
            1
          );
          user = new UserModel({
            name: profile.displayName,
            email: profile.emails?.[0].value,
            //TODO: check if username is unique if not assign a radom yet relatable username
            username: usernameSuggested[0],
            // profilePicture: profile.photos?.[0].value,
            // password: "GOOGLE_AUTH", // placeholder or null
            role,
            authProvider: "google",
            isVerified: true,
            isTempAccount: false,
          });

          await user.save();
        }

        done(null, {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          username: user.username,
          role: user.role,
        });
      } catch (err) {
        console.log(err, "this is error in google strategy");
        done(err, undefined);
      }
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      callbackURL: "http://localhost:8000/api/auth/facebook/callback",
      profileFields: ["id", "emails", "name", "picture.type(large)"],
      passReqToCallback: true, // enable req access in verify callback
    },
    async (
      req: Request,
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: VerifyCallback
    ) => {
      try {
        const role = req.query?.state as string;

        // if (!role || !["influencer", "brand", "manager"].includes(role)) {
        //   return done(null, false, { message: "Invalid or missing role." });
        // }

        const email = profile.emails?.[0].value;

        if (!email) {
          return done(null, false, {
            message: "Email not found in Facebook profile.",
          });
        }
        const usernameSuggested = await generateUsernameSuggestions(
          profile.emails?.[0].value.split("@")[0],
          1
        );
        let user = await UserModel.findOne({ email });
        if (!user) {
          user = new UserModel({
            name: profile.displayName,
            email: profile.emails?.[0].value,
            username: usernameSuggested[0],
            // profilePicture: profile.photos?.[0].value,
            // password: "FACEBOOK_AUTH", // just a placeholder
            role,
            authProvider: "facebook",
            isVerified: true,
            isTempAccount: false,
          });

          await user.save();
        }
        return done(null, {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          username: user.username,
          role: user.role,
        });
      } catch (err) {
        return done(err, undefined);
      }
    }
  )
);
