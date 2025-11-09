"use client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { MessageList } from "@/components/message-list";
import { MessageInput } from "@/components/message-input";
import { motion } from "framer-motion";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  at: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const sendMessage = useMutation({
    mutationFn: async (text: string) => {
      // simulate a small delay before hitting the mock endpoint
      await new Promise((r) => setTimeout(r, 600));
      const res = await fetch("/api/mock/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      if (!res.ok) throw new Error("Failed to get reply");
      const data = (await res.json()) as { reply: string };
      return data.reply;
    },
    onSuccess: (reply) => {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", content: reply, at: new Date().toISOString() },
      ]);
    },
  });

  const handleSend = (text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", content: text, at: new Date().toISOString() },
    ]);
    sendMessage.mutate(text);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
      <PageHeader
        title="Chat Assistant"
        subtitle="This is a demo. No backend connected yet."
      />
      <div className="space-y-4">
        <MessageList messages={messages} />
        <MessageInput onSend={handleSend} />
      </div>
    </motion.div>
  );
}