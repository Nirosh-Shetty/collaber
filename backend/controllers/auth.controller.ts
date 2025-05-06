import { Request, Response } from "express";
import { generateToken } from "../utils/generateToken";
import UserModel from "../models/Users";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { mailer } from "../utils/mailer";
// import { apiResponse } from "../types/apiResponse";
export const signUp = async (req: Request, res: Response): Promise<any> => {
  const { name, email, username, password, role } = req.body;

  try {
    //TODO: you need to check if the username is taken or not even though it's already checked in, but it can be bypassed by some tricks. try doing a util function called checkUsernameUnique and use it here and you aslo use it in the checkUSernameUnique controller. ALSo use status code 409 if the username is taken as i used the same status code in the frontend for this purpoose
    const existingUser = await UserModel.findOne({ email });

    // ✅ Case 1: User is already verified
    if (
      existingUser &&
      !existingUser.isTempAccount &&
      existingUser.isVerified
    ) {
      return res
        .status(400)
        .json({ message: "User already exists", redirectTo: "/signin" });
    }

    // ✅ Case 2: Pending signup, reservation not expired
    if (
      existingUser &&
      existingUser.isTempAccount &&
      !existingUser.isVerified &&
      existingUser.reservationExpiresAt &&
      existingUser.reservationExpiresAt > new Date()
    ) {
      return res.status(201).json({
        message:
          "A signup is already in progress for this email. Please verify your email to continue.",
        redirectTo: "/verify-otp",
      });
    }

    // ✅ Case 3: Expired reservation or never existed — clean up and allow re-signup
    if (existingUser) {
      await UserModel.deleteOne({ _id: existingUser._id });
    }

    // ✅ Now create a new temp user
    const hashedPass = await bcryptjs.hash(password, 10);
    await UserModel.create({
      name,
      email,
      username,
      password: hashedPass,
      role,
      authProvider: "local",
      isVerified: false,
      isTempAccount: true,
      reservationExpiresAt: new Date(
        Date.now() +
          (Number(process.env.USER_RESERVATION_EXPIRY_MS) || 60 * 60 * 1000)
      ),
    });

    return res.status(201).json({
      message: "User Created Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error creating user", error });
  }
};
export const signIn = async (req: Request, res: Response): Promise<any> => {
  const { identifier, password } = req.body;
  console.log(req.body);

  try {
    const user = await UserModel.findOne({
      $or: [
        { email: identifier },
        { username: identifier },
        { phoneNumber: identifier },
      ],
    }).lean();
    if (!user) {
      return res.status(401).json({ message: "User not Found" });
    }
    if (user.authProvider !== "local") {
      return res.status(401).json({ message: "User not Found" });
    }
    if (!user.isVerified && user.isTempAccount) {
      if (user.reservationExpiresAt && user.reservationExpiresAt > new Date())
        return res.status(401).json({
          message: "User not verified. Continue to verify the account",
          redirectTo: "/verify-otp",
        });
      else
        return res.status(401).json({
          message: "Reservation expired. You need to signup again",
          redirectTo: "/signup",
        });
    }
    const isPasswordCorrect = await bcryptjs.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = generateToken(user._id.toString(), user.role);
    //TODO: add "remember me" feature in the frtonend
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days in milliseconds
      sameSite: "strict",
    });

    return res.json({
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        role: user.role,
      },
      // token,
      message: "user signin in successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Error logging in", error });
  }
};

export const requestOtp = async (req: Request, res: Response): Promise<any> => {
  //TODO: rate limit otp request per hour/day
  try {
    const { email } = req.body;
    // console.log(req.body, "sfnsdkjfnsdfjks");
    if (!email) {
      return res.status(400).json({
        message: "Cannot find the email. Please signup again.",
        redirectTo: "/signup",
      });
    }
    // Check if the user exists and is a temp account
    const user = await UserModel.findOne({ email }).lean();
    if (!user) {
      return res.status(400).json({
        message: "User not found. You need to signup again",
        redirectTo: "/signup",
      });
    }
    if (user.isVerified && !user.isTempAccount) {
      return res.status(400).json({
        message: "User is already verified. You can  signin directly",
        redirectTo: "/login",
      });
    }
    if (
      user.isTempAccount &&
      user.reservationExpiresAt &&
      user.reservationExpiresAt < new Date()
    ) {
      return res.status(400).json({
        message: "Reservation expired. You need to signup again",
        redirectTo: "/signup",
      });
    }

    if (
      user.lastOtpSentAt &&
      user.lastOtpSentAt.getTime() > Date.now() - 60 * 1000
    ) {
      return res.status(400).json({
        message: "OTP already sent",
        // countdown:
        //   60 - Math.floor((Date.now() - user.lastOtpSentAt.getTime()) / 1000),
        lastOtpSentAt: user.lastOtpSentAt,
      });
    }
    const otp = crypto.randomInt(100000, 1000000).toString(); // Generate a 6-digit OTP
    const response = await mailer(email, user.username, otp);
    if (!response) {
      return res.status(500).json({ message: "Error sending OTP" });
    }
    if (!response.success) {
      return res.status(500).json({ message: response.message });
    }
    // Save OTP to the user record
    await UserModel.updateOne(
      { email },
      {
        $set: {
          otp,
          lastOtpSentAt: new Date(),
        },
      }
    );

    return res.status(200).json({
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.log(error, "this is error in sendOtpEmail function");
    return res.status(500).json({ message: "Error sending OTP" });
  }
};
export const verifyOtp = async (req: Request, res: Response): Promise<any> => {
  const { email, otp } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ message: "User not found", redirectTo: "/signup" });

    if (user.isVerified)
      return res
        .status(400)
        .json({ message: "User is already verified", redirectTo: "/signin" });

    if (user.reservationExpiresAt && user.reservationExpiresAt < new Date())
      return res
        .status(400)
        .json({ message: "Reservation expired", redirectTo: "/signup" });

    // if (user.otp !== otp)
    //TODO: chanhe this during production
    if ("111111" !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    user.isVerified = true;
    user.otp = undefined; // Clear OTP after verification
    user.isTempAccount = false; // Mark account as permanent
    user.reservationExpiresAt = undefined;

    await user.save();

    const token = generateToken(user._id.toString(), user.role);
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days
      sameSite: "lax",
    });
    return res.status(201).json({ message: "Verified Successfully" });
  } catch (error) {
    console.error(error); // log internally
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const signout = (req: Request, res: Response): any => {
  try {
    res.clearCookie("auth_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });
    // console.log("signout successful");
    return res.status(200).json({ message: "Logged out" });
  } catch (error) {
    console.error("Error during signout:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
