import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { ChatInputBar } from "@/components/ChatInputBar";
import { Search, ChevronDown } from "lucide-react";

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
  "ernie-5.0-preview-1022", "deepseek-v3.1", "kimi-k2-0905-preview",
  "deepseek-v3.1-thinking", "kimi-k2-0711-preview", "deepseek-v3.1-terminus",
  "deepseek-v3.1-terminus-thinking", "qwen3-vl-235b-a22b-instruct", "mistral-large-3",
  "gpt-4.1-2025-04-14", "claude-opus-4-20250514", "grok-3-preview-02-24",
  "mistral-medium-2508", "gemini-2.5-flash", "glm-4.5", "grok-4-0709",
  "claude-haiku-4-5-20251001", "gemini-2.5-flash-preview-09-2025", "minimax-m2.5",
  "grok-4-fast-reasoning", "o1-2024-12-17", "qwen3-235b-a22b-no-thinking",
  "qwen3-next-80b-a3b-instruct", "claude-sonnet-4-20250514-thinking-32k",
  "longcat-flash-chat", "qwen3-235b-a22b-thinking-2507", "deepseek-r1",
  "qwen3-vl-235b-a22b-thinking", "amazon-nova-experimental-chat-12-10",
  "deepseek-v3-0324", "hunyuan-vision-1.5-thinking", "mimo-v2-flash",
  "mai-1-preview", "o4-mini-2025-04-16", "gpt-5-mini-high",
  "claude-sonnet-4-20250514", "claude-3-7-sonnet-20250219-thinking-32k", "o1-preview",
  "hunyuan-t1-20250711", "qwen3-coder-480b-a35b-instruct", "step-3.5-flash",
  "minimax-m2.1-preview", "mistral-medium-2505", "qwen3-30b-a3b-instruct-2507",
  "hunyuan-turbos-20250416", "gpt-4.1-mini-2025-04-14",
  "gemini-2.5-flash-lite-preview-09-2025-no-thinking", "glm-4.6v",
  "qwen3-235b-a22b", "gemini-2.5-flash-lite-preview-06-17-thinking",
  "qwen2.5-max", "claude-3-5-sonnet-20241022", "claude-3-7-sonnet-20250219",
  "glm-4.5-air", "qwen3-next-80b-a3b-thinking", "minimax-m1", "glm-4.7-flash",
  "amazon-nova-experimental-chat-11-10", "gemma-3-27b-it", "o3-mini-high",
  "grok-3-mini-high", "gemini-2.0-flash-001", "deepseek-v3", "grok-3-mini-beta",
  "intellect-3", "mistral-small-2506", "gpt-oss-120b",
  "gemini-2.0-flash-lite-preview-02-05", "glm-4.5v", "command-a-03-2025",
  "gemini-1.5-pro-002", "amazon-nova-experimental-chat-10-20",
  "hunyuan-turbos-20250226", "o3-mini", "amazon-nova-experimental-chat-10-09",
  "llama-3.1-nemotron-ultra-253b-v1", "ling-flash-2.0", "minimax-m2",
  "qwen3-32b", "step-3", "qwen-plus-0125", "gpt-4o-2024-05-13", "glm-4-plus-0111",
  "claude-3-5-sonnet-20240620", "gemma-3-12b-it",
  "nvidia-llama-3.3-nemotron-super-49b-v1.5", "hunyuan-turbo-0110",
  "gpt-5-nano-high", "o1-mini", "nova-2-lite", "qwq-32b",
  "llama-3.1-405b-instruct-bf16", "grok-2-2024-08-13", "gpt-4o-2024-08-06",
  "gemini-advanced-0514", "step-2-16k-exp-202412", "llama-3.1-405b-instruct-fp8",
  "olmo-3.1-32b-instruct", "yi-lightning", "qwen3-30b-a3b",
  "llama-4-maverick-17b-128e-instruct", "llama-3.3-nemotron-49b-super-v1",
  "hunyuan-large-2025-02-10", "gpt-4-turbo-2024-04-09", "claude-3-5-haiku-20241022",
  "deepseek-v2.5-1210", "gemini-1.5-pro-001", "llama-4-scout-17b-16e-instruct",
  "claude-3-opus-20240229", "gpt-4.1-nano-2025-04-14", "step-1o-turbo-202506",
  "ring-flash-2.0", "llama-3.3-70b-instruct", "glm-4-plus", "gemma-3n-e4b-it",
  "qwen-max-0919", "gpt-4o-mini-2024-07-18", "gpt-oss-20b",
  "nvidia-nemotron-3-nano-30b-a3b-bf16", "qwen2.5-plus-1127", "athene-v2-chat",
  "mistral-large-2407", "gpt-4-0125-preview", "gpt-4-1106-preview",
  "hunyuan-standard-2025-02-10", "gemini-1.5-flash-002", "mercury",
  "grok-2-mini-2024-08-13", "deepseek-v2.5", "athene-70b-0725",
  "olmo-3-32b-think", "mistral-large-2411", "magistral-medium-2506",
  "mistral-small-3.1-24b-instruct-2503", "gemma-3-4b-it", "qwen2.5-72b-instruct",
  "llama-3.1-nemotron-70b-instruct", "hunyuan-large-vision",
  "llama-3.1-70b-instruct", "amazon-nova-pro-v1.0", "jamba-1.5-large",
  "gemma-2-27b-it", "reka-core-20240904", "ibm-granite-h-small", "gpt-4-0314",
  "llama-3.1-tulu-3-70b", "llama-3.1-nemotron-51b-instruct", "gemini-1.5-flash-001",
  "olmo-3.1-32b-think", "claude-3-sonnet-20240229", "gemma-2-9b-it-simpo",
  "nemotron-4-340b-instruct", "command-r-plus-08-2024", "llama-3-70b-instruct",
  "gpt-4-0613", "mistral-small-24b-instruct-2501", "glm-4-0520",
  "reka-flash-20240904", "qwen2.5-coder-32b-instruct", "c4ai-aya-expanse-32b",
  "gemma-2-9b-it", "deepseek-coder-v2", "command-r-plus", "qwen2-72b-instruct",
  "claude-3-haiku-20240307", "amazon-nova-lite-v1.0", "gemini-1.5-flash-8b-001",
  "phi-4", "olmo-2-0325-32b-instruct", "command-r-08-2024", "mistral-large-2402",
  "amazon-nova-micro-v1.0", "jamba-1.5-mini", "ministral-8b-2410",
  "gemini-pro-dev-api", "qwen1.5-110b-chat", "reka-flash-21b-20240226-online",
  "hunyuan-standard-256k", "qwen1.5-72b-chat", "mixtral-8x22b-instruct-v0.1",
  "command-r", "reka-flash-21b-20240226", "gpt-3.5-turbo-0125",
  "llama-3-8b-instruct", "mistral-medium", "c4ai-aya-expanse-8b", "gemini-pro",
  "llama-3.1-tulu-3-8b", "yi-1.5-34b-chat", "zephyr-orpo-141b-A35b-v0.1",
  "llama-3.1-8b-instruct", "granite-3.1-8b-instruct", "qwen1.5-32b-chat",
  "gpt-3.5-turbo-1106", "gemma-2-2b-it", "phi-3-medium-4k-instruct",
  "mixtral-8x7b-instruct-v0.1", "dbrx-instruct-preview", "internlm2_5-20b-chat",
  "qwen1.5-14b-chat", "wizardlm-70b", "deepseek-llm-67b-chat", "yi-34b-chat",
  "openchat-3.5-0106", "openchat-3.5", "granite-3.0-8b-instruct", "gemma-1.1-7b-it",
  "snowflake-arctic-instruct", "granite-3.1-2b-instruct", "tulu-2-dpo-70b",
  "openhermes-2.5-mistral-7b", "vicuna-33b", "starling-lm-7b-beta",
  "phi-3-small-8k-instruct", "llama-2-70b-chat", "starling-lm-7b-alpha",
  "llama-3.2-3b-instruct", "nous-hermes-2-mixtral-8x7b-dpo", "qwq-32b-preview",
  "granite-3.0-2b-instruct", "llama2-70b-steerlm-chat", "solar-10.7b-instruct-v1.0",
  "dolphin-2.2.1-mistral-7b", "mpt-30b-chat", "mistral-7b-instruct-v0.2",
  "wizardlm-13b", "falcon-180b-chat", "qwen1.5-7b-chat",
  "phi-3-mini-4k-instruct-june-2024", "llama-2-13b-chat", "vicuna-13b",
  "qwen-14b-chat", "palm-2", "codellama-34b-instruct", "gemma-7b-it",
  "zephyr-7b-beta", "phi-3-mini-128k-instruct", "phi-3-mini-4k-instruct",
  "guanaco-33b", "zephyr-7b-alpha", "stripedhyena-nous-7b",
  "codellama-70b-instruct", "vicuna-7b", "smollm2-1.7b-instruct",
  "gemma-1.1-2b-it", "llama-3.2-1b-instruct", "mistral-7b-instruct",
  "llama-2-7b-chat", "gemma-2b-it", "qwen1.5-4b-chat", "olmo-7b-instruct",
  "koala-13b", "alpaca-13b", "gpt4all-13b-snoozy", "mpt-7b-chat", "chatglm3-6b",
  "RWKV-4-Raven-14B", "chatglm2-6b", "oasst-pythia-12b", "chatglm-6b",
  "fastchat-t5-3b", "dolly-v2-12b", "llama-13b", "stablelm-tuned-alpha-7b",
];

