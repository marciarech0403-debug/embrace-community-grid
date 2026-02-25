import { MessageSquare, Zap, Target, TrendingUp } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { ChatInputBar } from "@/components/ChatInputBar";
import wuazeLogo from "@/assets/wuaze-logo.svg";

const features = [
  {
    icon: MessageSquare,
    title: "Agentes Especializados",
    description: "Converse com IAs treinadas para te mostrar como ganhar dinheiro no mercado de IA.",
  },
  {
    icon: Zap,
    title: "Crie Agentes de Whatsapp",
    description: "Crie agentes de IA para conectar no whatsapp de empresas usando Zaia, GPT Maker ou outras ferramentas.",
  },
  {
    icon: Target,
    title: "Tráfego Pago e Funis",
    description: "Crie e domine as principais estratégias de escala e funis para empresas locais, seja você iniciante ou avançado.",
  },
  {
    icon: TrendingUp,
    title: "Escale seu Negócio",
    description: "Otimize seus processos, aprenda sobre: gestão, modelo de negócios, vendas e aquisição de clientes.",
  },
];

const Index = () => {
  return (
    <AppLayout>
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Logo */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <img src={wuazeLogo} alt="Wuaze" className="h-7 w-7" />
            wuaze
          </h2>
        </div>

        {/* Welcome */}
        <h1 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-3">
          Bem-vindo ao Wuaze
        </h1>
        <p className="text-muted-foreground text-center max-w-xl mb-10 text-sm leading-relaxed">
          Seu sócio digital que domina tudo sobre ganhar dinheiro com IA. Escolha um agente especializado na barra lateral para começar.
        </p>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full">
          {features.map((feature) => (
            <button
              key={feature.title}
              className="flex flex-col items-center text-center gap-3 rounded-xl border border-surface-border bg-surface p-6 hover:bg-surface-hover transition-colors group cursor-pointer"
            >
              <feature.icon className="h-6 w-6 text-muted-foreground group-hover:text-foreground transition-colors" />
              <h3 className="font-semibold text-surface-foreground text-sm">{feature.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
            </button>
          ))}
        </div>
      </div>

      <ChatInputBar />
    </AppLayout>
  );
};

export default Index;
