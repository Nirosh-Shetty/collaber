import { Request, Response } from "express";
import { generateToken } from "../utils/generateToken";
import UserModel from "../models/Users";
import bcryptjs from "bcryptjs";
// import { apiResponse } from "../types/apiResponse";

export const signIn = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email }).lean();
    if (!user) {
      return res.status(401).json({ message: "User not Found" });
    }

    const isPasswordCorrect = await bcryptjs.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = generateToken(user._id.toString(), user.role);

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

export const signUp = async (req: Request, res: Response) => {
  const { name, email, username, password, role } = req.body;

  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const user = await UserModel.create({
      name,
      email,
      username,
      password,
      role,
    });
    const token = generateToken(user._id.toString(), user.role);

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days in milliseconds
      sameSite: "strict",
    });

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
