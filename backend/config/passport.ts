// config/passport.ts or wherever you're setting strategies
import passport from "passport";
import {
  Strategy as GoogleStrategy,
  VerifyCallback,
} from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import UserModel from "../models/Users"; // Your user model
import dotenv from "dotenv";
import { Request, Response as ExpressResponse } from "express";
import { generateUsernameSuggestions } from "../utils/generateUsernameSuggestions";
import sessionStore from "../utils/sessionStore";
import { uploadProfilePhotoToCloud } from "../utils/uploadProfilePhotoToCloud";
// import { google } from "googleapis";
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
      passReqToCallback: true,
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
        const email = profile.emails?.[0]?.value;
        if (!email) return done(null, false, { message: "Email missing" });

        let user = await UserModel.findOne({ email });
        const ip =
          (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
          req.ip ||
          "unknown";
        const loginEvent = {
          ip,
          userAgent: req.get("User-Agent") || "unknown",
          time: new Date(),
        };
        if (!user) {
          if (!role || !["influencer", "brand", "manager"].includes(role)) {
            // If no role is provided, redirect to select role page
            const basicProfile = {
              name: profile.displayName,
              email,
              provider: "google",
              profilePictureUrl: profile.photos?.[0]?.value,
              googleId: profile.id,
            };

            const sessionId = await sessionStore.set(basicProfile, 5 * 60);
            (req.res as ExpressResponse).cookie("sessionId", sessionId, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              maxAge: 10 * 60 * 1000,
            });

            return (req.res as ExpressResponse).redirect(
              `${process.env.FRONTEND_URL}/signup/role?fromProvider=google`
            );
          }

          const usernameSuggested = await generateUsernameSuggestions(
            email.split("@")[0],
            1
          );
          const profilePictureUrl = profile.photos?.[0]?.value;
          // console.log(profilePictureUrl);
          let uploadedPictureUrl = "";
          if (profilePictureUrl) {
            try {
              uploadedPictureUrl = await uploadProfilePhotoToCloud(
                profilePictureUrl,
                "profile-pictures"
              );
            } catch (uploadErr) {
              console.error("Profile picture upload failed:", uploadErr);
              uploadedPictureUrl = "";
            }
          }

          user = new UserModel({
            name: profile.displayName,
            email,
            username: usernameSuggested[0],
            role,
            googleId: profile.id,
            isVerified: true,
            isTempAccount: false,
            linkedAccounts: ["google"],
            profilePicture: uploadedPictureUrl,
            loginHistory: [loginEvent],
          });

          await user.save();
        } else {
          // Add "google" to linkedAccounts if not already present
          if (!user.linkedAccounts) {
            user.linkedAccounts = [];
          }
          if (!user.linkedAccounts.includes("google")) {
            user.linkedAccounts.push("google");
          }

          if (!user.googleId) user.googleId = profile.id;
          if (!user.profilePicture && profile.photos?.[0]?.value) {
            const profilePictureUrl = profile.photos?.[0]?.value;
            console.log(profilePictureUrl);
            let uploadedPictureUrl = "";
            if (profilePictureUrl) {
              try {
                uploadedPictureUrl = await uploadProfilePhotoToCloud(
                  profilePictureUrl,
                  "profile-pictures"
                );
              } catch (uploadErr) {
                console.error("Profile picture upload failed:", uploadErr);
                uploadedPictureUrl = "";
              }
            }

            user.profilePicture = uploadedPictureUrl;
          }
          user.loginHistory.push(loginEvent);

          await user.save();
        }

        // const oauth2Client = new google.auth.OAuth2();
        // oauth2Client.setCredentials({
        //   access_token: accessToken,
        //   refresh_token: refreshToken,
        // });

        // const youtubeAnalytics = google.youtubeAnalytics("v2");
        // const response = await youtubeAnalytics.reports.query({
        //   auth: oauth2Client,
        //   ids: "channel==MINE",
        //   startDate: "2023-01-01",
        //   endDate: "2023-12-31",
        //   metrics: "views,likes,subscribersGained",
        // });
        // console.log(JSON.stringify(response.data, null, 2));
        // const { columnHeaders, rows } = response.data;

        // console.log(
        //   "Columns:",
        //   columnHeaders.map((c) => c.name)
        // );
        // console.log("Data:", rows);

        return done(null, {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          username: user.username,
          role: user.role,
        });
      } catch (err) {
        console.error("Google strategy error:", err);
        return done(err, undefined);
      }
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      callbackURL: `${process.env.BACKEND_URL}/api/auth/facebook/callback`,
      profileFields: [
        "id",
        "emails",
        "name",
        "displayName",
        "picture.type(large)",
      ],
      passReqToCallback: true,
    },
    async (
      req: Request,
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: VerifyCallback
    ) => {
      try {
        console.log("access token", accessToken);
        const role = req.query?.state as string;
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(null, false, {
            message: "Email not found in Facebook profile.",
          });
        }

        let user = await UserModel.findOne({ email });
        const ip =
          (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
          req.ip ||
          "unknown";
        const loginEvent = {
          ip,
          userAgent: req.get("User-Agent") || "unknown",
          time: new Date(),
        };

        // If user does not exist, check for role and redirect if missing
        if (!user) {
          if (!role || !["influencer", "brand", "manager"].includes(role)) {
            // Prepare minimal profile for session storage
            const basicProfile = {
              name:
                profile.displayName ||
                `${profile.name?.givenName || ""} ${
                  profile.name?.familyName || ""
                }`.trim(),
              email,
              provider: "facebook",
              profilePictureUrl: profile.photos?.[0]?.value,
              facebookId: profile.id,
            };

            const sessionId = await sessionStore.set(basicProfile, 5 * 60);
            (req.res as ExpressResponse).cookie("sessionId", sessionId, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              maxAge: 10 * 60 * 1000,
            });

            // Return immediately after redirecting!
            return (req.res as ExpressResponse).redirect(
              `${process.env.FRONTEND_URL}/signup/role?fromProvider=facebook`
            );
          }

          // Generate username and upload profile picture if needed
          const usernameSuggested = await generateUsernameSuggestions(
            email.split("@")[0],
            1
          );
          const profilePictureUrl = profile.photos?.[0]?.value;
          let uploadedPictureUrl = "";
          if (profilePictureUrl) {
            try {
              uploadedPictureUrl = await uploadProfilePhotoToCloud(
                profilePictureUrl,
                "profile-pictures"
              );
            } catch (uploadErr) {
              console.error("Profile picture upload failed:", uploadErr);
              uploadedPictureUrl = "";
            }
          }

          user = new UserModel({
            name:
              profile.displayName ||
              `${profile.name?.givenName || ""} ${
                profile.name?.familyName || ""
              }`.trim(),
            email,
            username: usernameSuggested[0],
            facebookId: profile.id,
            role,
            isVerified: true,
            isTempAccount: false,
            linkedAccounts: ["facebook"],
            profilePicture: uploadedPictureUrl,
            loginHistory: [loginEvent],
          });

          await user.save();
        } else {
          // Existing user: update linked accounts and profile picture if needed
          if (!user.linkedAccounts) {
            user.linkedAccounts = [];
          }

          if (!user.linkedAccounts.includes("facebook")) {
            user.linkedAccounts.push("facebook");
          }

          if (!user.facebookId) user.facebookId = profile.id;
          if (!user.profilePicture && profile.photos?.[0]?.value) {
            const profilePictureUrl = profile.photos?.[0]?.value;
            let uploadedPictureUrl = "";
            if (profilePictureUrl) {
              try {
                uploadedPictureUrl = await uploadProfilePhotoToCloud(
                  profilePictureUrl,
                  "profile-pictures"
                );
              } catch (uploadErr) {
                console.error("Profile picture upload failed:", uploadErr);
                uploadedPictureUrl = "";
              }
            }
            user.profilePicture = uploadedPictureUrl;
          }
          user.loginHistory.push(loginEvent);
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
        console.error("Facebook strategy error:", err);
        return done(err, undefined);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await UserModel.findById(id);
    if (user) {
      done(null, {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
      });
    } else {
      done(null, null);
    }
  } catch (error) {
    done(error, null);
  }
});
