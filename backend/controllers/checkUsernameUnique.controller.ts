import { Request, Response } from "express";
import UserModel from "../models/Users";

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

    const user = await UserModel.findOne({ username }).lean();

    // Username doesn't exist — available
    if (!user) {
      return res.status(200).json({ availability: "available" });
    }

    const isSameUser =
      user.email === email &&
      !user.isVerified &&
      user.reservationExpiresAt &&
      new Date(user.reservationExpiresAt) > new Date();

    if (isSameUser) {
      return res.status(200).json({ availability: "reserved" });
    }

    // Username taken by someone else
    return res.status(200).json({
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

//TODO: try doing this in saperate controller and call it in saperate api route so you can provide a refersh button in frontend for new suggestions
const generateUsernameSuggestions = async (
  username: string,
  maxSuggestions = 2
): Promise<string[]> => {
  const suggestions = new Set<string>(); // Use Set to avoid duplicates

  const generateRandomUsername = () => {
    const suffix = Math.floor(Math.random() * 10000); // Larger range = better uniqueness
    return Math.random() < 0.5
      ? `${username}${suffix}`
      : `${username}_${suffix}`;
  };

  // Generate 15 unique candidates first
  while (suggestions.size < 15) {
    suggestions.add(generateRandomUsername());
  }

  // Check which ones are actually available
  const candidates = Array.from(suggestions);
  const existingUsers = await UserModel.find({
    username: { $in: candidates },
  }).lean();
  const takenUsernames = new Set(existingUsers.map((u) => u.username));

  // Filter only the available ones
  const availableSuggestions = candidates.filter(
    (name) => !takenUsernames.has(name)
  );

  return availableSuggestions.slice(0, maxSuggestions);
};
