import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MessageSquare, Clock, User } from "lucide-react";

export default function AtendimentoPage() {
  const mockAtendimentos = [
    { 
      id: 1, 
      client: "João Silva Oliveira", 
      subject: "Consulta sobre ação trabalhista",
      status: "aguardando",
      date: "2024-12-05T14:00:00",
      notes: "Cliente deseja saber sobre rescisão de contrato"
    },
    { 
      id: 2, 
      client: "Maria Santos Costa", 
      subject: "Acompanhamento de processo",
      status: "concluído",
      date: "2024-12-03T10:30:00",
      notes: "Atualização sobre andamento do processo de divórcio"
    },
    { 
      id: 3, 
      client: "Empresa ABC Ltda", 
      subject: "Revisão de contrato comercial",
      status: "agendado",
      date: "2024-12-10T15:00:00",
      notes: "Reunião para análise de cláusulas contratuais"
    },
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      aguardando: "bg-yellow-100 text-yellow-800 border-yellow-200",
      agendado: "bg-blue-100 text-blue-800 border-blue-200",
      concluído: "bg-green-100 text-green-800 border-green-200",
    };
    const labels = {
      aguardando: "Aguardando",
      agendado: "Agendado",
      concluído: "Concluído",
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-serif text-slate-800 mb-2">Atendimento</h1>
              <p className="text-slate-600">{mockAtendimentos.length} atendimentos registrados</p>
            </div>
            <Button className="bg-slate-800 hover:bg-slate-900">
              <Plus className="h-4 w-4 mr-2" />
              Novo Atendimento
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {mockAtendimentos.map((atendimento) => (
            <Card key={atendimento.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-slate-800">{atendimento.subject}</h3>
                    {getStatusBadge(atendimento.status)}
                  </div>
                  
                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span><strong>Cliente:</strong> {atendimento.client}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span><strong>Data:</strong> {new Date(atendimento.date).toLocaleString("pt-BR")}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MessageSquare className="h-4 w-4 mt-0.5" />
                      <span><strong>Observações:</strong> {atendimento.notes}</span>
                    </div>
                  </div>
                </div>

                <Button variant="outline" size="sm" className="ml-4">
                  Ver Detalhes
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