export default function Assistente() {
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const filtered = search
    ? ALL_MODELS.filter((m) => m.toLowerCase().includes(search.toLowerCase()))
    : ALL_MODELS;

  return (
    <AppLayout>
      <div className="flex flex-col h-full">
        {/* Header with model selector */}
        <div className="px-6 py-4 border-b border-border shrink-0">
          <h1 className="text-lg font-bold text-foreground">Assistente de Uso</h1>
          <p className="text-xs text-muted-foreground mb-3">Chat direto com modelos de IA</p>

          <div className="relative max-w-md">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center justify-between w-full gap-2 rounded-lg bg-surface px-3 py-2 text-sm text-foreground border border-surface-border hover:bg-surface-hover transition-colors"
            >
              <span className={selectedModel ? "text-foreground" : "text-muted-foreground"}>
                {selectedModel || "Selecione um modelo..."}
              </span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>

            {showDropdown && (
              <div className="absolute z-50 mt-1 w-full rounded-lg bg-card border border-border shadow-xl max-h-72 flex flex-col">
                <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Buscar modelo..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                    autoFocus
                  />
                </div>
                <div className="overflow-y-auto flex-1">
                  {filtered.map((model) => (
                    <button
                      key={model}
                      onClick={() => {
                        setSelectedModel(model);
                        setShowDropdown(false);
                        setSearch("");
                      }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-surface-hover transition-colors ${
                        selectedModel === model ? "bg-surface-hover text-foreground font-medium" : "text-muted-foreground"
                      }`}
                    >
                      {model}
                    </button>
                  ))}
                  {filtered.length === 0 && (
                    <p className="px-3 py-4 text-sm text-muted-foreground text-center">Nenhum modelo encontrado</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {selectedModel ? (
          <ChatInputBar
            placeholder={`Converse com ${selectedModel}...`}
            agent="assistente"
            model={selectedModel}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground text-sm">Selecione um modelo acima para começar a conversar</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
