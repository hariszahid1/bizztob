"use client";
import { useState } from "react";
import { Bot, Send, Sparkles } from "lucide-react";

type Msg = { role: "user" | "bot"; text: string };

const suggestions = [
  "Show my ledger balance",
  "How many pending orders?",
  "What did I order last week?",
  "Reorder suggestions",
];

export function AssistantView() {
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "bot",
      text: "Hi! I'm your Bizztob assistant. Ask me about your orders, ledger, or reorder ideas.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send(text?: string) {
    const q = (text ?? input).trim();
    if (!q) return;
    setInput("");
    setMsgs((m) => [...m, { role: "user", text: q }]);
    setLoading(true);
    const res = await fetch("/api/retailer/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: q }),
    });
    const data = await res.json();
    setLoading(false);
    setMsgs((m) => [
      ...m,
      { role: "bot", text: data.answer || "I couldn't figure that out." },
    ]);
  }

  return (
    <div className="grid lg:grid-cols-[1fr_260px] gap-6">
      <div className="card flex flex-col h-[70vh]">
        <div className="p-4 border-b border-slate-100 flex items-center gap-2">
          <Bot className="h-5 w-5 text-brand-600" />
          <span className="font-medium">Bizztob Assistant</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {msgs.map((m, i) => (
            <div
              key={i}
              className={`flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-brand-600 text-white rounded-br-sm"
                    : "bg-slate-100 text-slate-800 rounded-bl-sm"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 text-slate-500 text-sm rounded-2xl px-4 py-2 rounded-bl-sm">
                Thinking...
              </div>
            </div>
          )}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="p-3 border-t border-slate-100 flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask something..."
            className="input"
          />
          <button className="btn-primary" disabled={loading}>
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>

      <div className="space-y-3">
        <div className="card p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <Sparkles className="h-4 w-4 text-brand-600" /> Try asking
          </div>
          <div className="mt-3 space-y-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="w-full text-left text-sm rounded-lg border border-slate-200 px-3 py-2 hover:bg-slate-50"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="card p-4 text-xs text-slate-500">
          This demo uses a rules-based assistant on your live data. In
          production, plug in an LLM (OpenAI, Anthropic, etc).
        </div>
      </div>
    </div>
  );
}
