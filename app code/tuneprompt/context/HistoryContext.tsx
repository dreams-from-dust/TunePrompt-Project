import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

export type PromptCategory = "video" | "seo";

export interface HistoryItem {
  id: string;
  category: PromptCategory;
  tool: string;
  toolId: string;
  userInput: string;
  prompts: string[];
  selectedPrompt: string;
  tips: string[];
  createdAt: string;
  isFavorited: boolean;
}

interface HistoryContextValue {
  history: HistoryItem[];
  addToHistory: (item: Omit<HistoryItem, "id" | "createdAt" | "isFavorited">) => Promise<string>;
  removeFromHistory: (id: string) => Promise<void>;
  clearHistory: () => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  isLoading: boolean;
}

const HistoryContext = createContext<HistoryContextValue | null>(null);
const STORAGE_KEY = "tuneprompt_history_v2";

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (stored) setHistory(JSON.parse(stored));
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const save = async (items: HistoryItem[]) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  };

  const addToHistory = useCallback(
    async (item: Omit<HistoryItem, "id" | "createdAt" | "isFavorited">): Promise<string> => {
      const newItem: HistoryItem = {
        ...item,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        isFavorited: false,
      };
      const updated = [newItem, ...history].slice(0, 200);
      setHistory(updated);
      await save(updated);
      return newItem.id;
    },
    [history]
  );

  const removeFromHistory = useCallback(
    async (id: string) => {
      const updated = history.filter((i) => i.id !== id);
      setHistory(updated);
      await save(updated);
    },
    [history]
  );

  const clearHistory = useCallback(async () => {
    setHistory([]);
    await AsyncStorage.removeItem(STORAGE_KEY);
  }, []);

  const toggleFavorite = useCallback(
    async (id: string) => {
      const updated = history.map((i) =>
        i.id === id ? { ...i, isFavorited: !i.isFavorited } : i
      );
      setHistory(updated);
      await save(updated);
    },
    [history]
  );

  return (
    <HistoryContext.Provider
      value={{ history, addToHistory, removeFromHistory, clearHistory, toggleFavorite, isLoading }}
    >
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  const ctx = useContext(HistoryContext);
  if (!ctx) throw new Error("useHistory must be used within HistoryProvider");
  return ctx;
}
