"use client";
import { motion } from "framer-motion";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  at: string; // ISO
};

export function MessageList({ messages }: { messages: Message[] }) {
  return (
    <div className="space-y-3">
      {messages.map((m, i) => (
        <motion.div
          key={m.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, delay: i * 0.03 }}
          className={
            m.role === "user"
              ? "flex justify-end"
              : "flex justify-start"
          }
        >
          <div
            className={
              m.role === "user"
                ? "max-w-[80%] rounded-2xl bg-blue-600 px-3 py-2 text-white shadow-md"
                : "max-w-[80%] rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 shadow-md"
            }
          >
            <p className="text-sm leading-relaxed">{m.content}</p>
            <p className="mt-1 text-[11px] text-neutral-500">
              {new Date(m.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}