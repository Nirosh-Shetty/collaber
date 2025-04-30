import { Request, Response } from "express";
import { generateToken } from "../utils/generateToken";
import UserModel from "../models/Users";
import bcryptjs from "bcryptjs";
// import { apiResponse } from "../types/apiResponse";

export const signIn = async (req: Request, res: Response): Promise<any> => {
  const { identifier, password } = req.body;

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
      return res.status(401).json({ message: "User not Found in local" });
    }
    const isPasswordCorrect = await bcryptjs.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = generateToken(user._id.toString(), user.role);

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
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error logging in", error });
  }
};
//i gotta ask chatgpt: i tried this . help m eto correct it  also ask regardinmg th otp thing if user tries to signup and then goes to verofy and closes it and then tries to open signup within 60 sec but user can get the another otp again even before 60 sec
export const signUp = async (req: Request, res: Response): Promise<any> => {
  const { name, email, username, password, role } = req.body;

  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser && !existingUser.isTempAccount && existingUser.isVerified)
      return res.status(400).json({ message: "User already exists" });
    if (
      existingUser &&
      existingUser.isTempAccount &&
      !existingUser.isVerified &&
      existingUser.reservationExpiresAt &&
      existingUser.reservationExpiresAt < new Date()
    ) {
      return res.status(400).json({
        message:
          "We found your pending signup. Please verify your email to continue.",
      });
    }
    const user = await UserModel.create({
      name,
      email,
      username,
      password,
      role,
      isVerified: false,
      isTempAccount: true,
      //TODO: store this reservation Expires time in .env
      reservationExpiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    });
    // const token = generateToken(user._id.toString(), user.role);
    // res.cookie("auth_token", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days in milliseconds
    //   sameSite: "strict",
    // });

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        role: user.role,
      },
      // token,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

export const verifyOtp = async (req: Request, res: Response): Promise<any> => {
  const { email, otp } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.isVerified)
      return res.status(400).json({ message: "User is already verified" });

    if (user.reservationExpiresAt && user.reservationExpiresAt < new Date())
      return res.status(400).json({ message: "Reservation expired" });

    if (user.otp !== otp)
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
    return res.status(500).json({ message: "Verified Successfully" });
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
