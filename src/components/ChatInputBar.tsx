import { ArrowUp } from "lucide-react";

interface ChatInputBarProps {
  placeholder?: string;
}

export function ChatInputBar({ placeholder = "Selecione um agente para começar a conversar..." }: ChatInputBarProps) {
  return (
    <div className="border-t border-border p-4">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center gap-3 rounded-xl bg-chat-input px-4 py-3">
          <input
            type="text"
            placeholder={placeholder}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-chat-input-foreground outline-none"
          />
          <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-hover text-muted-foreground hover:text-foreground transition-colors">
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
