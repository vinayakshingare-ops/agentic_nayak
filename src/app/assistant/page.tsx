"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Bot,
  Send,
  User as UserIcon,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Flame,
  Utensils,
  Lightbulb,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { AIMessage } from "@/types";

export default function AssistantPage() {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/assistant");
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (promptToSend?: string) => {
    const text = (promptToSend || inputValue).trim();
    if (!text || isSending) return;

    // Optimistically show user message
    const tempUserMsg: AIMessage = {
      id: `temp-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempUserMsg]);
    setInputValue("");
    setIsSending(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text }),
      });
      const data = await res.json();

      if (data.history) {
        setMessages(data.history);
      } else if (data.message) {
        setMessages((prev) => [...prev, data.message]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  const quickChips = [
    "What should I eat for dinner tonight?",
    "Give me a high-protein snack",
    "I ate too much at lunch, what should I do?",
    "What can I eat before a workout?",
    "How to make my meals cheaper?",
    "Quick 5-minute breakfast ideas",
  ];

  return (
    <div className="min-h-screen bg-warm-50 flex flex-col pb-20 md:pb-12">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 w-full flex-1 flex flex-col">
        {/* Header Title */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-sm">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900">
                  Vitalis Health Assistant
                </h1>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-[11px] text-slate-500">
                Context-aware guidance adapted to your profile, targets, and allergy rules.
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              Safe Health Mode
            </span>
          </div>
        </div>

        {/* Safety Disclaimer Banner */}
        <div className="p-3 rounded-xl bg-slate-100 border border-slate-200/80 mb-4 flex items-center gap-2.5 text-xs text-slate-600">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <p className="text-[11px] leading-relaxed">
            <span className="font-semibold text-slate-800">Safety Notice:</span> Vitalis AI
            provides evidence-informed nutrition and habit suggestions. It does not diagnose
            diseases or prescribe medications. In high-risk medical situations, please consult a
            physician.
          </p>
        </div>

        {/* Chat Messages Log */}
        <div className="flex-1 overflow-y-auto space-y-4 pb-4 min-h-[360px] max-h-[500px] px-1">
          {messages.map((msg) => {
            const isUser = msg.role === "user";

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed shadow-sm whitespace-pre-line ${
                    isUser
                      ? "bg-emerald-600 text-white rounded-tr-none font-medium"
                      : "bg-white border border-slate-200/80 text-slate-800 rounded-tl-none"
                  }`}
                >
                  {msg.content}

                  {/* Suggestion action chips from AI */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                      {msg.suggestions.map((s, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(s)}
                          className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">
                    <UserIcon className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isSending && (
            <div className="flex gap-3 items-center text-xs text-slate-400">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <span>Formulating personalized recommendation...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Question Chips */}
        <div className="py-2 overflow-x-auto -mx-2 px-2">
          <div className="flex items-center gap-1.5 min-w-max">
            <span className="text-[11px] font-bold text-slate-400 mr-1 flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              Ask:
            </span>
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip)}
                className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all shadow-sm"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Message Input Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="mt-2 flex gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask your health assistant (e.g., 'What can I eat instead of paneer?')..."
            className="flex-1 px-4 py-3 text-xs sm:text-sm rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white shadow-sm"
          />
          <Button
            type="submit"
            size="md"
            disabled={!inputValue.trim() || isSending}
            className="bg-emerald-600 hover:bg-emerald-700 px-5 rounded-2xl shadow-sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </main>

      <MobileNav />
      <Footer />
    </div>
  );
}
