import { AppLayout } from "@/components/AppLayout";
import { ChatInputBar } from "@/components/ChatInputBar";

interface AgentPageProps {
  title: string;
  description: string;
}

export function AgentPage({ title, description }: AgentPageProps) {
  return (
    <AppLayout>
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-3">
          {title}
        </h1>
        <p className="text-muted-foreground text-center max-w-md text-sm">
          {description}
        </p>
        <p className="mt-6 text-lg font-semibold text-foreground">Pronto quando você estiver.</p>
        <p className="text-sm text-muted-foreground text-center max-w-md mt-2">
          {description}
        </p>
      </div>
      <ChatInputBar placeholder="Pergunte qualquer coisa" />
    </AppLayout>
  );
}
