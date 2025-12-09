import { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, MessageCircle, User, Search } from "lucide-react";
import { toast } from "sonner";
import { mockClients } from "@/data/mockData";

interface Message {
  id: number;
  senderType: "client" | "user";
  senderId: number;
  senderName: string;
  recipientId: number;
  recipientName: string;
  message: string;
  createdAt: Date;
  isRead: boolean;
}

interface Conversation {
  clientId: number;
  clientName: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
}

// Mock de conversas
const mockConversations: Conversation[] = [
  {
    clientId: 1,
    clientName: "Maria Silva",
    lastMessage: "Perfeito! Muito obrigada pela atenção.",
    lastMessageTime: new Date("2024-12-03T10:12:00"),
    unreadCount: 0,
  },
  {
    clientId: 2,
    clientName: "João Santos",
    lastMessage: "Quando será a próxima audiência?",
    lastMessageTime: new Date("2024-12-02T15:30:00"),
    unreadCount: 2,
  },
  {
    clientId: 3,
    clientName: "Ana Costa",
    lastMessage: "Obrigada pelas informações!",
    lastMessageTime: new Date("2024-12-01T09:45:00"),
    unreadCount: 0,
  },
];

// Mock de mensagens
const mockMessages: Record<number, Message[]> = {
  1: [
    {
      id: 1,
      senderType: "user",
      senderId: 1,
      senderName: "Dr. Djair Rota",
      recipientId: 1,
      recipientName: "Maria Silva",
      message: "Olá Maria! Como posso ajudá-la hoje?",
      createdAt: new Date("2024-12-03T10:00:00"),
      isRead: true,
    },
    {
      id: 2,
      senderType: "client",
      senderId: 1,
      senderName: "Maria Silva",
      recipientId: 1,
      recipientName: "Dr. Djair Rota",
      message: "Bom dia, Doutor! Gostaria de saber sobre o andamento do meu processo.",
      createdAt: new Date("2024-12-03T10:05:00"),
      isRead: true,
    },
    {
      id: 3,
      senderType: "user",
      senderId: 1,
      senderName: "Dr. Djair Rota",
      recipientId: 1,
      recipientName: "Maria Silva",
      message: "Claro! Seu processo está em fase de análise. Tivemos uma movimentação importante ontem.",
      createdAt: new Date("2024-12-03T10:10:00"),
      isRead: true,
    },
    {
      id: 4,
      senderType: "client",
      senderId: 1,
      senderName: "Maria Silva",
      recipientId: 1,
      recipientName: "Dr. Djair Rota",
      message: "Perfeito! Muito obrigada pela atenção.",
      createdAt: new Date("2024-12-03T10:12:00"),
      isRead: true,
    },
  ],
  2: [
    {
      id: 5,
      senderType: "client",
      senderId: 2,
      senderName: "João Santos",
      recipientId: 1,
      recipientName: "Dr. Djair Rota",
      message: "Quando será a próxima audiência?",
      createdAt: new Date("2024-12-02T15:30:00"),
      isRead: false,
    },
  ],
};

export default function MensagensPage() {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [selectedClient, setSelectedClient] = useState<number | null>(1);
  const [messages, setMessages] = useState<Message[]>(mockMessages[1] || []);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const userName = localStorage.getItem("user_name") || "Dr. Djair Rota";

  // Scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Carregar mensagens ao selecionar cliente
  useEffect(() => {
    if (selectedClient) {
      setMessages(mockMessages[selectedClient] || []);
    }
  }, [selectedClient]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedClient) {
      toast.error("Digite uma mensagem");
      return;
    }

    setLoading(true);

    // Simular envio
    setTimeout(() => {
      const client = conversations.find((c) => c.clientId === selectedClient);
      const message: Message = {
        id: messages.length + 1,
        senderType: "user",
        senderId: 1,
        senderName: userName,
        recipientId: selectedClient,
        recipientName: client?.clientName || "",
        message: newMessage,
        createdAt: new Date(),
        isRead: false,
      };

      setMessages([...messages, message]);
      setNewMessage("");
      setLoading(false);
      toast.success("Mensagem enviada!");

      // Atualizar última mensagem na lista de conversas
      setConversations((prev) =>
        prev.map((conv) =>
          conv.clientId === selectedClient
            ? { ...conv, lastMessage: newMessage, lastMessageTime: new Date() }
            : conv
        )
      );
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedConversation = conversations.find((c) => c.clientId === selectedClient);

  return (
    <DashboardLayout>
      <div className="flex h-screen bg-slate-50">
        {/* Sidebar - Lista de Conversas */}
        <div className="w-80 bg-white border-r border-slate-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <MessageCircle className="h-6 w-6 text-blue-600" />
              <h2 className="text-lg font-semibold text-slate-900">Mensagens</h2>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Lista de Conversas */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conv) => (
              <div
                key={conv.clientId}
                onClick={() => setSelectedClient(conv.clientId)}
                className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 ${
                  selectedClient === conv.clientId ? "bg-blue-50 border-l-4 border-l-blue-600" : ""
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <span className="font-semibold text-slate-900">{conv.clientName}</span>
                  {conv.unreadCount > 0 && (
                    <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-600 truncate">{conv.lastMessage}</p>
                <span className="text-xs text-slate-400 mt-1 block">
                  {conv.lastMessageTime.toLocaleString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Área de Chat */}
        <div className="flex-1 flex flex-col">
          {selectedClient ? (
            <>
              {/* Header do Chat */}
              <div className="bg-white border-b border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{selectedConversation?.clientName}</h3>
                    <p className="text-xs text-slate-500">Online</p>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.senderType === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] ${
                        msg.senderType === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-white border border-slate-200 text-slate-900"
                      } rounded-lg p-4 shadow-sm`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {msg.senderType === "client" && (
                          <User className="h-4 w-4 text-slate-600" />
                        )}
                        <span className={`text-xs font-semibold ${msg.senderType === "user" ? "text-blue-100" : "text-slate-600"}`}>
                          {msg.senderName}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                      <span className={`text-xs mt-2 block ${msg.senderType === "user" ? "text-blue-100" : "text-slate-500"}`}>
                        {msg.createdAt.toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="bg-white border-t border-slate-200 p-4">
                <Card className="p-4">
                  <div className="flex gap-3">
                    <Input
                      placeholder="Digite sua mensagem..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={loading}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={loading || !newMessage.trim()}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Enviar
                    </Button>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Pressione Enter para enviar • Shift+Enter para nova linha
                  </p>
                </Card>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">Selecione uma conversa para começar</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
