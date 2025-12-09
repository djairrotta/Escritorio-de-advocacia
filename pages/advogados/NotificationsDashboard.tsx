import { useState, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Mail, MessageCircle, CheckCircle, XCircle, Clock, Search, TrendingUp } from "lucide-react";

// Mock de notificações (em produção, virá do banco)
const mockNotifications = [
  {
    id: 1,
    recipientName: "Maria Silva",
    recipientEmail: "cliente@exemplo.com",
    recipientPhone: "(19) 99999-3333",
    type: "email" as const,
    subject: "Status do Processo Atualizado",
    message: "O processo 1234567-89.2024.8.26.0000 foi atualizado.",
    status: "sent" as const,
    sentAt: new Date("2024-12-03T10:30:00"),
    createdAt: new Date("2024-12-03T10:29:00"),
  },
  {
    id: 2,
    recipientName: "Maria Silva",
    recipientPhone: "(19) 99999-3333",
    type: "whatsapp" as const,
    subject: "Status do Processo Atualizado",
    message: "O processo 1234567-89.2024.8.26.0000 foi atualizado.",
    status: "sent" as const,
    sentAt: new Date("2024-12-03T10:30:00"),
    createdAt: new Date("2024-12-03T10:29:00"),
  },
  {
    id: 3,
    recipientName: "João Santos",
    recipientEmail: "joao@exemplo.com",
    type: "email" as const,
    subject: "Audiência Agendada",
    message: "Foi agendada uma audiência para o processo 9876543-21.2024.8.26.0000.",
    status: "failed" as const,
    errorMessage: "Erro ao conectar com servidor SMTP",
    createdAt: new Date("2024-12-02T14:15:00"),
  },
  {
    id: 4,
    recipientName: "Ana Costa",
    recipientEmail: "ana@exemplo.com",
    type: "email" as const,
    subject: "Prazo Próximo - Atenção Necessária",
    message: "Há um prazo importante se aproximando no processo 5555555-55.2024.8.26.0000.",
    status: "sent" as const,
    sentAt: new Date("2024-12-01T09:00:00"),
    createdAt: new Date("2024-12-01T08:59:00"),
  },
  {
    id: 5,
    recipientName: "Pedro Lima",
    recipientPhone: "(19) 99999-5555",
    type: "whatsapp" as const,
    subject: "Nova Movimentação no Processo",
    message: "Houve uma nova movimentação no seu processo 7777777-77.2024.8.26.0000.",
    status: "pending" as const,
    createdAt: new Date("2024-12-03T11:00:00"),
  },
];

export default function NotificationsDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("todos");
  const [statusFilter, setStatusFilter] = useState<string>("todos");

  // Filtrar notificações
  const filteredNotifications = useMemo(() => {
    return mockNotifications.filter((notif) => {
      const matchesSearch =
        notif.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notif.subject.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = typeFilter === "todos" || notif.type === typeFilter;
      const matchesStatus = statusFilter === "todos" || notif.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [searchTerm, typeFilter, statusFilter]);

  // Calcular estatísticas
  const stats = useMemo(() => {
    const total = mockNotifications.length;
    const sent = mockNotifications.filter((n) => n.status === "sent").length;
    const failed = mockNotifications.filter((n) => n.status === "failed").length;
    const pending = mockNotifications.filter((n) => n.status === "pending").length;
    const successRate = total > 0 ? ((sent / total) * 100).toFixed(1) : "0";

    return { total, sent, failed, pending, successRate };
  }, []);

  const getStatusBadge = (status: "sent" | "failed" | "pending") => {
    const styles = {
      sent: "bg-green-100 text-green-800 border-green-200",
      failed: "bg-red-100 text-red-800 border-red-200",
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    };
    const labels = {
      sent: "Enviada",
      failed: "Falhou",
      pending: "Pendente",
    };
    const icons = {
      sent: CheckCircle,
      failed: XCircle,
      pending: Clock,
    };
    const Icon = icons[status];

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
        <Icon className="h-3 w-3" />
        {labels[status]}
      </span>
    );
  };

  const getTypeIcon = (type: "email" | "whatsapp") => {
    return type === "email" ? (
      <Mail className="h-4 w-4 text-blue-600" />
    ) : (
      <MessageCircle className="h-4 w-4 text-green-600" />
    );
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Bell className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-serif text-slate-900">Dashboard de Notificações</h1>
          </div>
          <p className="text-slate-600">Histórico completo de notificações enviadas aos clientes</p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total</p>
                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              </div>
              <Bell className="h-8 w-8 text-slate-400" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Enviadas</p>
                <p className="text-2xl font-bold text-green-600">{stats.sent}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Falharam</p>
                <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-400" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
          </Card>

          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700">Taxa de Sucesso</p>
                <p className="text-2xl font-bold text-blue-900">{stats.successRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar por cliente ou assunto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Tipos</SelectItem>
                <SelectItem value="email">E-mail</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
                <SelectItem value="sent">Enviadas</SelectItem>
                <SelectItem value="failed">Falharam</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Tabela de Notificações */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Destinatário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Assunto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Data
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredNotifications.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                      Nenhuma notificação encontrada
                    </td>
                  </tr>
                ) : (
                  filteredNotifications.map((notif) => (
                    <tr key={notif.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(notif.type)}
                          <span className="text-sm font-medium text-slate-900 capitalize">
                            {notif.type}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-slate-900">{notif.recipientName}</p>
                          <p className="text-xs text-slate-500">
                            {notif.type === "email" ? notif.recipientEmail : notif.recipientPhone}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-900">{notif.subject}</p>
                        {notif.status === "failed" && notif.errorMessage && (
                          <p className="text-xs text-red-600 mt-1">Erro: {notif.errorMessage}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(notif.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900">
                          {notif.sentAt
                            ? notif.sentAt.toLocaleString("pt-BR")
                            : notif.createdAt.toLocaleString("pt-BR")}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Informações */}
        <Card className="mt-6 p-4 bg-blue-50 border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>ℹ️ Dica:</strong> As notificações são enviadas automaticamente quando há atualizações em processos. 
            Lembretes de audiências e prazos são enviados 24h antes do evento.
          </p>
        </Card>
      </div>
    </DashboardLayout>
  );
}
