"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { MessagesHub, type RoleVariant } from "./messages-hub";
import { useConversations, useMessaging, useConversationMessages, useSocket } from "@/lib/socket";
import { messagingAPI } from "@/lib/socket/messaging-api";

interface MessagesHubProviderProps {
  role: RoleVariant;
  heading: string;
  subheading: string;
  composerPlaceholder: string;
}

export function MessagesHubProvider({
  role,
  heading,
  subheading,
  composerPlaceholder,
}: MessagesHubProviderProps) {
  const { conversations, isLoading: conversationsLoading, fetchConversations } = useConversations();
  const { isConnected, userId } = useSocket();
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(conversations[0]?.id || null);

  const {
    messages,
    isLoading: messagesLoading,
    markAsRead,
  } = useConversationMessages(selectedConversationId || undefined);

  const { sendMessage, joinConversation, leaveConversation } = useMessaging();

  // Add console logs for debugging
  useEffect(() => {
    console.log("📌 Selected conversation:", selectedConversationId);
    console.log("💬 Messages:", messages.length);
  }, [selectedConversationId, messages]);

  // Join conversation when selected
  useEffect(() => {
    if (selectedConversationId && isConnected) {
      joinConversation(selectedConversationId);
      markAsRead(selectedConversationId);
      return () => {
        leaveConversation(selectedConversationId);
      };
    }
  }, [selectedConversationId, isConnected, joinConversation, leaveConversation, markAsRead]);

  // Handle creating new conversation with a user
  const handleCreateConversation = useCallback(
    async (otherUserId: string) => {
      try {
        const response = await messagingAPI.getOrCreateConversation(otherUserId);
        const newConversation = response.conversation;

        // Refetch conversations to update list
        await fetchConversations();

        // Select the new conversation
        setSelectedConversationId(newConversation.id);
      } catch (error) {
        console.error("Failed to create conversation:", error);
        throw error;
      }
    },
    [fetchConversations]
  );

  // Transform messages to match HubMessage format
  const messagesByConversation = {
    [selectedConversationId || ""]: messages.map((msg) => ({
      id: msg.id,
      sender: msg.senderId === userId ? ("me" as const) : ("other" as const),
      text: msg.text || "",
      timestamp: new Date(msg.createdAt).toLocaleTimeString(),
      read: msg.read,
    })),
  };

  // Transform conversations to match HubConversation format
  const transformedConversations = conversations.map((conv) => ({
    id: conv.id,
    name: conv.otherUser?.name || "Unknown",
    context: conv.otherUser?.role || "",
    avatar: conv.otherUser?.profilePicture?.substring(0, 2).toUpperCase() || "??",
    lastMessage: conv.lastMessage,
    lastMessageAt: conv.lastMessageAt
      ? new Date(conv.lastMessageAt).toLocaleString()
      : "Now",
    unreadCount: conv.unreadCount,
    status: conv.status as "active" | "pending" | "closed",
    online: false, // TODO: Add presence tracking
  }));

  if (conversationsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading conversations...</p>
      </div>
    );
  }

  return (
    <MessagesHub
      role={role}
      heading={heading}
      subheading={subheading}
      composerPlaceholder={composerPlaceholder}
      conversations={transformedConversations}
      messagesByConversation={messagesByConversation}
      selectedConversationId={selectedConversationId}
      onSelectConversation={setSelectedConversationId}
      onSendMessage={(text) => {
        if (selectedConversationId) {
          console.log("📨 Provider sending message via socket:", text, "to:", selectedConversationId);
          sendMessage(selectedConversationId, text);
        } else {
          console.warn("⚠️ No conversation selected");
        }
      }}
      onCreateConversation={handleCreateConversation}
      isLoading={messagesLoading}
    />
  );
}
