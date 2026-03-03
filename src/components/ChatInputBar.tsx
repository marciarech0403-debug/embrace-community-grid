import { useState, useRef, useEffect } from "react";
import { Globe, Image as ImageIcon, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { ClaudeChatInput, type ModelOption } from "@/components/ui/claude-style-ai-input";

interface Message {
  role: "user" | "assistant";
  content: string;
}

type TabType = "resposta" | "links" | "imagens";

interface ChatInputBarProps {
  placeholder?: string;
  agent?: string;
  model?: string;
  showModelSelector?: boolean;
  allModels?: string[];
  onModelChange?: (model: string) => void;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

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
  "gpt-5", "gpt-5-mini", "gpt-5-nano", "gpt-4.1-mini-2025-04-14", "gpt-4.1-nano-2025-04-14",
  "gpt-4o-2024-11-20", "gpt-4o-mini-2024-07-18", "o4-mini-2025-04-16",
  "claude-3-5-sonnet-20241022", "claude-3-5-haiku-20241022", "claude-3-opus-20240229",
  "gemini-2.0-flash", "gemini-2.0-flash-lite", "gemini-1.5-pro", "gemini-1.5-flash",
  "deepseek-v3", "deepseek-r1-distill-llama-70b", "deepseek-r1-distill-qwen-32b",
  "llama-4-scout-17b-16e-instruct", "llama-4-maverick-17b-128e-instruct",
  "llama-3.1-405b-instruct", "llama-3.1-70b-instruct", "llama-3.1-8b-instruct",
  "mistral-medium-3", "mistral-small-3.1", "codestral-2501",
  "qwen3-30b-a3b", "qwen3-32b", "qwen3-14b", "qwen3-8b", "qwen3-4b",
  "qwen2.5-72b-instruct", "qwen2.5-coder-32b-instruct",
  "command-r-plus-08-2024", "command-r-08-2024", "command-a-03-2025",
  "jamba-1.5-large", "jamba-1.5-mini",
  "phi-4", "phi-4-mini", "phi-3.5-moe-instruct",
  "gemma-2-27b-it", "gemma-2-9b-it", "gemma-3-27b-it",
  "dbrx-instruct", "mixtral-8x22b-instruct-v0.1", "mixtral-8x7b-instruct-v0.1",
  "nous-hermes-2-mixtral-8x7b-dpo", "yi-large", "yi-1.5-34b-chat",
  "internlm2.5-20b-chat", "baichuan4", "glm-4-plus", "glm-4-air",
  "ernie-4.0-turbo-8k", "ernie-3.5-8k", "spark-4.0-ultra",
  "hunyuan-pro", "hunyuan-standard", "minimax-abab6.5s",
  "grok-3", "grok-3-mini", "grok-2-1212", "grok-2-vision-1212",
  "kimi-k2", "kimi-k1.5", "kimi-moonshot-v1-128k",
  "o1-2024-12-17", "o1-mini-2024-09-12", "o1-pro-2025-03-19",
  "o3-mini-2025-01-31", "o4-mini-2025-04-16-high",
  "claude-sonnet-4-5-20250929-thinking-16k", "claude-haiku-3-5-20241022",
  "nova-pro-v1", "nova-lite-v1", "nova-micro-v1",
  "titan-text-premier-v2", "titan-text-express-v1",
  "ai21-jamba-2-mid", "ai21-jamba-2-large",
  "mistral-large-2411", "mistral-small-2503", "pixtral-large-2411",
  "codestral-mamba-2407", "mistral-nemo-2407",
  "deepseek-chat-v3-0324", "deepseek-reasoner-r1-0528",
  "qwen-max-2025-01-25", "qwen-plus-2025-01-25", "qwen-turbo-2025-01-25",
  "step-2-16k", "step-1-flash",
  "doubao-pro-256k", "doubao-lite-128k",
  "abab7-chat-preview", "minimax-text-01",
  "zhipu-glm-4-0520", "zhipu-glm-4v-plus",
  "sensenova-v6-turbo", "sensenova-v5-max",
  "skywork-o1-preview", "skywork-mega-13b",
  "nemotron-4-340b-instruct", "nemotron-mini-4b-instruct",
  "granite-3.1-8b-instruct", "granite-3.1-2b-instruct",
  "starcoder2-15b", "codellama-70b-instruct",
  "wizardlm-2-8x22b", "wizardcoder-33b-v1.1",
  "solar-pro-preview-241126", "solar-mini-ja",
  "reka-core-20240904", "reka-flash-20240904", "reka-edge-20240208",
  "aya-expanse-32b", "aya-expanse-8b",
  "arctic-instruct", "snowflake-arctic-embed-l-v2.0",
  "falcon-180b-chat", "falcon-40b-instruct",
  "persimmon-8b-chat", "olmo-7b-instruct",
  "databricks-meta-llama-3.1-70b-instruct",
  "inflection-3-pi", "inflection-3-productivity",
  "palm-2-text-bison", "palm-2-chat-bison",
  "claude-2.1", "claude-2.0", "claude-instant-1.2",
  "gpt-4-turbo-2024-04-09", "gpt-4-0613", "gpt-3.5-turbo-0125",
  "text-davinci-003", "code-davinci-002",
  "llama-2-70b-chat", "llama-2-13b-chat", "llama-2-7b-chat",
  "vicuna-33b-v1.3", "vicuna-13b-v1.5",
  "mistral-7b-instruct-v0.3", "mistral-tiny-2312",
  "zephyr-7b-beta", "openchat-3.5-0106",
  "starling-lm-7b-beta", "neural-chat-7b-v3.1",
  "dolphin-2.5-mixtral-8x7b", "nous-hermes-2-yi-34b",
  "bagel-34b-v0.2", "chronos-hermes-13b-v2",
  "mythomax-l2-13b", "toppy-m-7b",
  "rwkv-5-world-3b", "mpt-30b-chat",
  "bloom-176b", "opt-66b",
  "cohere-embed-english-v3.0", "cohere-embed-multilingual-v3.0",
  "voyage-3", "voyage-3-lite", "voyage-code-3",
  "text-embedding-3-large", "text-embedding-3-small", "text-embedding-ada-002",
  "dall-e-3", "dall-e-2", "stable-diffusion-xl-1024-v1-0",
  "stable-diffusion-3.5-large", "flux-1.1-pro", "flux-1-schnell",
  "midjourney-v6.1", "ideogram-v2", "playground-v3",
  "whisper-large-v3", "whisper-large-v3-turbo",
  "tts-1-hd", "tts-1", "eleven-multilingual-v2",
  "sora-2025-03-25", "veo-2", "runway-gen3-alpha-turbo",
  "kling-v2.0-master", "minimax-video-01",
  "musicgen-large", "stable-audio-open-1.0",
  "claude-opus-4-6-20260215-thinking-32k", "claude-opus-4-6-20260215",
  "claude-sonnet-4-6-20260215-thinking-16k", "claude-sonnet-4-6-20260215",
  "gpt-5.3-preview", "gpt-5.3-mini-preview",
  "gemini-3-ultra-preview", "gemini-3-nano-preview",
  "llama-4-behemoth-preview", "llama-4-colossus-preview",
  "deepseek-v4-preview", "deepseek-r2-preview",
  "grok-5-preview", "grok-5-mini-preview",
  "mistral-large-4-preview", "mistral-medium-4-preview",
  "qwen4-max-preview", "qwen4-plus-preview",
  "ernie-6.0-preview", "glm-6-preview",
  "command-r-plus-2-preview", "jamba-2.0-preview",
  "phi-5-preview", "gemma-4-preview",
  "kimi-k3-preview", "yi-2-preview",
  "palm-3-preview", "titan-text-v3-preview",
  "nova-premier-v2-preview", "granite-4.0-preview",
  "falcon-3-preview", "arctic-2-preview",
  "inflection-4-preview", "reka-core-2-preview",
  "solar-pro-2-preview", "aya-23-preview",
  "nemotron-5-preview", "starcoder3-preview",
  "codestral-2-preview", "wizardlm-3-preview",
  "olmo-2-preview", "persimmon-2-preview",
  "dbrx-2-preview", "bloom-2-preview",
  "rwkv-6-preview", "mamba-2-preview",
  "jais-2-preview", "acegpt-2-preview",
  "megatron-turing-2-preview", "chinchilla-2-preview",
  "gopher-2-preview", "jurassic-3-preview",
  "luminous-supreme-2-preview", "cohere-command-3-preview",
  "ai21-jamba-3-preview", "anthropic-claude-next-preview",
  "openai-gpt-next-preview", "google-gemini-next-preview",
  "meta-llama-next-preview", "xai-grok-next-preview",
];

function ThinkingIndicator() {
  return (
    <div className="flex items-center gap-2 text-muted-foreground text-sm">
      <div className="flex items-center gap-1">
        <span className="text-xs font-medium">Pensando</span>
        <span className="flex gap-0.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1 h-1 rounded-full bg-muted-foreground"
              style={{
                animation: `thinkingPulse 1.4s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </span>
      </div>
    </div>
  );
}

export function ChatInputBar({
  placeholder = "O que você quer saber?",
  agent = "default",
  model: externalModel,
  showModelSelector = false,
  allModels = ALL_MODELS,
  onModelChange,
}: ChatInputBarProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("resposta");
  const [selectedModel, setSelectedModel] = useState(externalModel || allModels[Math.floor(Math.random() * allModels.length)]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const currentModel = externalModel || selectedModel;

  // Convert allModels strings to ModelOption format for the claude input
  const modelOptions: ModelOption[] = showModelSelector
    ? allModels.map((m) => ({ id: m, name: m, description: "" }))
    : [];

  useEffect(() => {
    setMessages([]);
    setIsLoading(false);
  }, [location.pathname]);

  useEffect(() => {
    setMessages([]);
    setIsLoading(false);
  }, [currentModel]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: text.trim() };
    const allMessages = [...messages, userMsg];
    setMessages(allMessages);
    setIsLoading(true);
    setActiveTab("resposta");

    let assistantSoFar = "";

    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: allMessages, agent, model: currentModel }),
      });

      if (resp.status === 429) { toast.error("Limite de requisições excedido."); setIsLoading(false); return; }
      if (resp.status === 402) { toast.error("Créditos insuficientes."); setIsLoading(false); return; }
      if (!resp.ok || !resp.body) throw new Error("Falha ao iniciar stream");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") { streamDone = true; break; }
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) upsertAssistant(content);
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) upsertAssistant(content);
          } catch { /* ignore */ }
        }
      }
    } catch (e) {
      console.error(e);
      toast.error("Erro ao se comunicar com a IA. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
    { id: "resposta", label: "Resposta", icon: MessageSquare },
    { id: "links", label: "Links", icon: Globe },
    { id: "imagens", label: "Imagens", icon: ImageIcon },
  ];

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-1 flex-col min-h-0">
      {/* Tabs */}
      {hasMessages && (
        <div className="border-b border-border px-4 shrink-0">
          <div className="mx-auto max-w-3xl flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-3xl">
          {/* Hero when no messages */}
          {!hasMessages && (
            <div className="flex flex-col items-center justify-center h-full min-h-[60vh]">
              <h1 className="text-[8rem] md:text-[12rem] font-bold text-foreground/[0.06] select-none leading-none tracking-tight">
                OTTO
              </h1>
            </div>
          )}

          {/* Messages */}
          {activeTab === "resposta" && hasMessages && (
            <div className="space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm max-w-[80%] ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card text-foreground"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                          strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                          em: ({ children }) => <em className="italic">{children}</em>,
                          ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
                          li: ({ children }) => <li className="mb-1">{children}</li>,
                          code: ({ children }) => <code className="bg-background/50 px-1.5 py-0.5 rounded text-xs font-mono">{children}</code>,
                          pre: ({ children }) => <pre className="bg-background/50 p-3 rounded-lg overflow-x-auto mb-2 text-xs">{children}</pre>,
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    ) : (
                      <span className="whitespace-pre-wrap">{msg.content}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "links" && hasMessages && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Links relacionados à sua pesquisa:</p>
              {messages.filter(m => m.role === "user").map((msg, i) => (
                <a key={i} href={`https://www.google.com/search?q=${encodeURIComponent(msg.content)}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg bg-card hover:bg-accent border border-border transition-colors">
                  <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-sm text-foreground">{msg.content}</p>
                    <p className="text-xs text-muted-foreground">google.com</p>
                  </div>
                </a>
              ))}
            </div>
          )}

          {activeTab === "imagens" && hasMessages && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Imagens relacionadas:</p>
              {messages.filter(m => m.role === "user").map((msg, i) => (
                <a key={i} href={`https://www.google.com/search?q=${encodeURIComponent(msg.content)}&tbm=isch`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg bg-card hover:bg-accent border border-border transition-colors">
                  <ImageIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-sm text-foreground">Imagens: {msg.content}</p>
                    <p className="text-xs text-muted-foreground">google.com/images</p>
                  </div>
                </a>
              ))}
            </div>
          )}

          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex justify-start mt-4">
              <div className="rounded-2xl px-4 py-3 bg-card">
                <ThinkingIndicator />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Claude-style Input area */}
      <div className={`p-4 shrink-0 ${hasMessages ? "border-t border-border" : ""}`}>
        <div className="mx-auto max-w-3xl">
          <ClaudeChatInput
            placeholder={placeholder}
            disabled={isLoading}
            models={modelOptions.length > 0 ? modelOptions : undefined}
            defaultModel={currentModel}
            onModelChange={(modelId) => {
              setSelectedModel(modelId);
              onModelChange?.(modelId);
            }}
            onSendMessage={(message) => {
              send(message);
            }}
          />
        </div>
      </div>
    </div>
  );
}
