import DashboardLayout from "@/components/DashboardLayout";
import { mockHearings } from "@/data/mockData";
import { generateHearingsReport } from "@/lib/pdfGenerator";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, MapPin, FileText, CheckCircle2, Clock, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import FormModal from "@/components/FormModal";
import HearingForm from "@/components/HearingForm";
import { canPerformCriticalOperation, logAuditAction } from "@/lib/permissions";
import { toast } from "sonner";

export default function AudienciasPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedHearing, setSelectedHearing] = useState<any>(null);
  
  const upcomingHearings = mockHearings.filter(h => !h.completed);
  const completedHearings = mockHearings.filter(h => h.completed);

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-serif text-slate-800 mb-2">Audiências</h1>
              <p className="text-slate-600">
                {upcomingHearings.length} próximas • {completedHearings.length} concluídas
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => generateHearingsReport(mockHearings)}
              >
                <FileText className="h-4 w-4 mr-2" />
                Exportar PDF
              </Button>
              <Button 
                className="bg-slate-800 hover:bg-slate-900"
                onClick={() => {
                  setSelectedHearing(null);
                  setModalOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Agendar Audiência
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Hearings */}
          <div>
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Próximas ({upcomingHearings.length})
            </h2>
            <div className="space-y-4">
              {upcomingHearings.map((hearing) => (
                <Card key={hearing.id} className="p-6 hover:shadow-md transition-shadow border-l-4 border-l-blue-600">
                  <div className="flex items-start gap-4">
                    <div className="text-center px-3 py-2 bg-blue-50 rounded border border-blue-200 min-w-[70px]">
                      <span className="block text-xs font-bold text-blue-600 uppercase">
                        {hearing.date.toLocaleDateString("pt-BR", { month: "short" })}
                      </span>
                      <span className="block text-2xl font-bold text-blue-800">
                        {hearing.date.getDate()}
                      </span>
                      <span className="block text-xs text-blue-600">
                        {hearing.date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-800 mb-2">{hearing.caseTitle}</h3>
                      <div className="space-y-1 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span>{hearing.caseNumber}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{hearing.location}</span>
                        </div>
                        {hearing.notes && (
                          <p className="text-xs text-slate-500 mt-2 italic">{hearing.notes}</p>
                        )}
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedHearing(hearing);
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
                              if (confirm(`Deseja excluir a audiência de ${hearing.caseNumber}?`)) {
                                logAuditAction("excluir", "audiencia", hearing.id, hearing.caseNumber);
                                toast.success("Audiência excluída com sucesso");
                              }
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Completed Hearings */}
          <div>
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Concluídas ({completedHearings.length})
            </h2>
            <div className="space-y-4">
              {completedHearings.map((hearing) => (
                <Card key={hearing.id} className="p-6 bg-slate-50 border-l-4 border-l-green-600">
                  <div className="flex items-start gap-4">
                    <div className="text-center px-3 py-2 bg-green-50 rounded border border-green-200 min-w-[70px]">
                      <span className="block text-xs font-bold text-green-600 uppercase">
                        {hearing.date.toLocaleDateString("pt-BR", { month: "short" })}
                      </span>
                      <span className="block text-2xl font-bold text-green-800">
                        {hearing.date.getDate()}
                      </span>
                      <span className="block text-xs text-green-600">
                        {hearing.date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-700 mb-2">{hearing.caseTitle}</h3>
                      <div className="space-y-1 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span>{hearing.caseNumber}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{hearing.location}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="mt-3 text-slate-600">
                        Ver Relatório
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      <FormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={selectedHearing ? "Editar Audiência" : "Agendar Audiência"}
        description={selectedHearing ? "Atualize os dados da audiência" : "Preencha os dados da nova audiência"}
      >
        <HearingForm
          hearing={selectedHearing}
          onSuccess={() => {
            setModalOpen(false);
            setSelectedHearing(null);
          }}
          onCancel={() => {
            setModalOpen(false);
            setSelectedHearing(null);
          }}
        />
      </FormModal>
    </DashboardLayout>
  );
}
