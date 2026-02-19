"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, X, Loader2 } from "lucide-react";
import { messagingAPI } from "@/lib/socket/messaging-api";

interface SearchResult {
  id: string;
  name: string;
  username: string;
  profilePicture?: string;
  role: string;
}

interface SearchPeopleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUser: (user: SearchResult) => void;
  isLoading?: boolean;
}

export function SearchPeopleDialog({
  isOpen,
  onClose,
  onSelectUser,
  isLoading = false,
}: SearchPeopleDialogProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchUsers = async () => {
      try {
        setSearching(true);
        setError(null);
        const data = await messagingAPI.search(query, "users");
        setResults(
          (data.users || []).map((user: any) => ({
            id: user._id || user.id,
            name: user.name,
            username: user.username,
            profilePicture: user.profilePicture,
            role: user.role,
          }))
        );
      } catch (err: any) {
        setError(err.message || "Failed to search users");
        console.error("Search error:", err);
      } finally {
        setSearching(false);
      }
    };

    const timer = setTimeout(searchUsers, 300); // Debounce
    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/50 sm:items-center">
      <Card className="w-full border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900 sm:max-w-md">
        <div className="space-y-4 p-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Find People
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search by name or username..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border-slate-300 bg-white pl-10 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              autoFocus
            />
          </div>

          {/* Results */}
          <div className="max-h-96 space-y-2 overflow-y-auto">
            {searching && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-slate-500" />
              </div>
            )}

            {error && !searching && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-400">
                {error}
              </div>
            )}

            {!query.trim() && !searching && (
              <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                Start typing to find people...
              </div>
            )}

            {results.length === 0 && query.trim() && !searching && !error && (
              <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                No people found
              </div>
            )}

            {results.map((user) => (
              <button
                key={user.id}
                onClick={() => {
                  onSelectUser(user);
                  setQuery("");
                }}
                disabled={isLoading}
                className="w-full rounded-lg border border-slate-200 bg-white p-3 text-left transition-colors hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
              >
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 text-sm font-semibold text-white">
                    {(user.profilePicture?.substring(0, 2) || user.name?.substring(0, 2) || "?").toUpperCase()}
                  </div>

                  {/* User Info */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                      @{user.username}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      {user.role}
                    </p>
                  </div>

                  {/* Badge */}
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="inline-block rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      Start
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
