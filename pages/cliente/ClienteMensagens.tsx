import { useState, useEffect, useRef } from "react";
import ClienteDashboardLayout from "@/components/ClienteDashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, MessageCircle, User, File, Download } from "lucide-react";
import { toast } from "sonner";
import { useSocket } from "@/hooks/useSocket";
import FileUpload from "@/components/FileUpload";

interface Message {
  id: number;
  senderType: "client" | "user";
  senderId: number;
  senderName: string;
  recipientId: number;
  recipientName: string;
  message: string;
  attachments?: string[];
  createdAt: Date;
  isRead: boolean;
}

// Mock de mensagens (em produção, virá do banco)
const mockMessages: Message[] = [
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
    message: "Claro! Seu processo está em fase de análise. Tivemos uma movimentação importante ontem. Vou enviar os detalhes por e-mail também.",
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
];

export default function ClienteMensagens() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const clientName = localStorage.getItem("cliente_name") || "Cliente";
  const clientId = 1; // Em produção, vir do localStorage
  const { socket, connected, sendMessage } = useSocket(clientId, "client");

  // Escutar novas mensagens via WebSocket
  useEffect(() => {
    if (!socket) return;

    socket.on("new_message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("new_message");
    };
  }, [socket]);

  // Scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() && attachments.length === 0) {
      toast.error("Digite uma mensagem ou anexe um arquivo");
      return;
    }

    if (!connected) {
      toast.error("Desconectado do servidor");
      return;
    }

    setLoading(true);

    try {
      sendMessage({
        senderType: "client",
        senderId: clientId,
        senderName: clientName,
        recipientId: 1,
        recipientName: "Dr. Djair Rota",
        message: newMessage,
        attachments: attachments.length > 0 ? attachments : undefined,
      });

      setNewMessage("");
      setAttachments([]);
      toast.success("Mensagem enviada!");
    } catch (error) {
      toast.error("Erro ao enviar mensagem");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUploaded = (fileUrl: string, fileName: string) => {
    setAttachments((prev) => [...prev, fileUrl]);
    toast.success(`Arquivo anexado: ${fileName}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <ClienteDashboardLayout>
      <div className="flex flex-col h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <MessageCircle className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-serif text-slate-900">Mensagens</h1>
              <p className="text-sm text-slate-600">Converse com seu advogado</p>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.senderType === "client" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] ${
                    msg.senderType === "client"
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-slate-200 text-slate-900"
                  } rounded-lg p-4 shadow-sm`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {msg.senderType === "user" && (
                      <User className="h-4 w-4 text-slate-600" />
                    )}
                    <span className={`text-xs font-semibold ${msg.senderType === "client" ? "text-blue-100" : "text-slate-600"}`}>
                      {msg.senderName}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {msg.attachments.map((att, idx) => (
                        <a
                          key={idx}
                          href={att}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-2 text-xs ${msg.senderType === "client" ? "text-blue-100" : "text-blue-600"} hover:underline`}
                        >
                          <File className="h-3 w-3" />
                          Anexo {idx + 1}
                          <Download className="h-3 w-3" />
                        </a>
                      ))}
                    </div>
                  )}
                  <span className={`text-xs mt-2 block ${msg.senderType === "client" ? "text-blue-100" : "text-slate-500"}`}>
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
              {attachments.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {attachments.map((att, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-lg text-sm">
                      <File className="h-4 w-4 text-blue-600" />
                      <span>Anexo {idx + 1}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-3">
                <FileUpload onFileUploaded={handleFileUploaded} disabled={loading} />
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
                  disabled={loading || (!newMessage.trim() && attachments.length === 0)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Enviar
                </Button>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {connected ? "✅ Conectado" : "❌ Desconectado"} • Pressione Enter para enviar
              </p>
            </Card>
          </div>
        </div>
      </div>
    </ClienteDashboardLayout>
  );
}
