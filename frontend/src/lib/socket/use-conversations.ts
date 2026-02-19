"use client";

import { useEffect, useState, useCallback } from "react";
import { messagingAPI } from "./messaging-api";
import type { Conversation } from "./use-messaging";

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchConversations = useCallback(
    async (pageNum: number = 1, status: "active" | "archived" | "closed" = "active") => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await messagingAPI.getConversations(pageNum, 20, status);
        setConversations(data.conversations as any);
        setTotal(data.total);
        setPage(pageNum);
      } catch (err: any) {
        setError(err.message || "Failed to fetch conversations");
        console.error("Error fetching conversations:", err);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const loadMore = useCallback(() => {
    if (page * 20 < total) {
      fetchConversations(page + 1);
    }
  }, [page, total, fetchConversations]);

  return {
    conversations,
    setConversations,
    isLoading,
    error,
    page,
    total,
    fetchConversations,
    loadMore,
  };
};
