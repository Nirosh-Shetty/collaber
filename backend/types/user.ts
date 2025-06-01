import { Types, Document } from "mongoose";
export interface LoginMetadata {
  ip: string;
  userAgent?: string; // Optional because some requests may not send it
  time: Date;
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  username: string;
  email: string;
  phone: number;
  password: string;
  role: "influencer" | "brand" | "manager";
  profilePicture?: string;
  // isGoogleLinked?: boolean;
  // isFacebookLinked?: boolean;
  rating: number;
  totalReviews: number;
  linkedAccounts?: string[]; // ["google", "facebook", "local"]
  // authProvider: "local" | "google" | "facebook";
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
  otp?: string;
  lastOtpSentAt?: Date;
  loginHistory: LoginMetadata[];
}
