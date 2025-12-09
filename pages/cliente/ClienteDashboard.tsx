import { useState, useEffect } from "react";
import ClienteDashboardLayout from "@/components/ClienteDashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, Clock, Eye, Download } from "lucide-react";
import { mockLegalCases } from "@/data/mockData";

export default function ClienteDashboard() {
  const [clienteProcessos, setClienteProcessos] = useState<any[]>([]);

  useEffect(() => {
    // Simular busca de processos do cliente logado
    // Na implementação real, filtrar por cliente.id
    const clienteAuth = localStorage.getItem("clienteAuth");
    if (clienteAuth) {
      const cliente = JSON.parse(clienteAuth);
      // Pegar apenas processos do cliente (mockado: pegar os 3 primeiros)
      const processos = mockLegalCases.slice(0, 3);
      setClienteProcessos(processos);
    }
  }, []);

  const getStatusColor = (status: string) => {
    const colors = {
      ativo: "bg-blue-100 text-blue-800",
      concluido: "bg-green-100 text-green-800",
      arquivado: "bg-gray-100 text-gray-800",
    };
    return colors[status as keyof typeof colors] || colors.ativo;
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      ativo: "Em Andamento",
      concluido: "Concluído",
      arquivado: "Arquivado",
    };
    return labels[status as keyof typeof labels] || status;
  };

  return (
    <ClienteDashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-slate-900 mb-2">Meus Processos</h1>
          <p className="text-slate-600">Acompanhe o andamento dos seus processos jurídicos</p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Processos Ativos</p>
                <p className="text-3xl font-bold text-slate-900">
                  {clienteProcessos.filter(p => p.status === "ativo").length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Próximas Audiências</p>
                <p className="text-3xl font-bold text-slate-900">2</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Documentos</p>
                <p className="text-3xl font-bold text-slate-900">12</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Lista de Processos */}
        <div className="space-y-6">
          <h2 className="text-xl font-serif text-slate-900">Processos em Andamento</h2>
          
          {clienteProcessos.length === 0 ? (
            <Card className="p-12 text-center">
              <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Nenhum processo encontrado</h3>
              <p className="text-slate-500 mb-6">Você ainda não possui processos cadastrados.</p>
              <a
                href="https://wa.me/551936564903?text=Gostaria%20de%20iniciar%20um%20processo"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button>Falar com Advogado</Button>
              </a>
            </Card>
          ) : (
            clienteProcessos.map((processo) => (
              <Card key={processo.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-serif text-slate-900">{processo.title}</h3>
                      <Badge className={getStatusColor(processo.status)}>
                        {getStatusLabel(processo.status)}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-slate-600 mb-4">{processo.caseNumber}</p>
                    
                    <p className="text-slate-700 mb-4 line-clamp-2">{processo.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-slate-600">
                        <FileText className="h-4 w-4" />
                        <span><strong>Área:</strong> {processo.area}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Clock className="h-4 w-4" />
                        <span><strong>Início:</strong> {processo.createdAt.toLocaleDateString("pt-BR")}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 lg:ml-6">
                    <Button variant="outline" size="sm" className="w-full lg:w-auto">
                      <Eye className="mr-2 h-4 w-4" />
                      Ver Detalhes
                    </Button>
                    <Button variant="outline" size="sm" className="w-full lg:w-auto">
                      <Download className="mr-2 h-4 w-4" />
                      Documentos
                    </Button>
                  </div>
                </div>

                {/* Timeline Resumida */}
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <h4 className="text-sm font-semibold text-slate-700 mb-3">Últimas Movimentações</h4>
                  <div className="space-y-2">
                    <div className="flex items-start gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
                      <div>
                        <p className="text-slate-900 font-medium">Audiência agendada</p>
                        <p className="text-slate-500 text-xs">15/12/2024 às 14h00</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5"></div>
                      <div>
                        <p className="text-slate-900 font-medium">Documento anexado</p>
                        <p className="text-slate-500 text-xs">10/12/2024</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Próximas Audiências */}
        <div className="mt-8">
          <h2 className="text-xl font-serif text-slate-900 mb-6">Próximas Audiências</h2>
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4 pb-4 border-b border-slate-200">
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-1">Audiência de Conciliação</h3>
                  <p className="text-sm text-slate-600 mb-2">Processo: 1234567-89.2024.8.26.0000</p>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      15/12/2024
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      14:00
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Ver Detalhes
                </Button>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-1">Audiência de Instrução</h3>
                  <p className="text-sm text-slate-600 mb-2">Processo: 9876543-21.2024.8.26.0000</p>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      20/12/2024
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      10:00
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Ver Detalhes
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </ClienteDashboardLayout>
  );
}
