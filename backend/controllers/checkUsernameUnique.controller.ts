import { Request, Response } from "express";
import UserModel from "../models/Users";

export const checkUsernameUnique = async (req: Request, res: Response) => {
  try {
    const { username } = req.body;

    if (!username || typeof username !== "string") {
      return res
        .status(400)
        .json({ message: "Username is required and must be a string" });
    }

    const user = await UserModel.findOne({ username }).lean();

    if (!user) {
      return res.status(200).json({
        isUnique: true,
        message: "Username is available",
      });
    }

    return res.status(409).json({
      isUnique: false,
      message: "Username already exists",
    });
    //TODO: if the username is not unique, suggest 2 random yet relatable usernames either here itself or a saparate controller
  } catch (error) {
    console.error("Error checking username uniqueness:", error);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
};
