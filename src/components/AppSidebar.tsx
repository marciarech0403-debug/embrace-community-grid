import { useState } from "react";
import {
  Home,
  HelpCircle,
  Rocket,
  MessageSquare,
  Globe,
  Users,
  Brain,
  BarChart3,
  TrendingUp,
  Filter,
  Monitor,
  Tag,
  GraduationCap,
  Headphones,
  Settings,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";

const beginnerItems = [
  { title: "Criador de Negócios IA", url: "/criador-negocios", icon: Globe },
  { title: "Criador de Agentes", url: "/criador-agentes", icon: MessageSquare },
  { title: "Expert em Nichos", url: "/expert-nichos", icon: Users },
];

const advancedItems = [
  { title: "Cérebro Gabarra.ai", url: "/cerebro-gabarra", icon: Brain },
  { title: "Expert em Gestão", url: "/expert-gestao", icon: BarChart3 },
  { title: "Expert em Vendas", url: "/expert-vendas", icon: TrendingUp },
  { title: "Expert em Funis", url: "/expert-funis", icon: Filter },
  { title: "Expert em Tráfego", url: "/expert-trafego", icon: Monitor },
  { title: "Copywriter Funil Australiano", url: "/copywriter-funil", icon: Tag },
];

const bottomItems = [
  { title: "Cursos", url: "/cursos", icon: GraduationCap },
  { title: "Suporte", url: "/suporte", icon: Headphones },
  { title: "Configurações", url: "/configuracoes", icon: Settings },
];

interface CollapsibleGroupProps {
  label: string;
  icon: React.ElementType;
  items: typeof beginnerItems;
  defaultOpen?: boolean;
}

function CollapsibleGroup({ label, icon: Icon, items, defaultOpen = true }: CollapsibleGroupProps) {
  const [open, setOpen] = useState(defaultOpen);
  const location = useLocation();

  return (
    <div className="mb-1">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-3 py-2 text-sm font-semibold text-sidebar-foreground hover:bg-sidebar-accent rounded-lg transition-colors"
      >
        <span className="flex items-center gap-2.5">
          <Icon className="h-4 w-4" />
          {label}
        </span>
        {open ? <ChevronDown className="h-4 w-4 text-sidebar-muted" /> : <ChevronRight className="h-4 w-4 text-sidebar-muted" />}
      </button>
      {open && (
        <div className="ml-2 mt-0.5 border-l border-sidebar-border pl-2 space-y-0.5">
          {items.map((item) => (
            <NavLink
              key={item.url}
              to={item.url}
              end
              className="flex items-center gap-2.5 px-3 py-2 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg transition-colors"
              activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

export function AppSidebar() {
  return (
    <aside className="flex flex-col w-64 min-h-screen bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="px-5 py-6">
        <h1 className="text-xl font-bold text-sidebar-primary tracking-tight flex items-center gap-2">
          <span className="bg-sidebar-primary text-sidebar-primary-foreground rounded p-1 text-xs font-black">▎</span>
          agentor
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {/* Top items */}
        <NavLink
          to="/"
          end
          className="flex items-center gap-2.5 px-3 py-2 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg transition-colors"
          activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
        >
          <Home className="h-4 w-4" />
          <span>Início</span>
        </NavLink>

        <NavLink
          to="/assistente"
          end
          className="flex items-center gap-2.5 px-3 py-2 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg transition-colors"
          activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
        >
          <HelpCircle className="h-4 w-4" />
          <span>Assistente de uso</span>
        </NavLink>

        <div className="py-2" />

        {/* Groups */}
        <CollapsibleGroup label="Para Iniciantes" icon={Rocket} items={beginnerItems} />
        <CollapsibleGroup label="Agentes Avançados" icon={Users} items={advancedItems} />
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 space-y-0.5 border-t border-sidebar-border pt-3">
        {bottomItems.map((item) => (
          <NavLink
            key={item.url}
            to={item.url}
            end
            className="flex items-center gap-2.5 px-3 py-2 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg transition-colors"
            activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
          >
            <item.icon className="h-4 w-4" />
            <span>{item.title}</span>
          </NavLink>
        ))}
      </div>
    </aside>
  );
}
