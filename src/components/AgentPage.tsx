import { AppLayout } from "@/components/AppLayout";
import { ChatInputBar } from "@/components/ChatInputBar";

interface AgentPageProps {
  title: string;
  description: string;
  agent?: string;
}

export function AgentPage({ title, description, agent = "default" }: AgentPageProps) {
  return (
    <AppLayout>
      <div className="flex flex-col h-full">
        <div className="px-6 py-4 border-b border-border">
          <h1 className="text-lg font-bold text-foreground">{title}</h1>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <ChatInputBar placeholder="Pergunte qualquer coisa..." agent={agent} />
      </div>
    </AppLayout>
  );
}
