import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import UserModel from "../models/Users";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const profile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await UserModel.findById(userId).select("-password").lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getPublicInfluencerProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }
    if (!isValidObjectId(userId)) {
      return res.status(404).json({ message: "Influencer profile not found" });
    }

    const user: any = await UserModel.findOne({
      _id: userId,
      role: "influencer",
    })
      .select(
        "name username role profilePicture isVerified rating totalReviews influencerDetails.niche influencerDetails.followers influencerDetails.socialLinks"
      )
      .lean();

    if (!user) {
      return res.status(404).json({ message: "Influencer profile not found" });
    }

    const followers = Number(user?.influencerDetails?.followers || 0);
    const engagementRate = clamp(
      Number((3 + Math.log10(Math.max(followers, 10)) * 1.35).toFixed(1)),
      1.8,
      10.5
    );
    const avgViews = Math.round(followers * (engagementRate / 100) * 4.3);
    const estCpv = Number(
      (avgViews > 0 ? Math.max(0.02, 6.5 / avgViews) : 0.08).toFixed(2)
    );
    const fitScore = clamp(
      Math.round(
        55 + Math.min(30, engagementRate * 3.2) + (user.isVerified ? 7 : 0)
      ),
      50,
      98
    );

    const socialLinks = user?.influencerDetails?.socialLinks
      ? Object.fromEntries(Object.entries(user.influencerDetails.socialLinks))
      : {};

    return res.status(200).json({
      id: String(user._id),
      name: user.name || "",
      handle: user.username ? `@${user.username}` : "",
      role: user.role,
      profilePicture: user.profilePicture || "",
      verified: Boolean(user.isVerified),
      niche: user?.influencerDetails?.niche || "General",
      followers,
      rating: Number(user.rating || 0),
      totalReviews: Number(user.totalReviews || 0),
      socialLinks,
      metrics: {
        engagementRate,
        avgViews,
        estCpv,
        fitScore,
      },
      highlights: [
        "Campaign-ready workflow and timely communication",
        "Structured content planning and deliverable tracking",
        "ROI-focused collaboration style for brand outcomes",
      ],
    });
  } catch (error) {
    console.error("Error fetching public influencer profile:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
