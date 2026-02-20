"use client";

import { useCallback, useEffect, useState } from "react";
import { useSocket } from "./socket-context";

export interface Message {
  id: string;
  sender?: {
    name: string;
    username: string;
    profilePicture: string;
  };
  senderId: string;
  text?: string;
  mediaUrl?: string;
  mediaType?: "image" | "video" | "file";
  read: boolean;
  readAt?: Date;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageAt?: Date;
  status: "active" | "archived" | "closed";
  unreadCount: number;
  otherUser?: {
    name: string;
    username: string;
    profilePicture: string;
    role: string;
  };
}

export const useMessaging = () => {
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log("🎣 useMessaging hook called - socket state:", {
    socketExists: !!socket,
    isConnected,
    socketId: socket?.id,
  });

  // Join conversation room
  const joinConversation = useCallback(
    (conversationId: string) => {
      if (!socket || !isConnected) {
        console.warn("Socket not connected");
        return;
      }

      setIsLoading(true);
      socket.emit(
        "join-conversation",
        { conversationId },
        (response: any) => {
          if (response.success) {
            console.log("✅ Joined conversation:", conversationId);
            setIsLoading(false);
          } else {
            setError(response.message);
            setIsLoading(false);
          }
        }
      );
    },
    [socket, isConnected]
  );

  // Leave conversation room
  const leaveConversation = useCallback(
    (conversationId: string) => {
      if (!socket) return;
      socket.emit("leave-conversation", { conversationId });
    },
    [socket]
  );

  // Send message
  const sendMessage = useCallback(
    (
      conversationId: string,
      text?: string,
      mediaUrl?: string,
      mediaType?: "image" | "video" | "file"
    ) => {
      console.log("🔷 useMessaging.sendMessage called:", { conversationId, text, socket: !!socket, isConnected });

      if (!socket) {
        console.error("❌ Socket is null");
        setError("Socket not initialized");
        return;
      }

      if (!isConnected) {
        console.error("❌ Socket not connected", { isConnected });
        setError("Socket not connected");
        return;
      }

      console.log("✅ Socket connected, emitting send-message event");
      socket.emit(
        "send-message",
        { conversationId, text, mediaUrl, mediaType },
        (response: any) => {
          console.log("📬 send-message callback response:", response);
          if (!response.success) {
            console.error("❌ Message send failed:", response.message);
            setError(response.message);
          } else {
            console.log("✅ Message sent successfully");
          }
        }
      );
    },
    [socket, isConnected]
  );

  // Mark messages as read
  const markAsRead = useCallback(
    (conversationId: string) => {
      if (!socket || !isConnected) return;

      socket.emit(
        "mark-as-read",
        { conversationId },
        (response: any) => {
          if (!response.success) {
            console.error("Mark as read failed:", response.message);
          }
        }
      );
    },
    [socket, isConnected]
  );

  // Listen for incoming messages - but don't store them here
  // They will be received by the conversation-specific listeners
  useEffect(() => {
    if (!socket) return;

    // Just listen for errors or status updates
    socket.on("error", (error: any) => {
      console.error("Socket error:", error);
      setError(error.message);
    });

    return () => {
      socket.off("error");
    };
  }, [socket]);

  return {
    messages,
    setMessages,
    isLoading,
    error,
    joinConversation,
    leaveConversation,
    sendMessage,
    markAsRead,
  };
};
