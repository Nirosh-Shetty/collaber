import Message from "../models/Message";
import Conversation from "../models/Conversation";
import UserModel from "../models/Users";
import { AuthenticatedSocket } from "./auth.socket";

export const handleMessaging = (
  io: any,
  socket: any,
  userId: string
) => {
  // Join conversation room
  socket.on(
    "join-conversation",
    async (data: { conversationId: string }, callback?: (arg0: any) => void) => {
      try {
        const { conversationId } = data;

        // Verify user is participant
        const conversation = await Conversation.findById(conversationId);
        if (!conversation || !conversation.participants.includes(userId)) {
          return callback?.({
            success: false,
            message: "Unauthorized",
          });
        }

        // Join socket room for this conversation
        const roomName = `conversation:${conversationId}`;
        socket.join(roomName);

        // Get unread count
        const unreadCount = await Message.countDocuments({
          conversationId,
          senderId: { $ne: userId },
          read: false,
        });

        callback?.({
          success: true,
          roomName,
          unreadCount,
        });
      } catch (error) {
        console.error("Error joining conversation:", error);
        callback?.({
          success: false,
          message: "Internal server error",
        });
      }
    }
  );

  // Leave conversation room
  socket.on("leave-conversation", (data: { conversationId: string }) => {
    const { conversationId } = data;
    const roomName = `conversation:${conversationId}`;
    socket.leave(roomName);
  });

  // Send message
  socket.on(
    "send-message",
    async (
      data: {
        conversationId: string;
        text?: string;
        mediaUrl?: string;
        mediaType?: "image" | "video" | "file";
      },
      callback?: (arg0: any) => void
    ) => {
      try {
        const { conversationId, text, mediaUrl, mediaType } = data;
        console.log("📥 Backend received send-message:", { conversationId, text, userId });

        if (!text && !mediaUrl) {
          return callback?.({
            success: false,
            message: "Message text or media is required",
          });
        }

        // Verify user is participant
        const conversation = await Conversation.findById(conversationId);
        if (!conversation || !conversation.participants.includes(userId)) {
          return callback?.({
            success: false,
            message: "Unauthorized",
          });
        }

        // Create message
        const message = new Message({
          conversationId,
          senderId: userId,
          text: text || null,
          mediaUrl: mediaUrl || null,
          mediaType: mediaType || null,
          read: false,
        });

        await message.save();

        // Update conversation's last message
        conversation.lastMessage = text || `[${mediaType}]`;
        conversation.lastMessageId = (message._id as any).toString();
        conversation.lastMessageAt = new Date();
        await conversation.save();

        // Get sender details
        const sender = await UserModel.findById(userId, {
          name: 1,
          username: 1,
          profilePicture: 1,
        }).lean();

        const messageData = {
          id: (message._id as any).toString(),
          sender,
          senderId: userId,
          text: message.text,
          mediaUrl: message.mediaUrl,
          mediaType: message.mediaType,
          read: false,
          readAt: null,
          createdAt: message.createdAt,
        };

        // Broadcast to conversation room
        const roomName = `conversation:${conversationId}`;
        console.log("📤 Broadcasting to room:", roomName, "with message:", messageData.text);
        io.to(roomName).emit("message-received", messageData);

        callback?.({
          success: true,
          message: messageData,
        });
      } catch (error) {
        console.error("Error sending message:", error);
        callback?.({
          success: false,
          message: "Internal server error",
        });
      }
    }
  );

  // Mark messages as read
  socket.on(
    "mark-as-read",
    async (data: { conversationId: string }, callback?: (arg0: any) => void) => {
      try {
        const { conversationId } = data;

        // Verify user is participant
        const conversation = await Conversation.findById(conversationId);
        if (!conversation || !conversation.participants.includes(userId)) {
          return callback?.({
            success: false,
            message: "Unauthorized",
          });
        }

        // Update messages to read
        const result = await Message.updateMany(
          {
            conversationId,
            senderId: { $ne: userId },
            read: false,
          },
          {
            read: true,
            readAt: new Date(),
          }
        );

        // Broadcast read status to conversation room
        const roomName = `conversation:${conversationId}`;
        io.to(roomName).emit("messages-read", {
          conversationId,
          readBy: userId,
          readAt: new Date(),
        });

        callback?.({
          success: true,
          updatedCount: result.modifiedCount,
        });
      } catch (error) {
        console.error("Error marking messages as read:", error);
        callback?.({
          success: false,
          message: "Internal server error",
        });
      }
    }
  );
};
