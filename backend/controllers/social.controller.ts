import { Request, Response } from "express";
import axios from "axios";
import { google } from "googleapis";
import crypto from "crypto";
import UserModel from "../models/Users";
import { SocialConnection } from "../types/user";

const STATE_SECRET = process.env.SOCIAL_STATE_SECRET || "super-secret";
const STATE_TTL_MS = 5 * 60 * 1000; // 5 mins

const buildState = (userId: string) => {
  const payload = `${userId}:${Date.now()}`;
  const hmac = crypto.createHmac("sha256", STATE_SECRET).update(payload).digest("hex");
  return `${Buffer.from(payload).toString("base64")}:${hmac}`;
};

const verifyState = (state?: string) => {
  if (!state) return null;
  const [encoded, signature] = state.split(":");
  if (!encoded || !signature) return null;
  const payload = Buffer.from(encoded, "base64").toString("utf-8");
  const expected = crypto.createHmac("sha256", STATE_SECRET).update(payload).digest("hex");
  if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) return null;
  const [userId, timestamp] = payload.split(":");
  if (!userId || !timestamp) return null;
  if (Date.now() - Number(timestamp) > STATE_TTL_MS) return null;
  return userId;
};

const ensureInfluencer = (req: Request) => (req as any).user?.role === "influencer";
// const getUserId = (req: Request) => (req as any).user?.id;

const requireAuthUser = (req: Request, res: Response) => {
  console.log("Authenticated user:", (req as any).user?.id);
  const userId = (req as any).user?.id
  console.log("Extracted userId:", userId);
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return null;
  }
  return userId as string;
};

const saveSocialConnection = async (
  user: any,
  platform: string,
  payload: SocialConnection
) => {
  const details = user.influencerDetails || {};
  const connections = new Map(details.socialConnections || []);
  const existing = connections.get(platform) || {};
  connections.set(platform, {
    ...existing,
    ...payload,
    lastSynced: payload.lastSynced ?? new Date(),
  });
  details.socialConnections = connections;
  user.influencerDetails = details;
  user.markModified("influencerDetails.socialConnections");
  await user.save();
};

const buildYoutubeClient = () => {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.BACKEND_URL}/api/social/connect/youtube/callback`
  );
};

const INSTAGRAM_SCOPES = [
  "instagram_basic",
  "pages_show_list",
  "instagram_manage_insights",
  "pages_read_engagement",
];

const buildInstagramUrl = (state: string) => {
  const params = new URLSearchParams({
    client_id: process.env.FACEBOOK_APP_ID || "",
    redirect_uri: `${process.env.BACKEND_URL}/api/social/connect/instagram/callback`,
    state,
    scope: INSTAGRAM_SCOPES.join(","),
    response_type: "code",
  });
  return `https://www.facebook.com/v17.0/dialog/oauth?${params.toString()}`;
};

const exchangeInstagramToken = async (code: string) => {
  const params = new URLSearchParams({
    client_id: process.env.FACEBOOK_APP_ID || "",
    redirect_uri: `${process.env.BACKEND_URL}/api/social/connect/instagram/callback`,
    client_secret: process.env.FACEBOOK_APP_SECRET || "",
    code,
  });
  const response = await axios.get(`https://graph.facebook.com/v17.0/oauth/access_token?${params.toString()}`);
  return response.data.access_token as string;
};

const exchangeLongLivedInstagramToken = async (shortToken: string) => {
  const params = new URLSearchParams({
    grant_type: "fb_exchange_token",
    client_id: process.env.FACEBOOK_APP_ID || "",
    client_secret: process.env.FACEBOOK_APP_SECRET || "",
    fb_exchange_token: shortToken,
  });
  const response = await axios.get(`https://graph.facebook.com/v17.0/oauth/access_token?${params.toString()}`);
  return response.data.access_token as string;
};

const YOUTUBE_SCOPES = [
  "https://www.googleapis.com/auth/youtube.readonly",
  "https://www.googleapis.com/auth/yt-analytics.readonly",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

const handleSocialCallback = async (
  state: string | undefined,
  res: Response,
  handler: (userId: string) => Promise<void>
) => {
  const userId = verifyState(state);
  if (!userId) {
    return res.status(400).json({ message: "Invalid or expired state" });
  }
  try {
    return await handler(userId);
  } catch (err: any) {
    const status = err?.status ?? 500;
    const message = err?.message ?? "Social connection failed";
    if (!res.headersSent) {
      return res.status(status).json({ message });
    }
  }
};

export const startYoutubeConnect = async (req: Request, res: Response) => {
  console.log("Starting YouTube connect flow",req.user);
  const userId = requireAuthUser(req, res);
  if (!userId) return;
  if (!ensureInfluencer(req)) {
    return res.status(403).json({ message: "Only influencers can connect YouTube" });
  }
  const oauth2Client = buildYoutubeClient();
  const state = buildState(userId);
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: YOUTUBE_SCOPES,
    state,
  });
  return res.status(200).json({ url });
};

