"use client";

import { useEffect, useState, useCallback } from "react";
import { messagingAPI } from "./messaging-api";
import { useSocket } from "./socket-context";
import type { Message } from "./use-messaging";

export const useConversationMessages = (conversationId?: string) => {
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const { socket, isConnected } = useSocket();

  const fetchMessages = useCallback(
    async (pageNum: number = 1) => {
      if (!conversationId) return;

      try {
        setIsLoading(true);
        setError(null);
        const data = await messagingAPI.getMessages(conversationId, pageNum, 20);
        setAllMessages(data.messages as any);
        setTotal(data.total);
        setPage(pageNum);
      } catch (err: any) {
        setError(err.message || "Failed to fetch messages");
        console.error("Error fetching messages:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [conversationId]
  );

  // Fetch initial messages when conversation changes
  useEffect(() => {
    if (conversationId) {
      fetchMessages(1);
    } else {
      setAllMessages([]);
    }
  }, [conversationId, fetchMessages]);

  // Listen for real-time messages via socket
  useEffect(() => {
    if (!socket || !isConnected || !conversationId) return;

    // Listen for new messages in this conversation
    const handleMessageReceived = (message: Message) => {
      console.log("📨 Message received:", message);
      setAllMessages((prev) => [...prev, message]);
    };

    // Listen for read status updates
    const handleMessagesRead = (data: any) => {
      console.log("✓ Messages marked as read:", data);
      setAllMessages((prev) =>
        prev.map((msg) =>
          data.readBy.includes(msg.id) ? { ...msg, read: true } : msg
        )
      );
    };

    socket.on("message-received", handleMessageReceived);
    socket.on("messages-read", handleMessagesRead);

    return () => {
      socket.off("message-received", handleMessageReceived);
      socket.off("messages-read", handleMessagesRead);
    };
  }, [socket, isConnected, conversationId]);

  // Mark messages as read
  const markAsRead = useCallback(
    (convId: string) => {
      if (!socket || !isConnected) return;

      socket.emit(
        "mark-as-read",
        { conversationId: convId },
        (response: any) => {
          if (!response.success) {
            console.error("Mark as read failed:", response.message);
          }
        }
      );
    },
    [socket, isConnected]
  );

  const loadMore = useCallback(() => {
    if (page * 20 < total) {
      fetchMessages(page + 1);
    }
  }, [page, total, fetchMessages]);

  return {
    messages: allMessages,
    setMessages: setAllMessages,
    isLoading,
    error,
    page,
    total,
    loadMore,
    markAsRead,
  };
};
