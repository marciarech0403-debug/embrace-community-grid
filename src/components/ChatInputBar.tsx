import { useState, useRef, useEffect } from "react";
import { ArrowUp, Globe, Image as ImageIcon, MessageSquare, Search, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import ottoLogo from "@/assets/otto-logo.png";

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
  "gemini-3-flash", "gpt-5.1-high", "gpt-5.2-high", "gpt-5.2", "gpt-5.1",
  "gpt-5-high", "deepseek-v3.2", "deepseek-r1", "claude-sonnet-4-20250514",
  "gpt-4.1-2025-04-14", "gemini-2.5-pro", "gemini-2.5-flash", "llama-3.3-70b-instruct",
  "mistral-large-3", "qwen3-235b-a22b", "claude-3-7-sonnet-20250219",
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
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("resposta");
  const [selectedModel, setSelectedModel] = useState(externalModel || allModels[Math.floor(Math.random() * allModels.length)]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [modelSearch, setModelSearch] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const currentModel = externalModel || selectedModel;

  useEffect(() => {
    setMessages([]);
    setInput("");
    setIsLoading(false);
  }, [location.pathname]);

  useEffect(() => {
    setMessages([]);
    setInput("");
    setIsLoading(false);
  }, [currentModel]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredModels = modelSearch
    ? allModels.filter((m) => m.toLowerCase().includes(modelSearch.toLowerCase()))
    : allModels;

  const send = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
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
        body: JSON.stringify({ messages: [...messages, userMsg], agent, model: currentModel }),
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
          {/* Grok-style hero when no messages */}
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

      {/* Input area */}
      <div className={`p-4 shrink-0 ${hasMessages ? "border-t border-border" : ""}`}>
        <div className="mx-auto max-w-3xl space-y-3">
          {/* Model selector */}
          {showModelSelector && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <img src={ottoLogo} alt="" className="h-4 w-auto opacity-60" />
                <span className="truncate max-w-[200px]">{currentModel}</span>
                <ChevronDown className="h-3 w-3" />
              </button>

              {showDropdown && (
                <div className="absolute bottom-full mb-2 left-0 w-80 rounded-lg bg-card border border-border shadow-xl max-h-72 flex flex-col z-50">
                  <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Buscar modelo..."
                      value={modelSearch}
                      onChange={(e) => setModelSearch(e.target.value)}
                      className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                      autoFocus
                    />
                  </div>
                  <div className="overflow-y-auto flex-1">
                    {filteredModels.map((m) => (
                      <button
                        key={m}
                        onClick={() => {
                          setSelectedModel(m);
                          onModelChange?.(m);
                          setShowDropdown(false);
                          setModelSearch("");
                        }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors flex items-center gap-2 ${
                          currentModel === m ? "bg-accent text-foreground font-medium" : "text-muted-foreground"
                        }`}
                      >
                        <img src={ottoLogo} alt="" className="h-3 w-auto opacity-40" />
                        {m}
                      </button>
                    ))}
                    {filteredModels.length === 0 && (
                      <p className="px-3 py-4 text-sm text-muted-foreground text-center">Nenhum modelo encontrado</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Input box */}
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
            <input
              type="text"
              placeholder={placeholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
              disabled={isLoading}
            />
            <button
              onClick={send}
              disabled={isLoading || !input.trim()}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background hover:opacity-90 transition-opacity disabled:opacity-30"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
