import { useState } from "react";
import {
  Home,
  HelpCircle,
  Rocket,
  MessageSquare,
  Globe,
  Users,
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
  PanelLeftClose,
  PanelLeft } from
"lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import wuazeLogo from "@/assets/wuaze-logo.svg";

const beginnerItems = [
{ title: "Criador de Negócios IA", url: "/criador-negocios", icon: Globe },
{ title: "Criador de Agentes", url: "/criador-agentes", icon: MessageSquare },
{ title: "Expert em Nichos", url: "/expert-nichos", icon: Users }];


const advancedItems = [
{ title: "Expert em Gestão", url: "/expert-gestao", icon: BarChart3 },
{ title: "Expert em Vendas", url: "/expert-vendas", icon: TrendingUp },
{ title: "Expert em Funis", url: "/expert-funis", icon: Filter },
{ title: "Expert em Tráfego", url: "/expert-trafego", icon: Monitor },
{ title: "Copywriter Funil Australiano", url: "/copywriter-funil", icon: Tag }];


const bottomItems = [
{ title: "Cursos", url: "/cursos", icon: GraduationCap },
{ title: "Suporte", url: "/suporte", icon: Headphones },
{ title: "Configurações", url: "/configuracoes", icon: Settings }];


interface CollapsibleGroupProps {
  label: string;
  icon: React.ElementType;
  items: typeof beginnerItems;
  defaultOpen?: boolean;
  collapsed?: boolean;
}

function CollapsibleGroup({ label, icon: Icon, items, defaultOpen = true, collapsed = false }: CollapsibleGroupProps) {
  const [open, setOpen] = useState(defaultOpen);

  if (collapsed) {
    return (
      <div className="space-y-1">
        {items.map((item) =>
        <NavLink
          key={item.url}
          to={item.url}
          end
          className="flex items-center justify-center px-2 py-2 text-sidebar-foreground/80 hover:bg-sidebar-accent rounded-lg transition-colors"
          activeClassName="bg-sidebar-accent text-sidebar-accent-foreground"
          title={item.title}>

            <item.icon className="h-4 w-4" />
          </NavLink>
        )}
      </div>);

  }

  return (
    <div className="mb-1">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-3 py-2 text-sm font-semibold text-sidebar-foreground hover:bg-sidebar-accent rounded-lg transition-colors">

        <span className="flex items-center gap-2.5">
          <Icon className="h-4 w-4" />
          {label}
        </span>
        {open ? <ChevronDown className="h-4 w-4 text-sidebar-muted" /> : <ChevronRight className="h-4 w-4 text-sidebar-muted" />}
      </button>
      {open &&
      <div className="ml-2 mt-0.5 border-l border-sidebar-border pl-2 space-y-0.5">
          {items.map((item) =>
        <NavLink
          key={item.url}
          to={item.url}
          end
          className="flex items-center gap-2.5 px-3 py-2 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg transition-colors"
          activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium">

              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </NavLink>
        )}
        </div>
      }
    </div>);

}

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`flex flex-col min-h-screen bg-sidebar border-r border-sidebar-border transition-all duration-200 ${collapsed ? "w-16" : "w-64"}`}>
      {/* Logo + collapse toggle */}
      <div className={`flex items-center ${collapsed ? "justify-center px-2 py-4" : "justify-between px-5 py-6"}`}>
        {collapsed ?
        <img src={wuazeLogo} alt="Wuaze" className="h-8 w-8" /> :

        <h1 className="text-xl font-bold text-sidebar-primary tracking-tight flex items-center gap-2">
            <img src={wuazeLogo} alt="Wuaze" className="h-7 w-7" />
            wuaze
          </h1>
        }
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors ${collapsed ? "hidden" : ""}`}
          title="Fechar menu">

          <PanelLeftClose className="h-4 w-4" />
        </button>
      </div>

      {/* Expand button when collapsed */}
      {collapsed &&
      <div className="flex justify-center mb-2">
          <button
          onClick={() => setCollapsed(false)}
          className="text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors"
          title="Abrir menu">

            <PanelLeft className="h-4 w-4" />
          </button>
        </div>
      }

      {/* Navigation */}
      <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto">
        <NavLink
          to="/dashboard"
          end
          className={`flex items-center ${collapsed ? "justify-center px-2" : "gap-2.5 px-3"} py-2 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg transition-colors`}
          activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
          title="Início">

          <Home className="h-4 w-4" />
          {!collapsed && <span>Início</span>}
        </NavLink>

        <NavLink
          to="/assistente"
          end
          className={`flex items-center ${collapsed ? "justify-center px-2" : "gap-2.5 px-3"} py-2 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg transition-colors`}
          activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
          title="Assistente de uso">

          <HelpCircle className="h-4 w-4" />
          {!collapsed && <span>​Chat 350 models      </span>}
        </NavLink>

        <div className="py-2" />

        <CollapsibleGroup label="Para Iniciantes" icon={Rocket} items={beginnerItems} collapsed={collapsed} />
        <CollapsibleGroup label="Agentes Avançados" icon={Users} items={advancedItems} collapsed={collapsed} />
      </nav>

      {/* Bottom */}
      <div className="px-2 pb-4 space-y-0.5 border-t border-sidebar-border pt-3">
        {bottomItems.map((item) =>
        <NavLink
          key={item.url}
          to={item.url}
          end
          className={`flex items-center ${collapsed ? "justify-center px-2" : "gap-2.5 px-3"} py-2 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg transition-colors`}
          activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
          title={item.title}>

            <item.icon className="h-4 w-4" />
            {!collapsed && <span>{item.title}</span>}
          </NavLink>
        )}
      </div>
    </aside>);

}