import { Request, Response } from "express";
import UserModel from "../models/Users";
import DiscoverShortlistModel from "../models/DiscoverShortlist";
import DiscoverInviteModel from "../models/DiscoverInvite";
import CampaignModel from "../models/Campaign";

const parseNumber = (value: unknown): number | undefined => {
  if (value === undefined || value === null || value === "") return undefined;
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : undefined;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const getDiscoverInfluencers = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const requesterRole = (req as any).user?.role;
    if (!requesterRole) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const {
      q = "",
      niche = "",
      minFollowers,
      maxFollowers,
      minEngagement,
      verified,
      page = 1,
      limit = 20,
    } = req.query;

    const minFollowersNum = parseNumber(minFollowers) ?? 0;
    const maxFollowersNum = parseNumber(maxFollowers);
    const minEngagementNum = parseNumber(minEngagement) ?? 0;
    const pageNum = Math.max(1, parseNumber(page) ?? 1);
    const limitNum = clamp(parseNumber(limit) ?? 20, 1, 50);

    const query: any = {
      role: "influencer",
    };

    if (String(q).trim()) {
      const regex = new RegExp(String(q).trim(), "i");
      query.$or = [
        { name: regex },
        { username: regex },
        { "influencerDetails.niche": regex },
      ];
    }

    if (String(niche).trim()) {
      query["influencerDetails.niche"] = new RegExp(String(niche).trim(), "i");
    }

    if (verified === "true") {
      query.isVerified = true;
    } else if (verified === "false") {
      query.isVerified = false;
    }

    const followerRange: any = {};
    if (minFollowersNum > 0) followerRange.$gte = minFollowersNum;
    if (typeof maxFollowersNum === "number") followerRange.$lte = maxFollowersNum;
    if (Object.keys(followerRange).length > 0) {
      query["influencerDetails.followers"] = followerRange;
    }

    const skip = (pageNum - 1) * limitNum;

    const [influencers, total] = await Promise.all([
      UserModel.find(query)
        .select(
          "name username profilePicture isVerified influencerDetails.niche influencerDetails.followers"
        )
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      UserModel.countDocuments(query),
    ]);

    const formatted = influencers
      .map((influencer: any) => {
        const followers = Number(influencer?.influencerDetails?.followers || 0);
        const engagementRate = clamp(
          3 + Math.log10(Math.max(followers, 10)) * 1.35,
          1.8,
          10.5
        );

        if (engagementRate < minEngagementNum) return null;

        const avgViews = Math.round(followers * (engagementRate / 100) * 4.3);
        const estCpv = avgViews > 0 ? (Math.max(0.02, 6.5 / avgViews)).toFixed(2) : "0.08";
        const fitScore = clamp(
          Math.round(55 + Math.min(30, engagementRate * 3.2) + (influencer.isVerified ? 7 : 0)),
          50,
          98
        );

        return {
          id: String(influencer._id),
          name: influencer.name || "",
          handle: influencer.username ? `@${influencer.username}` : "",
          niche: influencer?.influencerDetails?.niche || "General",
          location: "Unknown",
          followers,
          engagementRate: Number(engagementRate.toFixed(1)),
          avgViews,
          estCpv: Number(estCpv),
          fitScore,
          verified: Boolean(influencer.isVerified),
          tags: ["Campaign Ready", "Fast Response", "ROI Trackable"],
          profilePicture: influencer.profilePicture || "",
        };
      })
      .filter(Boolean);

    return res.status(200).json({
      items: formatted,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        hasMore: skip + formatted.length < total,
      },
    });
  } catch (error) {
    console.error("Error fetching discover influencers:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getDiscoverShortlist = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const requester = (req as any).user;
    if (!requester?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (requester.role !== "brand") {
      return res.status(403).json({ message: "Only brand accounts can use shortlist" });
    }

    const items = await DiscoverShortlistModel.find({ brandId: requester.id })
      .select("influencerId")
      .lean();

    return res.status(200).json({
      influencerIds: items.map((item: any) => String(item.influencerId)),
    });
  } catch (error) {
    console.error("Error fetching shortlist:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const addToDiscoverShortlist = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const requester = (req as any).user;
    if (!requester?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (requester.role !== "brand") {
      return res.status(403).json({ message: "Only brand accounts can shortlist influencers" });
    }

    const { influencerId } = req.body;
    if (!influencerId) {
      return res.status(400).json({ message: "influencerId is required" });
    }

    const influencer = await UserModel.findOne({
      _id: influencerId,
      role: "influencer",
    })
      .select("_id")
      .lean();

    if (!influencer) {
      return res.status(404).json({ message: "Influencer not found" });
    }

    await DiscoverShortlistModel.findOneAndUpdate(
      { brandId: requester.id, influencerId: String(influencerId) },
      { $setOnInsert: { brandId: requester.id, influencerId: String(influencerId) } },
      { upsert: true, new: true }
    );

    return res.status(200).json({ message: "Added to shortlist" });
  } catch (error) {
    console.error("Error adding shortlist item:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const removeFromDiscoverShortlist = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const requester = (req as any).user;
    if (!requester?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (requester.role !== "brand") {
      return res.status(403).json({ message: "Only brand accounts can shortlist influencers" });
    }

    const { influencerId } = req.params;
    if (!influencerId) {
      return res.status(400).json({ message: "influencerId is required" });
    }

    await DiscoverShortlistModel.deleteOne({
      brandId: requester.id,
      influencerId: String(influencerId),
    });

    return res.status(200).json({ message: "Removed from shortlist" });
  } catch (error) {
    console.error("Error removing shortlist item:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createDiscoverInvites = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const requester = (req as any).user;
    if (!requester?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (requester.role !== "brand") {
      return res.status(403).json({ message: "Only brand accounts can send invites" });
    }

    const { influencerIds, campaignId, campaignLabel = "", note = "" } = req.body;
    if (!Array.isArray(influencerIds) || influencerIds.length === 0) {
      return res.status(400).json({ message: "influencerIds array is required" });
    }
    if (!campaignId) {
      return res.status(400).json({ message: "campaignId is required" });
    }

    const campaign = await CampaignModel.findOne({
      _id: String(campaignId),
      brandId: requester.id,
    })
      .select("_id name")
      .lean();

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    const uniqueIds = Array.from(new Set(influencerIds.map((value: any) => String(value))));

    const influencers = await UserModel.find({
      _id: { $in: uniqueIds },
      role: "influencer",
    })
      .select("_id")
      .lean();
    const validIds = new Set(influencers.map((item: any) => String(item._id)));

    const created: string[] = [];
    const skipped: string[] = [];

    for (const influencerId of uniqueIds) {
      if (!validIds.has(influencerId)) {
        skipped.push(influencerId);
        continue;
      }

      const existingPending = await DiscoverInviteModel.findOne({
        brandId: requester.id,
        influencerId,
        campaignId: String(campaign._id),
        status: "pending",
      })
        .select("_id")
        .lean();

      if (existingPending) {
        skipped.push(influencerId);
        continue;
      }

      const invite = await DiscoverInviteModel.create({
        brandId: requester.id,
        influencerId,
        campaignId: String(campaign._id),
        campaignLabel: String(campaignLabel || campaign.name || ""),
        note: String(note || ""),
        status: "pending",
      });
      created.push(String(invite.influencerId));
    }

    return res.status(200).json({
      message: "Invites processed",
      created,
      skipped,
    });
  } catch (error) {
    console.error("Error creating discover invites:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getDiscoverInvites = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const requester = (req as any).user;
    if (!requester?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { status = "pending", page = 1, limit = 20 } = req.query;
    const pageNum = Math.max(1, parseNumber(page) ?? 1);
    const limitNum = clamp(parseNumber(limit) ?? 20, 1, 50);
    const skip = (pageNum - 1) * limitNum;

    const statusFilter =
      status === "all"
        ? undefined
        : {
            status: String(status),
          };

    if (requester.role === "influencer") {
      const query: any = {
        influencerId: requester.id,
        ...(statusFilter || {}),
      };

      const [items, total] = await Promise.all([
        DiscoverInviteModel.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limitNum)
          .lean(),
        DiscoverInviteModel.countDocuments(query),
      ]);

      const brandIds = Array.from(new Set(items.map((item: any) => String(item.brandId))));
      const brands = await UserModel.find(
        { _id: { $in: brandIds } },
        { name: 1, username: 1, "brandDetails.companyName": 1, profilePicture: 1 }
      ).lean();
      const brandMap = new Map(brands.map((brand: any) => [String(brand._id), brand]));

      return res.status(200).json({
        items: items.map((item: any) => {
          const brand = brandMap.get(String(item.brandId));
          return {
            id: String(item._id),
            brandId: String(item.brandId),
            brandName:
              brand?.brandDetails?.companyName || brand?.name || brand?.username || "Brand",
            brandHandle: brand?.username ? `@${brand.username}` : "",
            campaignId: String(item.campaignId || ""),
            campaignLabel: item.campaignLabel || "",
            note: item.note || "",
            status: item.status,
            createdAt: item.createdAt,
          };
        }),
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          hasMore: skip + items.length < total,
        },
      });
    }

    if (requester.role === "brand") {
      const query: any = {
        brandId: requester.id,
        ...(statusFilter || {}),
      };

      const [items, total] = await Promise.all([
        DiscoverInviteModel.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limitNum)
          .lean(),
        DiscoverInviteModel.countDocuments(query),
      ]);

      const influencerIds = Array.from(
        new Set(items.map((item: any) => String(item.influencerId)))
      );
      const influencers = await UserModel.find(
        { _id: { $in: influencerIds } },
        { name: 1, username: 1, profilePicture: 1, "influencerDetails.niche": 1 }
      ).lean();
      const influencerMap = new Map(
        influencers.map((influencer: any) => [String(influencer._id), influencer])
      );

      return res.status(200).json({
        items: items.map((item: any) => {
          const influencer = influencerMap.get(String(item.influencerId));
          return {
            id: String(item._id),
            influencerId: String(item.influencerId),
            influencerName: influencer?.name || influencer?.username || "Influencer",
            influencerHandle: influencer?.username ? `@${influencer.username}` : "",
            influencerNiche: influencer?.influencerDetails?.niche || "",
            campaignId: String(item.campaignId || ""),
            campaignLabel: item.campaignLabel || "",
            note: item.note || "",
            status: item.status,
            createdAt: item.createdAt,
          };
        }),
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          hasMore: skip + items.length < total,
        },
      });
    }

    return res.status(403).json({ message: "Role not supported for invites" });
  } catch (error) {
    console.error("Error fetching discover invites:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const respondToDiscoverInvite = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const requester = (req as any).user;
    if (!requester?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (requester.role !== "influencer") {
      return res.status(403).json({ message: "Only influencers can respond to invites" });
    }

    const { inviteId } = req.params;
    const { action } = req.body;

    if (!inviteId) {
      return res.status(400).json({ message: "inviteId is required" });
    }

    if (action !== "accepted" && action !== "rejected") {
      return res.status(400).json({ message: "action must be accepted or rejected" });
    }

    const invite = await DiscoverInviteModel.findOne({
      _id: inviteId,
      influencerId: requester.id,
    });

    if (!invite) {
      return res.status(404).json({ message: "Invite not found" });
    }

    if (invite.status !== "pending") {
      return res.status(409).json({ message: "Invite already processed" });
    }

    invite.status = action;
    await invite.save();

    return res.status(200).json({
      message: `Invite ${action}`,
      invite: {
        id: String(invite._id),
        status: invite.status,
      },
    });
  } catch (error) {
    console.error("Error responding to discover invite:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
