import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { ChatInputBar } from "@/components/ChatInputBar";

const ALL_MODELS = [
  "claude-opus-4-6-thinking", "claude-opus-4-6", "gemini-3-pro", "grok-4.1-thinking",
  "gemini-3-flash", "dola-seed-2.0-preview", "claude-opus-4-5-20251101-thinking-32k",
  "claude-opus-4-5-20251101", "grok-4.1", "gemini-3-flash (thinking-minimal)",
  "gpt-5.1-high", "glm-5", "ernie-5.0-0110", "claude-sonnet-4-5-20250929-thinking-32k",
  "claude-sonnet-4-5-20250929", "gemini-2.5-pro", "ernie-5.0-preview-1203",
  "claude-opus-4-1-20250805-thinking-16k", "kimi-k2.5-thinking", "claude-opus-4-1-20250805",
  "gpt-4.5-preview-2025-02-27", "chatgpt-4o-latest-20250326", "glm-4.7", "gpt-5.2-high",
  "gpt-5.2", "kimi-k2.5-instant", "gpt-5.1", "gpt-5-high", "qwen3-max-preview",
  "o3-2025-04-16", "grok-4-1-fast-reasoning", "kimi-k2-thinking-turbo", "gpt-5-chat",
  "glm-4.6", "qwen3-max-2025-09-23", "claude-opus-4-20250514-thinking-16k",
  "deepseek-v3.2-exp-thinking", "deepseek-v3.2-exp", "qwen3-235b-a22b-instruct-2507",
  "grok-4-fast-chat", "deepseek-v3.2-thinking", "deepseek-v3.2", "deepseek-r1-0528",
  "deepseek-v3.1", "deepseek-v3.1-thinking", "deepseek-v3.1-terminus",
  "mistral-large-3", "gpt-4.1-2025-04-14", "claude-opus-4-20250514",
  "gemini-2.5-flash", "claude-sonnet-4-20250514", "claude-3-7-sonnet-20250219",
  "deepseek-r1", "llama-3.3-70b-instruct", "qwen3-235b-a22b",
];

export default function Assistente() {
  const [selectedModel, setSelectedModel] = useState(
    ALL_MODELS[Math.floor(Math.random() * ALL_MODELS.length)]
  );

  return (
    <AppLayout>
      <ChatInputBar
        placeholder={`Converse com ${selectedModel}...`}
        agent="assistente"
        model={selectedModel}
        showModelSelector
        allModels={ALL_MODELS}
        onModelChange={setSelectedModel}
      />
    </AppLayout>
  );
}