export const handleYoutubeCallback = async (req: Request, res: Response) => {
  const { code, state, error } = req.query;
  if (error) {
    return res.status(400).json({ message: "YouTube connection denied" });
  }
  await handleSocialCallback(state as string, res, async (userId) => {
    const oauth2Client = buildYoutubeClient();
    const { tokens } = await oauth2Client.getToken(code as string);
    oauth2Client.setCredentials(tokens);
    const youtube = google.youtube("v3");
    const response = await youtube.channels.list({
      auth: oauth2Client,
      part: ["snippet", "statistics"],
      mine: true,
    });
    const channel = response.data.items?.[0];
    if (!channel) {
      throw { status: 400, message: "Unable to fetch YouTube channel" };
    }
    const stats = {
      followers: Number(channel.statistics?.subscriberCount || 0),
      views: Number(channel.statistics?.viewCount || 0),
      subscribers: Number(channel.statistics?.subscriberCount || 0),
      engagement: Number(channel.statistics?.commentCount || 0),
    };
    const user = await UserModel.findById(userId);
    if (!user) throw { status: 404, message: "User not found" };
    await saveSocialConnection(user, "youtube", {
      accessToken: tokens.access_token ?? undefined,
      refreshToken: tokens.refresh_token ?? undefined,
      expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : undefined,
      metadata: {
        channelId: channel.id,
        channelTitle: channel.snippet?.title,
      },
      stats,
    });
    return res.redirect(`${process.env.FRONTEND_URL}/influencer/profile?connected=youtube`);
  });
};

export const startInstagramConnect = async (req: Request, res: Response) => {
  const userId = requireAuthUser(req, res);
  if (!userId) return;
  if (!ensureInfluencer(req)) {
    return res.status(403).json({ message: "Only influencers can connect Instagram" });
  }
  const state = buildState(userId);
  const url = buildInstagramUrl(state);
  return res.status(200).json({ url });
};

export const handleInstagramCallback = async (req: Request, res: Response) => {
  const { code, state, error } = req.query;
  if (error) {
    return res.status(400).json({ message: "Instagram connection denied" });
  }
  await handleSocialCallback(state as string, res, async (userId) => {
    const shortToken = await exchangeInstagramToken(code as string);
    const accessToken = await exchangeLongLivedInstagramToken(shortToken);
    const { data: accounts } = await axios.get(
      `https://graph.facebook.com/v17.0/me/accounts?access_token=${accessToken}`
    );
    const page = accounts.data?.[0];
    if (!page) {
      throw { status: 400, message: "No connected page found" };
    }
    const igId = page.instagram_business_account?.id;
    if (!igId) {
      throw { status: 400, message: "Instagram account not found" };
    }
    const { data: igProfile } = await axios.get(
      `https://graph.facebook.com/v17.0/${igId}?fields=id,username,followers_count,media_count,profile_picture_url&access_token=${page.access_token}`
    );
    const stats = {
      followers: Number(igProfile.followers_count || 0),
      views: Number(igProfile.media_count || 0),
      engagement: Number(igProfile.media_count || 0),
      subscribers: Number(igProfile.followers_count || 0),
    };
    const user = await UserModel.findById(userId);
    if (!user) throw { status: 404, message: "User not found" };
    await saveSocialConnection(user, "instagram", {
      accessToken: page.access_token,
      metadata: {
        instagramId: igId,
        username: igProfile.username,
        profilePicture: igProfile.profile_picture_url,
        pageId: page.id,
        pageName: page.name,
      },
      stats,
    });
    return res.redirect(`${process.env.FRONTEND_URL}/influencer/profile?connected=instagram`);
  });
};

export const connectSocialAccount = async (req: Request, res: Response) => {
  const userId = requireAuthUser(req, res);
  if (!userId) return;
  if (!ensureInfluencer(req)) {
    return res.status(403).json({ message: "Only influencers can connect social accounts" });
  }
  const { platform, accessToken, refreshToken, expiresIn, metadata, stats } = req.body;
  if (!platform || typeof platform !== "string") {
    return res.status(400).json({ message: "Platform is required" });
  }
  const user = await UserModel.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  await saveSocialConnection(user, platform, {
    accessToken,
    refreshToken,
    expiresAt: expiresIn ? new Date(Date.now() + Number(expiresIn) * 1000) : undefined,
    metadata,
    stats,
  });
  return res.status(200).json({ message: "Social account connected", platform, stats });
};

export const getSocialConnections = async (req: Request, res: Response) => {
  const userId = requireAuthUser(req, res);
  if (!userId) return;
  const user = await UserModel.findById(userId).select("influencerDetails.socialConnections");
  if (!user) return res.status(404).json({ message: "User not found" });
  const connections = user.influencerDetails?.socialConnections || new Map();
  return res.status(200).json({
    connections: Object.fromEntries(connections),
  });
};

export const updateSocialMetrics = async (req: Request, res: Response) => {
  const userId = requireAuthUser(req, res);
  if (!userId) return;
  const { platform, stats } = req.body;
  if (!platform || typeof platform !== "string" || typeof stats !== "object") {
    return res.status(400).json({ message: "Platform and stats are required" });
  }
  const user = await UserModel.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });
  const details = user.influencerDetails || {};
  const connections = new Map(details.socialConnections || []);
  const entry = connections.get(platform);
  if (!entry) {
    return res.status(404).json({ message: "Connection not found" });
  }
  entry.stats = {
    ...entry.stats,
    ...stats,
  };
  entry.lastSynced = new Date();
  connections.set(platform, entry);
  details.socialConnections = connections;
  user.influencerDetails = details;
  user.markModified("influencerDetails.socialConnections");
  await user.save();
  return res.status(200).json({ message: "Stats updated", platform });
};
