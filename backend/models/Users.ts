import mongoose, { Schema, model, Types, Document } from "mongoose";
import { IUser } from "../types/user";

const LoginMetadataSchema = new Schema(
  {
    ip: { type: String, required: true },
    userAgent: { type: String },
    time: { type: Date, required: true, default: Date.now },
  },
  { _id: false } // Prevents MongoDB from creating _id for each subdocument
);
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
    phone: {
      type: Number,
      unique: true,
      sparse: true, // Allows multiple null values
      match: [/^\d{10}$/, "Phone number must be 10 digits"],
    },
    password: {
      type: String,
      select: false,
      // required: [true, "Password is required"],
    },
    authProvider: {
      type: String,
      enum: ["local", "google", "facebook"],
    },
    googleId: String,
    facebookId: String,
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
    isVerified: { type: Boolean, default: false },
    reservationExpiresAt: { type: Date, default: null },
    isTempAccount: { type: Boolean, default: false },
    otp: {
      type: String,
      min: 100000,
      max: 999999,
    },
    lastOtpSentAt: Date,

    //   managerDetails: {
    //     managedInfluencers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    //   },
    loginHistory: [LoginMetadataSchema], // array of login metadata
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

const UserModel =
  (mongoose.models.User as mongoose.Model<IUser>) ||
  mongoose.model<IUser>("User", UserSchema);

export default UserModel;
