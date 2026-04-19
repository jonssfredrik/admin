"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { generateResponse } from "@/modules/chatbot/data/context";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}

interface ChatbotContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  conversations: Conversation[];
  activeConversation: Conversation | null;
  startNewConversation: () => void;
  switchConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  clearAllConversations: () => void;
  messages: ChatMessage[];
  sendMessage: (text: string) => void;
  isTyping: boolean;
  activeModules: string[];
  toggleModule: (id: string) => void;
}

const ALL_MODULE_IDS = ["jetwp", "snaptld", "billing", "file-converter"];
const CONVERSATIONS_KEY = "chatbot.conversations";
const ACTIVE_ID_KEY = "chatbot.activeConversationId";
const MODULES_KEY = "chatbot.activeModules";
const LEGACY_KEY = "chatbot.messages";

function readConversations(): Conversation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CONVERSATIONS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    }
    // Migrate from legacy flat-message format
    const legacy = window.localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      const msgs: ChatMessage[] = JSON.parse(legacy);
      if (Array.isArray(msgs) && msgs.length > 0) {
        const firstUser = msgs.find((m) => m.role === "user");
        const conv: Conversation = {
          id: `conv-legacy`,
          title: firstUser ? firstUser.content.slice(0, 50) : "Importerad konversation",
          createdAt: msgs[0].timestamp,
          updatedAt: msgs[msgs.length - 1].timestamp,
          messages: msgs,
        };
        window.localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify([conv]));
        window.localStorage.removeItem(LEGACY_KEY);
        return [conv];
      }
    }
    return [];
  } catch {
    return [];
  }
}

function readActiveId(conversations: Conversation[]): string | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(ACTIVE_ID_KEY);
    if (stored && conversations.some((c) => c.id === stored)) return stored;
    return conversations[0]?.id ?? null;
  } catch {
    return null;
  }
}

function readModules(): string[] {
  if (typeof window === "undefined") return ALL_MODULE_IDS;
  try {
    const raw = window.localStorage.getItem(MODULES_KEY);
    if (!raw) return ALL_MODULE_IDS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : ALL_MODULE_IDS;
  } catch {
    return ALL_MODULE_IDS;
  }
}

const ChatbotContext = createContext<ChatbotContextValue | null>(null);

export function ChatbotProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [activeModules, setActiveModules] = useState<string[]>(ALL_MODULE_IDS);

  const activeConversationIdRef = useRef<string | null>(null);
  const activeModulesRef = useRef(activeModules);

  useEffect(() => {
    activeModulesRef.current = activeModules;
  }, [activeModules]);

  useEffect(() => {
    const convs = readConversations();
    const activeId = readActiveId(convs);
    setConversations(convs);
    setActiveConversationId(activeId);
    activeConversationIdRef.current = activeId;
    setActiveModules(readModules());
  }, []);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  const startNewConversation = useCallback(() => {
    activeConversationIdRef.current = null;
    setActiveConversationId(null);
    window.localStorage.removeItem(ACTIVE_ID_KEY);
  }, []);

  const switchConversation = useCallback((id: string) => {
    activeConversationIdRef.current = id;
    setActiveConversationId(id);
    window.localStorage.setItem(ACTIVE_ID_KEY, id);
  }, []);

  const deleteConversation = useCallback((id: string) => {
    setConversations((prev) => {
      const next = prev.filter((c) => c.id !== id);
      window.localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(next));

      if (activeConversationIdRef.current === id) {
        const nextActive = next[0]?.id ?? null;
        activeConversationIdRef.current = nextActive;
        setActiveConversationId(nextActive);
        if (nextActive) {
          window.localStorage.setItem(ACTIVE_ID_KEY, nextActive);
        } else {
          window.localStorage.removeItem(ACTIVE_ID_KEY);
        }
      }

      return next;
    });
  }, []);

  const clearAllConversations = useCallback(() => {
    setConversations([]);
    activeConversationIdRef.current = null;
    setActiveConversationId(null);
    window.localStorage.removeItem(CONVERSATIONS_KEY);
    window.localStorage.removeItem(ACTIVE_ID_KEY);
  }, []);

  const sendMessage = useCallback((text: string) => {
    const now = new Date().toISOString();
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: now,
    };

    // Determine target conversation ID synchronously
    let targetId = activeConversationIdRef.current;
    const isNew = !targetId;
    if (!targetId) {
      targetId = `conv-${Date.now()}`;
      activeConversationIdRef.current = targetId;
    }
    const finalTargetId = targetId;

    setConversations((prev) => {
      let convs: Conversation[];
      if (isNew || !prev.some((c) => c.id === finalTargetId)) {
        const title = text.length > 50 ? text.slice(0, 47) + "…" : text;
        const newConv: Conversation = {
          id: finalTargetId,
          title,
          createdAt: now,
          updatedAt: now,
          messages: [userMsg],
        };
        convs = [newConv, ...prev];
      } else {
        convs = prev.map((c) =>
          c.id === finalTargetId
            ? { ...c, updatedAt: now, messages: [...c.messages, userMsg] }
            : c,
        );
      }
      window.localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(convs));
      return convs;
    });

    setActiveConversationId(finalTargetId);
    window.localStorage.setItem(ACTIVE_ID_KEY, finalTargetId);
    setIsTyping(true);

    const delay = 600 + Math.random() * 800;
    setTimeout(() => {
      const response = generateResponse(text, activeModulesRef.current);
      const botMsg: ChatMessage = {
        id: `msg-${Date.now()}-bot`,
        role: "assistant",
        content: response,
        timestamp: new Date().toISOString(),
      };

      setIsTyping(false);
      setConversations((prev) => {
        const convs = prev.map((c) =>
          c.id === finalTargetId
            ? { ...c, updatedAt: botMsg.timestamp, messages: [...c.messages, botMsg] }
            : c,
        );
        window.localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(convs));
        return convs;
      });
    }, delay);
  }, []);

  const toggleModule = useCallback((id: string) => {
    setActiveModules((prev) => {
      const next = prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id];
      window.localStorage.setItem(MODULES_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const activeConversation = conversations.find((c) => c.id === activeConversationId) ?? null;
  const messages = activeConversation?.messages ?? [];

  return (
    <ChatbotContext.Provider
      value={{
        isOpen,
        open,
        close,
        toggle,
        conversations,
        activeConversation,
        startNewConversation,
        switchConversation,
        deleteConversation,
        clearAllConversations,
        messages,
        sendMessage,
        isTyping,
        activeModules,
        toggleModule,
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
}

export function useChatbot() {
  const ctx = useContext(ChatbotContext);
  if (!ctx) throw new Error("useChatbot must be used within ChatbotProvider");
  return ctx;
}
