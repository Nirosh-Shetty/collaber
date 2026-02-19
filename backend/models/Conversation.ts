import { Schema, model, Document } from "mongoose";

export interface IConversation extends Document {
  participants: string[]; // List of user IDs
  lastMessage?: string;   // Cached last message text
  lastMessageId?: string; // Reference to last message document
  lastMessageAt?: Date;   // Timestamp of last message
  status: "active" | "archived" | "closed";
  updatedAt: Date;
  createdAt: Date;
}

const ConversationSchema = new Schema<IConversation>(
  {
    participants: {
      type: [String],
      required: true,
      validate: (arr: string[]) => arr.length >= 2, // must have two users minimum
    },

    lastMessage: {
      type: String,
      default: "",
    },

    lastMessageId: {
      type: String,
      default: null,
    },

    lastMessageAt: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["active", "archived", "closed"],
      default: "active",
      index: true,
    },
  },
  { timestamps: true }
);

// Index to quickly find conversations between specific users
ConversationSchema.index({ participants: 1 });
// Index for filtering active conversations
ConversationSchema.index({ participants: 1, status: 1 });
// Index for sorting by last message
ConversationSchema.index({ lastMessageAt: -1 });

export default model<IConversation>("Conversation", ConversationSchema);
