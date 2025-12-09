import { useRoute } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, FileText, User, MapPin, Clock, Plus } from "lucide-react";
import { mockLegalCases } from "@/data/mockData";
import { Link } from "wouter";

export default function ProcessDetailPage() {
  const [, params] = useRoute("/advogados/processos/:id");
  const processId = params?.id ? parseInt(params.id) : null;
  
  const process = mockLegalCases.find(c => c.id === processId);

  if (!process) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center">
          <h2 className="text-2xl font-serif text-slate-800 mb-4">Processo não encontrado</h2>
          <Link href="/advogados/processos">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Processos
            </Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const getStatusColor = (status: string) => {
    const colors = {
      ativo: "bg-blue-100 text-blue-800",
      concluido: "bg-green-100 text-green-800",
      arquivado: "bg-gray-100 text-gray-800",
    };
    return colors[status as keyof typeof colors] || colors.ativo;
  };

  // Timeline de movimentações (mockado)
  const timeline = [
    {
      id: 1,
      date: new Date(2024, 11, 1),
      title: "Processo Iniciado",
      description: "Petição inicial protocolada no sistema.",
      type: "inicio",
    },
    {
      id: 2,
      date: new Date(2024, 11, 5),
      title: "Audiência Agendada",
      description: "Audiência de conciliação marcada para 15/12/2024 às 14h.",
      type: "audiencia",
    },
    {
      id: 3,
      date: new Date(2024, 11, 10),
      title: "Documento Anexado",
      description: "Contrato social da empresa anexado aos autos.",
      type: "documento",
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-6">
          <Link href="/advogados/processos">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </Link>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-serif text-slate-900 mb-2">{process.title}</h1>
              <p className="text-slate-600">{process.caseNumber}</p>
            </div>
            <Badge className={getStatusColor(process.status)}>
              {process.status.toUpperCase()}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informações Principais */}
          <div className="lg:col-span-2 space-y-6">
            {/* Descrição */}
            <Card className="p-6">
              <h2 className="text-xl font-serif text-slate-800 mb-4">Descrição do Caso</h2>
              <p className="text-slate-700">{process.description}</p>
            </Card>

            {/* Timeline */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-serif text-slate-800">Timeline de Movimentações</h2>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Movimentação
                </Button>
              </div>

              <div className="space-y-6">
                {timeline.map((item, index) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        item.type === "inicio" ? "bg-blue-100 text-blue-600" :
                        item.type === "audiencia" ? "bg-purple-100 text-purple-600" :
                        "bg-green-100 text-green-600"
                      }`}>
                        {item.type === "inicio" && <FileText className="h-5 w-5" />}
                        {item.type === "audiencia" && <Calendar className="h-5 w-5" />}
                        {item.type === "documento" && <FileText className="h-5 w-5" />}
                      </div>
                      {index < timeline.length - 1 && (
                        <div className="w-0.5 h-16 bg-slate-200 mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-800">{item.title}</h3>
                        <span className="text-sm text-slate-500">
                          {item.date.toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                      <p className="text-slate-600 text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Informações do Cliente */}
            <Card className="p-6">
              <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />
                Cliente
              </h3>
              <div className="space-y-2 text-sm">
                <p className="font-medium text-slate-900">{process.client.name}</p>
                <p className="text-slate-600">{process.client.email}</p>
                <p className="text-slate-600">{process.client.phone}</p>
              </div>
            </Card>

            {/* Advogado Responsável */}
            <Card className="p-6">
              <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />
                Advogado Responsável
              </h3>
              <div className="space-y-2 text-sm">
                <p className="font-medium text-slate-900">{process.assignedTo.name}</p>
                <p className="text-slate-600">{process.assignedTo.email}</p>
              </div>
            </Card>

            {/* Informações Adicionais */}
            <Card className="p-6">
              <h3 className="font-semibold text-slate-800 mb-4">Detalhes</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 text-slate-500 mt-0.5" />
                  <div>
                    <p className="text-slate-600">Área</p>
                    <p className="font-medium text-slate-900">{process.area}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-slate-500 mt-0.5" />
                  <div>
                    <p className="text-slate-600">Data de Abertura</p>
                    <p className="font-medium text-slate-900">
                      {process.createdAt.toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
                {process.court && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-slate-500 mt-0.5" />
                    <div>
                      <p className="text-slate-600">Vara/Tribunal</p>
                      <p className="font-medium text-slate-900">{process.court}</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Ações Rápidas */}
            <Card className="p-6">
              <h3 className="font-semibold text-slate-800 mb-4">Ações Rápidas</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  Agendar Audiência
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Anexar Documento
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
