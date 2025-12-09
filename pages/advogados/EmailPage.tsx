import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Mail, Inbox, Send, Star, Trash2, Search, RefreshCw, 
  Paperclip, Reply, Forward, MoreVertical, Settings 
} from "lucide-react";
import { toast } from "sonner";
import { canConfigureEmail } from "@/lib/permissions";

interface Email {
  id: number;
  from: string;
  to: string;
  subject: string;
  body: string;
  date: Date;
  read: boolean;
  starred: boolean;
  folder: "inbox" | "sent" | "trash";
}

// Mock de e-mails
const mockEmails: Email[] = [
  {
    id: 1,
    from: "cliente@exemplo.com",
    to: "djair@djairrota.com.br",
    subject: "Consulta sobre processo trabalhista",
    body: "Bom dia, Dr. Djair. Gostaria de agendar uma consulta para discutir meu caso trabalhista...",
    date: new Date("2024-12-03T10:30:00"),
    read: false,
    starred: true,
    folder: "inbox",
  },
  {
    id: 2,
    from: "tribunal@tjsp.jus.br",
    to: "djair@djairrota.com.br",
    subject: "Intimação - Processo 0001234-56.2024",
    body: "Fica Vossa Senhoria intimado para apresentar contrarrazões no prazo de 15 dias...",
    date: new Date("2024-12-02T14:20:00"),
    read: true,
    starred: false,
    folder: "inbox",
  },
  {
    id: 3,
    from: "djair@djairrota.com.br",
    to: "cliente@exemplo.com",
    subject: "Re: Consulta sobre processo trabalhista",
    body: "Prezado cliente, agradeço o contato. Podemos agendar para quinta-feira às 14h...",
    date: new Date("2024-12-01T16:45:00"),
    read: true,
    starred: false,
    folder: "sent",
  },
];

export default function EmailPage() {
  const [emails, setEmails] = useState<Email[]>(mockEmails);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [currentFolder, setCurrentFolder] = useState<"inbox" | "sent" | "trash">("inbox");
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [composeData, setComposeData] = useState({
    to: "",
    subject: "",
    body: "",
  });

  const filteredEmails = emails
    .filter((email) => email.folder === currentFolder)
    .filter((email) =>
      email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.from.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const unreadCount = emails.filter((e) => e.folder === "inbox" && !e.read).length;

  const handleSendEmail = () => {
    if (!composeData.to || !composeData.subject) {
      toast.error("Preencha destinatário e assunto");
      return;
    }

    const newEmail: Email = {
      id: emails.length + 1,
      from: "djair@djairrota.com.br",
      to: composeData.to,
      subject: composeData.subject,
      body: composeData.body,
      date: new Date(),
      read: true,
      starred: false,
      folder: "sent",
    };

    setEmails([...emails, newEmail]);
    setComposeData({ to: "", subject: "", body: "" });
    setIsComposeOpen(false);
    toast.success("E-mail enviado com sucesso!");
  };

  const handleMarkAsRead = (emailId: number) => {
    setEmails(emails.map((e) => (e.id === emailId ? { ...e, read: true } : e)));
  };

  const handleToggleStar = (emailId: number) => {
    setEmails(emails.map((e) => (e.id === emailId ? { ...e, starred: !e.starred } : e)));
  };

  const handleDelete = (emailId: number) => {
    setEmails(emails.map((e) => (e.id === emailId ? { ...e, folder: "trash" as const } : e)));
    setSelectedEmail(null);
    toast.success("E-mail movido para lixeira");
  };

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-4rem)] bg-slate-50">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-slate-200 flex flex-col">
          <div className="p-4 border-b border-slate-200">
            <Button onClick={() => setIsComposeOpen(true)} className="w-full bg-blue-600 hover:bg-blue-700">
              <Mail className="h-4 w-4 mr-2" />
              Novo E-mail
            </Button>
          </div>

          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setCurrentFolder("inbox")}
                  className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-colors ${
                    currentFolder === "inbox"
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Inbox className="h-5 w-5" />
                    <span>Caixa de Entrada</span>
                  </div>
                  {unreadCount > 0 && (
                    <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentFolder("sent")}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    currentFolder === "sent"
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <Send className="h-5 w-5" />
                  <span>Enviados</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentFolder("trash")}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    currentFolder === "trash"
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <Trash2 className="h-5 w-5" />
                  <span>Lixeira</span>
                </button>
              </li>
            </ul>
          </nav>

          {canConfigureEmail() && (
            <div className="p-4 border-t border-slate-200">
              <Button variant="outline" className="w-full">
                <Settings className="h-4 w-4 mr-2" />
                Configurar Contas
              </Button>
            </div>
          )}
        </div>

        {/* Lista de E-mails */}
        <div className="w-96 bg-white border-r border-slate-200 flex flex-col">
          <div className="p-4 border-b border-slate-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar e-mails..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredEmails.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-500">
                <Mail className="h-12 w-12 mb-3" />
                <p>Nenhum e-mail encontrado</p>
              </div>
            ) : (
              <ul>
                {filteredEmails.map((email) => (
                  <li
                    key={email.id}
                    onClick={() => {
                      setSelectedEmail(email);
                      handleMarkAsRead(email.id);
                    }}
                    className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 ${
                      selectedEmail?.id === email.id ? "bg-blue-50" : ""
                    } ${!email.read ? "bg-blue-50/30" : ""}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className={`text-sm ${!email.read ? "font-bold text-slate-900" : "text-slate-700"}`}>
                        {currentFolder === "sent" ? email.to : email.from}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleStar(email.id);
                          }}
                        >
                          <Star
                            className={`h-4 w-4 ${email.starred ? "fill-yellow-400 text-yellow-400" : "text-slate-400"}`}
                          />
                        </button>
                        <span className="text-xs text-slate-500">
                          {email.date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                        </span>
                      </div>
                    </div>
                    <h4 className={`text-sm mb-1 ${!email.read ? "font-semibold text-slate-900" : "text-slate-800"}`}>
                      {email.subject}
                    </h4>
                    <p className="text-xs text-slate-600 truncate">{email.body}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Visualização do E-mail */}
        <div className="flex-1 bg-white flex flex-col">
          {selectedEmail ? (
            <>
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-xl font-semibold text-slate-900">{selectedEmail.subject}</h2>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Reply className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Forward className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(selectedEmail.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    {selectedEmail.from.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{selectedEmail.from}</p>
                    <p className="text-xs text-slate-500">
                      para {selectedEmail.to} •{" "}
                      {selectedEmail.date.toLocaleString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex-1 p-6 overflow-y-auto">
                <p className="text-slate-700 whitespace-pre-wrap">{selectedEmail.body}</p>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500">
              <div className="text-center">
                <Mail className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                <p>Selecione um e-mail para visualizar</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Composição */}
      <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Novo E-mail</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Input
                placeholder="Para:"
                value={composeData.to}
                onChange={(e) => setComposeData({ ...composeData, to: e.target.value })}
              />
            </div>
            <div>
              <Input
                placeholder="Assunto:"
                value={composeData.subject}
                onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })}
              />
            </div>
            <div>
              <Textarea
                placeholder="Escreva sua mensagem..."
                value={composeData.body}
                onChange={(e) => setComposeData({ ...composeData, body: e.target.value })}
                rows={10}
              />
            </div>
            <div className="flex items-center justify-between">
              <Button variant="outline">
                <Paperclip className="h-4 w-4 mr-2" />
                Anexar Arquivo
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsComposeOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSendEmail} className="bg-blue-600 hover:bg-blue-700">
                  <Send className="h-4 w-4 mr-2" />
                  Enviar
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
