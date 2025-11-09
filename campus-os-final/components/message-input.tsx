"use client";
import { useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function MessageInput({
  onSend,
}: {
  onSend: (text: string) => void;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  return (
    <form
      className="flex items-end gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        const value = ref.current?.value?.trim();
        if (value) {
          onSend(value);
          if (ref.current) ref.current.value = "";
        }
      }}
      aria-label="Send a message"
    >
      <Textarea
        aria-label="Message"
        ref={ref}
        placeholder="Type your message"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            const value = ref.current?.value?.trim();
            if (value) {
              onSend(value);
              if (ref.current) ref.current.value = "";
            }
          }
        }}
      />
      <Button type="submit" aria-label="Send message">
        Send
      </Button>
    </form>
  );
}