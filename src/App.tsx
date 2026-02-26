import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Configuracoes from "./pages/Configuracoes";
import Assistente from "./pages/Assistente";
import NotFound from "./pages/NotFound";
import { AgentPage } from "./components/AgentPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="dark">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
            <Route path="/assistente" element={<Assistente />} />
            <Route path="/criador-negocios" element={<AgentPage title="Criador de Negócios IA" description="A IA que cria seu negócio de agentes de IA do absoluto zero." agent="criador-negocios" />} />
            <Route path="/criador-agentes" element={<AgentPage title="Criador de Agentes" description="Crie agentes de IA personalizados para diversos casos de uso." agent="criador-agentes" />} />
            <Route path="/expert-nichos" element={<AgentPage title="Expert em Nichos" description="Descubra os melhores nichos para atuar com agentes de IA." agent="expert-nichos" />} />
            <Route path="/expert-gestao" element={<AgentPage title="Expert em Gestão" description="Otimize a gestão do seu negócio de IA." agent="expert-gestao" />} />
            <Route path="/expert-vendas" element={<AgentPage title="Expert em Vendas" description="Domine as técnicas de vendas para agentes de IA." agent="expert-vendas" />} />
            <Route path="/expert-funis" element={<AgentPage title="Expert em Funis" description="Crie funis de vendas eficientes para seu negócio." agent="expert-funis" />} />
            <Route path="/expert-trafego" element={<AgentPage title="Expert em Tráfego" description="Aprenda tráfego pago para escalar seu negócio." agent="expert-trafego" />} />
            <Route path="/copywriter-funil" element={<AgentPage title="Copywriter Funil Australiano" description="Copywriting especializado para funis de vendas." agent="copywriter-funil" />} />
            <Route path="/cursos" element={<AgentPage title="Cursos" description="Acesse cursos e treinamentos exclusivos." />} />
            <Route path="/suporte" element={<AgentPage title="Suporte" description="Precisa de ajuda? Fale com nosso suporte." />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
