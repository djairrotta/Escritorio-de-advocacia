import { useState, useMemo } from "react";
import { Link } from "wouter";
import { mockLegalCases, mockClients } from "@/data/mockData";
import { generateProcessReport } from "@/lib/pdfGenerator";
import type { LegalCase } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Search, Plus, FileText, Calendar, User, Building2, Edit, Trash2 } from "lucide-react";
import FormModal from "@/components/FormModal";
import ProcessForm from "@/components/ProcessForm";
import { canPerformCriticalOperation, logAuditAction } from "@/lib/permissions";
import { toast } from "sonner";
import { notifyProcessUpdate } from "@/lib/notificationService";

import DashboardLayout from "@/components/DashboardLayout";

export default function ProcessosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [areaFilter, setAreaFilter] = useState<string>("todas");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState<any>(null);

  // Filter and search logic
  const filteredCases = useMemo(() => {
    return mockLegalCases.filter((legalCase) => {
      const matchesSearch =
        legalCase.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        legalCase.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        legalCase.client.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "todos" || legalCase.status === statusFilter;
      const matchesArea = areaFilter === "todas" || legalCase.area === areaFilter;

      return matchesSearch && matchesStatus && matchesArea;
    });
  }, [searchTerm, statusFilter, areaFilter]);

  const getStatusBadge = (status: LegalCase["status"]) => {
    const styles = {
      ativo: "bg-green-100 text-green-800 border-green-200",
      arquivado: "bg-gray-100 text-gray-800 border-gray-200",
      concluído: "bg-blue-100 text-blue-800 border-blue-200",
    };
    const labels = {
      ativo: "Ativo",
      arquivado: "Arquivado",
      concluído: "Concluído",
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestão de Processos</h1>
              <p className="text-sm text-gray-500 mt-1">{filteredCases.length} processos encontrados</p>
            </div>
            <div className="flex gap-3">
              <Button 
                className="bg-slate-800 hover:bg-slate-900"
                onClick={() => {
                  setSelectedProcess(null);
                  setModalOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Processo
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por número, título ou cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="arquivado">Arquivado</SelectItem>
                <SelectItem value="concluído">Concluído</SelectItem>
              </SelectContent>
            </Select>
            <Select value={areaFilter} onValueChange={setAreaFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Área" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as Áreas</SelectItem>
                <SelectItem value="Cível">Cível</SelectItem>
                <SelectItem value="Trabalhista">Trabalhista</SelectItem>
                <SelectItem value="Família e Sucessões">Família e Sucessões</SelectItem>
                <SelectItem value="Empresarial">Empresarial</SelectItem>
                <SelectItem value="Imobiliário">Imobiliário</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>
      </div>

      {/* Cases List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="space-y-4">
          {filteredCases.length === 0 ? (
            <Card className="p-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum processo encontrado</h3>
              <p className="text-gray-500">Tente ajustar os filtros ou criar um novo processo.</p>
            </Card>
          ) : (
            filteredCases.map((legalCase) => (
              <Card key={legalCase.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{legalCase.title}</h3>
                      {getStatusBadge(legalCase.status)}
                    </div>
                    <Link href={`/advogados/processos/${legalCase.id}`}>
                      <p className="text-sm text-blue-600 hover:text-blue-800 hover:underline mb-4 cursor-pointer">{legalCase.caseNumber}</p>
                    </Link>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <User className="h-4 w-4" />
                        <span><strong>Cliente:</strong> {legalCase.client.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <FileText className="h-4 w-4" />
                        <span><strong>Área:</strong> {legalCase.area}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Building2 className="h-4 w-4" />
                        <span><strong>Tribunal:</strong> {legalCase.court}</span>
                      </div>
                    </div>

                    {legalCase.description && (
                      <p className="text-sm text-gray-600 mt-4 line-clamp-2">{legalCase.description}</p>
                    )}

                    <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Criado em {new Date(legalCase.createdAt).toLocaleDateString("pt-BR")}
                      </span>
                      <span>•</span>
                      <span>Responsável: {legalCase.assignedToId || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="ml-6 flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        const client = mockClients.find(c => c.id === legalCase.clientId);
                        generateProcessReport(legalCase, client);
                      }}
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      PDF
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedProcess(legalCase);
                        setModalOpen(true);
                      }}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Editar
                    </Button>
                    {canPerformCriticalOperation() && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => {
                          if (confirm(`Deseja excluir o processo ${legalCase.caseNumber}?`)) {
                            logAuditAction("excluir", "processo", legalCase.id, legalCase.caseNumber);
                            toast.success("Processo excluído com sucesso");
                          }
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      <FormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={selectedProcess ? "Editar Processo" : "Novo Processo"}
        description={selectedProcess ? "Atualize os dados do processo" : "Preencha os dados do novo processo"}
      >
        <ProcessForm
          process={selectedProcess}
          onSuccess={() => {
            setModalOpen(false);
            setSelectedProcess(null);
          }}
          onCancel={() => {
            setModalOpen(false);
            setSelectedProcess(null);
          }}
        />
      </FormModal>
    </div>
    </DashboardLayout>
  );
}
