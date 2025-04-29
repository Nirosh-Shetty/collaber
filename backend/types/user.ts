import { Types, Document } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  username: string;
  email: string;
  password: string;
  role: "influencer" | "brand" | "manager";
  profilePicture?: string;
  rating: number;
  totalReviews: number;
  authProvider: "local" | "google" | "facebook";
  googleId?: string;
  facebookId?: string;
  influencerDetails?: {
    followers: number;
    niche: string;
    socialLinks: Map<string, string>;
    collaborations: Types.ObjectId[];
  };
  brandDetails?: {
    companyName: string;
    website: string;
    brandCategory: string;
    collaborations: Types.ObjectId[];
  };
  isVerified: boolean;
  reservationExpiresAt?: Date; 
  isTempAccount?: boolean;   
}
