import { Request, Response } from "express";
import UserModel from "../models/Users";
import { generateUsernameSuggestions } from "../utils/generateUsernameSuggestions";

export const checkUsernameUnique = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { email, username } = req.body;

    if (!username || typeof username !== "string") {
      return res
        .status(400)
        .json({ message: "Username is required and must be a string" });
    }
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      return res.status(400).json({ message: "Invalid username format" });
    }

    const user = await UserModel.findOne({ username }).lean();

    // Username doesn't exist — available
    if (!user) {
      return res.status(200).json({
        message: "Username is available",
        availability: "available",
      });
    }

    const isSameUser =
      user.email === email &&
      !user.isVerified &&
      user.reservationExpiresAt &&
      new Date(user.reservationExpiresAt) > new Date();

    if (isSameUser) {
      return res.status(200).json({
        message: "Username is reserved for you",
        availability: "reserved",
      });
    }

    // Username taken by someone else
    return res.status(200).json({
      message: "Username is taken",
      availability: "taken",
      suggestions: await generateUsernameSuggestions(username),
    });
  } catch (error) {
    console.error("Error checking username uniqueness:", error);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
};
