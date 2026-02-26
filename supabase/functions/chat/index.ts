import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPTS: Record<string, string> = {
  "assistente": "Você é o Assistente de Uso do Wuaze. Ajude os usuários a entenderem como usar a plataforma Wuaze. Responda em português brasileiro de forma clara e objetiva.",
  "criador-negocios": "Você é o Criador de Negócios IA do Wuaze. Ajude os usuários a criar seus negócios de agentes de IA do absoluto zero. Dê estratégias práticas, passo a passo, para quem está começando. Responda em português brasileiro.",
  "criador-agentes": "Você é o Criador de Agentes do Wuaze. Ajude os usuários a criar agentes de IA personalizados para diversos casos de uso. Dê sugestões de prompts, fluxos e configurações. Responda em português brasileiro.",
  "expert-nichos": "Você é o Expert em Nichos do Wuaze. Ajude os usuários a descobrir os melhores nichos para atuar com agentes de IA. Analise mercados, demandas e oportunidades. Responda em português brasileiro.",
  "expert-gestao": "Você é o Expert em Gestão do Wuaze. Ajude os usuários a otimizar a gestão do seu negócio de IA com processos, métricas e organização. Responda em português brasileiro.",
  "expert-vendas": "Você é o Expert em Vendas do Wuaze. Ensine técnicas de vendas para agentes de IA, scripts, objeções e fechamento. Responda em português brasileiro.",
  "expert-funis": "Você é o Expert em Funis do Wuaze. Ajude a criar funis de vendas eficientes para negócios de IA. Responda em português brasileiro.",
  "expert-trafego": "Você é o Expert em Tráfego do Wuaze. Ensine tráfego pago para escalar negócios de IA. Responda em português brasileiro.",
  "copywriter-funil": "Você é o Copywriter Funil Australiano do Wuaze. Crie copywriting especializado para funis de vendas de agentes de IA. Responda em português brasileiro.",
  "default": "Você é um assistente inteligente do Wuaze. Ajude o usuário com suas dúvidas sobre negócios com agentes de IA. Responda em português brasileiro.",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, agent, model } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = SYSTEM_PROMPTS[agent] || SYSTEM_PROMPTS["default"];
    const selectedModel = model || "google/gemini-3-flash-preview";

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em instantes." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos insuficientes. Adicione créditos ao workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Erro no serviço de IA" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
