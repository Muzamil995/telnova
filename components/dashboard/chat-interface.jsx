"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "@/components/landing/Icon";
import { C, HL, BD, SHADOW } from "@/components/landing/tokens";
import { supportAPI, APIError } from "@/lib/api";

function formatTime(date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, "0");
  return `${displayHours}:${displayMinutes} ${ampm}`;
}

function formatMessageContent(content) {
  return String(content || "")
    .replace(/\s(\d+\.)\s/g, "\n$1 ")
    .replace(/\s([-*])\s/g, "\n$1 ")
    .trim();
}

function shouldCreateTicket(userMessage, lastAiMessage) {
  const ticketRequestKeywords = [
    "create ticket",
    "create a ticket",
    "need assistance",
    "need help",
    "call from representative",
    "representative",
    "human support",
    "talk to someone",
    "speak to someone",
    "speak with someone",
    "talk to an agent",
    "speak to an agent",
    "live chat",
    "live support",
  ];

  const unsolvedKeywords = [
    "still not working",
    "still down",
    "still broken",
    "still disconnected",
    "doesnt work",
    "still doesn't work",
    "not fixed",
    "not resolved",
    "still having",
    "problem persists",
    "issue continues",
    "nothing worked",
  ];

  const userLower = userMessage.toLowerCase();

  for (const keyword of ticketRequestKeywords) {
    if (userLower.includes(keyword)) {
      return true;
    }
  }

  for (const keyword of unsolvedKeywords) {
    if (userLower.includes(keyword)) {
      return true;
    }
  }

  const aiLower = lastAiMessage?.toLowerCase() || "";
  if (
    aiLower.includes("create a ticket") ||
    aiLower.includes("open a ticket") ||
    aiLower.includes("escalate") ||
    aiLower.includes("contact our support team")
  ) {
    if (
      userLower.includes("yes") ||
      userLower.includes("okay") ||
      userLower.includes("ok")
    ) {
      return true;
    }
  }

  return false;
}

const mockMessages = [
  {
    id: 1,
    role: "assistant",
    content: "Hello! I'm your AI support agent. How can I help you today?",
    timestamp: new Date("2026-02-20T10:00:00"),
  },
];

