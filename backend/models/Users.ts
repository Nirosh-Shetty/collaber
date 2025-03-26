import mongoose, { Schema, model, Types, Document } from "mongoose";

// Interface for a User
export interface IUser extends Document {
  name: string;
  username: string;
  email: string;
  password: string;
  role: "influencer" | "brand" | "manager";
  profilePicture?: string;
  rating: number;
  totalReviews: number;
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
  //   managerDetails?: {
  //     managedInfluencers: Types.ObjectId[];
  //   };
}

// Mongoose Schema
const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/.+\@.+\..+/, "Enter a valid email"],
    },
    username: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "Username is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      enum: ["influencer", "brand", "manager"],
      required: true,
    },
    profilePicture: { type: String, default: "" },
    rating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },

    influencerDetails: {
      type: {
        followers: { type: Number, default: 0 },
        niche: { type: String },
        socialLinks: { type: Map, of: String },
        collaborations: [{ type: Schema.Types.ObjectId, ref: "Collaboration" }],
      },
      required: false,
    },

    brandDetails: {
      type: {
        companyName: { type: String },
        website: { type: String },
        brandCategory: { type: String },
        collaborations: [{ type: Schema.Types.ObjectId, ref: "Collaboration" }],
      },
      required: false,
    },

    //   managerDetails: {
    //     managedInfluencers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    //   },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Indexes for fast lookup
UserSchema.index({ username: 1 });
UserSchema.index({ email: 1 });

const UserModel =
  (mongoose.models.User as mongoose.Model<IUser>) ||
  mongoose.model<IUser>("User", UserSchema);

export default UserModel;
