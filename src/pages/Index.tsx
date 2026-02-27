import { AppLayout } from "@/components/AppLayout";
import { ChatInputBar } from "@/components/ChatInputBar";

const Index = () => {
  return (
    <AppLayout>
      <ChatInputBar placeholder="Pergunte qualquer coisa..." agent="default" />
    </AppLayout>
  );
};

export default Index;