export function ChatInterface() {
  const [messages, setMessages] = useState(mockMessages);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  const [isChatClosed, setIsChatClosed] = useState(false);
  const messagesContainerRef = useRef(null);

  function scrollToBottom() {
    const container = messagesContainerRef.current;
    if (!container) return;
    container.scrollTop = container.scrollHeight;
  }

  useEffect(() => {
    if (!messagesContainerRef.current) {
      return;
    }

    scrollToBottom();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  async function handleCreateTicket() {
    if (isCreatingTicket || isChatClosed) return;

    setIsCreatingTicket(true);

    try {
      const response = await supportAPI.createTicket({
        conversationHistory: messages
          .filter((msg) => msg.id !== 1)
          .map((msg) => ({
            role: msg.role,
            content: msg.content,
            timestamp: msg.timestamp,
          })),
      });

      const ticketMessage = {
        id: Date.now(),
        role: "assistant",
        content: `Your support ticket ${response.ticket.ticketNumber} has been created. Our representative will contact you shortly.`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, ticketMessage]);
      setIsChatClosed(true);
    } catch (error) {
      const errorMessage =
        error instanceof APIError
          ? error.message
          : "Failed to create ticket. Please try again.";

      const errorMsg = {
        id: Date.now(),
        role: "assistant",
        content: errorMessage,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsCreatingTicket(false);
    }
  }

  async function handleSend(e) {
    e.preventDefault();
    if (!input.trim() || isSending || isChatClosed) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    const nextMessages = [...messages, userMessage];
    const lastAiMessage = messages.find(
      (msg, idx) => msg.role === "assistant" && idx === messages.length - 1,
    )?.content;

    setMessages(nextMessages);
    setInput("");

    if (shouldCreateTicket(userMessage.content, lastAiMessage)) {
      setIsCreatingTicket(true);

      try {
        const response = await supportAPI.createTicket({
          conversationHistory: nextMessages
            .filter((msg) => msg.id !== 1)
            .map((msg) => ({
              role: msg.role,
              content: msg.content,
              timestamp: msg.timestamp,
            })),
        });

        const ticketMessage = {
          id: Date.now(),
          role: "assistant",
          content: `Your support ticket ${response.ticket.ticketNumber} has been created. Our representative will contact you shortly.`,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, ticketMessage]);
        setIsChatClosed(true);
      } catch (error) {
        const errorMessage =
          error instanceof APIError
            ? error.message
            : "Failed to create ticket. Please try again.";

        const errorMsg = {
          id: Date.now(),
          role: "assistant",
          content: errorMessage,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsCreatingTicket(false);
      }
      return;
    }

    setIsSending(true);

    try {
      const response = await supportAPI.chat({
        messages: nextMessages.map((message) => ({
          role: message.role,
          content: message.content,
        })),
      });

      const aiMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: response.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);

      // Play notification sound
      const audio = new Audio("/noti.mp3");
      audio.play().catch((err) => console.log("Audio play failed:", err));
    } catch (error) {
      const fallbackMessage =
        error instanceof APIError
          ? error.message
          : "Unable to reach support right now. Please try again.";

      const aiMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: fallbackMessage,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);

      // Play notification sound
      const audio = new Audio("/noti.mp3");
      audio.play().catch((err) => console.log("Audio play failed:", err));
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div
      className="flex flex-col overflow-hidden rounded-2xl"
      style={{
        height: "600px",
        minHeight: "600px",
        backgroundColor: C.surfaceLowest,
        border: `1px solid ${C.outlineVariant}33`,
        ...SHADOW,
      }}
    >
      {/* Header */}
      <div
        className="px-6 py-4 flex items-center justify-between shrink-0"
        style={{ backgroundColor: C.primaryContainer }}
      >
        <div>
          <h2
            className="text-base font-extrabold text-white tracking-tight"
            style={HL}
          >
            Telnova Support
          </h2>
          <p
            className="text-xs mt-0.5"
            style={{ color: C.primaryFixedDim, ...BD }}
          >
            Get help with your services
          </p>
        </div>
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold"
          style={{
            backgroundColor: `${C.primaryFixed}18`,
            color: C.secondaryFixedDim,
            ...BD,
          }}
        >
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Online
        </div>
      </div>

      {/* Messages */}
      <div className="relative min-h-0 flex-1">
        <div
          ref={messagesContainerRef}
          className="h-full overflow-y-auto p-6 space-y-4 scroll-smooth"
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className="max-w-[80%] rounded-2xl px-4 py-3"
                style={
                  message.role === "user"
                    ? {
                        backgroundColor: C.surfaceHigh,
                        color: C.onSurface,
                      }
                    : {
                        backgroundColor: C.primaryContainer,
                        color: "#ffffff",
                      }
                }
              >
                <p
                  className="text-sm whitespace-pre-wrap leading-relaxed"
                  style={{ ...BD }}
                >
                  {formatMessageContent(message.content)}
                </p>
                <p
                  className="mt-1 text-xs"
                  style={{
                    color:
                      message.role === "user"
                        ? C.onSurfaceVariant
                        : `${C.primaryFixedDim}99`,
                  }}
                >
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}

          {(isSending || isCreatingTicket) && (
            <div className="flex justify-start">
              <div
                className="max-w-[80%] rounded-2xl px-4 py-3"
                style={{ backgroundColor: C.primaryContainer }}
              >
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-white opacity-70" />
                  <span
                    className="h-2 w-2 animate-pulse rounded-full bg-white opacity-70"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="h-2 w-2 animate-pulse rounded-full bg-white opacity-70"
                    style={{ animationDelay: "300ms" }}
                  />
                  <span
                    className="ml-1 text-xs"
                    style={{ color: C.primaryFixedDim, ...BD }}
                  >
                    {isCreatingTicket
                      ? "Creating ticket..."
                      : "Generating response..."}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div
        className="shrink-0 p-4"
        style={{ borderTop: `1px solid ${C.outlineVariant}33` }}
      >
        {!isChatClosed ? (
          <form onSubmit={handleSend}>
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={isSending || isCreatingTicket}
                className="flex-1 px-4 py-3 rounded-xl text-sm outline-none transition-all disabled:opacity-50"
                style={{
                  border: `1.5px solid ${C.outlineVariant}`,
                  backgroundColor: C.surface,
                  color: C.onSurface,
                  ...BD,
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "var(--brand-violet)";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px rgba(0,81,213,0.10)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = C.outlineVariant;
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
              <button
                type="submit"
                disabled={isSending || !input.trim() || isCreatingTicket}
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-opacity disabled:opacity-40 hover:opacity-90"
                style={{ backgroundColor: C.primary, color: "#ffffff", ...BD }}
              >
                <Icon name="send" size={16} />
                {isSending ? "Sending..." : "Send"}
              </button>
            </div>
          </form>
        ) : (
          <p
            className="text-center text-sm py-2"
            style={{ color: C.onSurfaceVariant, ...BD }}
          >
            Chat closed. Refresh to start a new conversation.
          </p>
        )}
      </div>
    </div>
  );
}
