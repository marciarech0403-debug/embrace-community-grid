import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Configuracoes from "./pages/Configuracoes";
import Assistente from "./pages/Assistente";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { AgentPage } from "./components/AgentPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <div className="dark">
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/configuracoes" element={<ProtectedRoute><Configuracoes /></ProtectedRoute>} />
              <Route path="/assistente" element={<ProtectedRoute><Assistente /></ProtectedRoute>} />
              <Route path="/criador-negocios" element={<ProtectedRoute><AgentPage title="Criador de Negócios IA" description="A IA que cria seu negócio de agentes de IA do absoluto zero." agent="criador-negocios" /></ProtectedRoute>} />
              <Route path="/criador-agentes" element={<ProtectedRoute><AgentPage title="Criador de Agentes" description="Crie agentes de IA personalizados para diversos casos de uso." agent="criador-agentes" /></ProtectedRoute>} />
              <Route path="/expert-nichos" element={<ProtectedRoute><AgentPage title="Expert em Nichos" description="Descubra os melhores nichos para atuar com agentes de IA." agent="expert-nichos" /></ProtectedRoute>} />
              <Route path="/expert-gestao" element={<ProtectedRoute><AgentPage title="Expert em Gestão" description="Otimize a gestão do seu negócio de IA." agent="expert-gestao" /></ProtectedRoute>} />
              <Route path="/expert-vendas" element={<ProtectedRoute><AgentPage title="Expert em Vendas" description="Domine as técnicas de vendas para agentes de IA." agent="expert-vendas" /></ProtectedRoute>} />
              <Route path="/expert-funis" element={<ProtectedRoute><AgentPage title="Expert em Funis" description="Crie funis de vendas eficientes para seu negócio." agent="expert-funis" /></ProtectedRoute>} />
              <Route path="/expert-trafego" element={<ProtectedRoute><AgentPage title="Expert em Tráfego" description="Aprenda tráfego pago para escalar seu negócio." agent="expert-trafego" /></ProtectedRoute>} />
              <Route path="/copywriter-funil" element={<ProtectedRoute><AgentPage title="Copywriter Funil Australiano" description="Copywriting especializado para funis de vendas." agent="copywriter-funil" /></ProtectedRoute>} />
              <Route path="/cursos" element={<ProtectedRoute><AgentPage title="Cursos" description="Acesse cursos e treinamentos exclusivos." /></ProtectedRoute>} />
              <Route path="/suporte" element={<ProtectedRoute><AgentPage title="Suporte" description="Precisa de ajuda? Fale com nosso suporte." /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
