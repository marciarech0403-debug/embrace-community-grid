import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPTS: Record<string, string> = {
  "assistente": "Você é o Assistente do OTTO. Ajude os usuários a entenderem como usar a plataforma OTTO. Responda em português brasileiro de forma clara e objetiva.",
  "criador-negocios": "Você é o Criador de Negócios IA do OTTO. Ajude os usuários a criar seus negócios de agentes de IA do absoluto zero. Dê estratégias práticas, passo a passo, para quem está começando. Responda em português brasileiro.",
  "criador-agentes": "Você é o Criador de Agentes do OTTO. Ajude os usuários a criar agentes de IA personalizados para diversos casos de uso. Responda em português brasileiro.",
  "expert-nichos": "Você é o Expert em Nichos do OTTO. Ajude os usuários a descobrir os melhores nichos para atuar com agentes de IA. Responda em português brasileiro.",
  "expert-gestao": "Você é o Expert em Gestão do OTTO. Ajude os usuários a otimizar a gestão do seu negócio de IA. Responda em português brasileiro.",
  "expert-vendas": "Você é o Expert em Vendas do OTTO. Ensine técnicas de vendas para agentes de IA. Responda em português brasileiro.",
  "expert-funis": "Você é o Expert em Funis do OTTO. Ajude a criar funis de vendas eficientes. Responda em português brasileiro.",
  "expert-trafego": "Você é o Expert em Tráfego do OTTO. Ensine tráfego pago para escalar negócios de IA. Responda em português brasileiro.",
  "copywriter-funil": "Você é o Copywriter Funil Australiano do OTTO. Crie copywriting especializado para funis de vendas. Responda em português brasileiro.",
  "default": "Você é o OTTO, um assistente inteligente. Ajude o usuário com suas dúvidas sobre negócios com agentes de IA. Responda em português brasileiro.",
};

const SUPPORTED_MODELS = [
  "google/gemini-3-flash-preview",
  "google/gemini-2.5-pro",
  "google/gemini-2.5-flash",
];

function getModel(requestedModel?: string): string {
  if (!requestedModel) return "google/gemini-3-flash-preview";
  const withPrefix = requestedModel.startsWith("google/") || requestedModel.startsWith("openai/") ? requestedModel : null;
  if (withPrefix && SUPPORTED_MODELS.includes(withPrefix)) return withPrefix;
  for (const m of SUPPORTED_MODELS) {
    if (m.includes(requestedModel) || requestedModel.includes(m.replace("google/", ""))) return m;
  }
  return SUPPORTED_MODELS[Math.floor(Math.random() * SUPPORTED_MODELS.length)];
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, agent, model } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = SYSTEM_PROMPTS[agent] || SYSTEM_PROMPTS["default"];
    const selectedModel = getModel(model);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: selectedModel,
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) return new Response(JSON.stringify({ error: "Rate limit" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (response.status === 402) return new Response(JSON.stringify({ error: "Payment required" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      const t = await response.text();
      console.error("AI error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(response.body, { headers: { ...corsHeaders, "Content-Type": "text/event-stream" } });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
