import { AppLayout } from "@/components/AppLayout";
import { ChatInputBar } from "@/components/ChatInputBar";

const Index = () => {
  return (
    <AppLayout>
      <ChatInputBar placeholder="O que você quer saber?" agent="default" showModelSelector />
    </AppLayout>
  );
};

export default Index;
