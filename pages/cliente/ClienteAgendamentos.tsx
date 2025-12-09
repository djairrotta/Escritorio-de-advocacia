import { useState, useEffect } from "react";
import ClienteDashboardLayout from "@/components/ClienteDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  advogadoId: string;
  advogadoName: string;
  status: "disponivel" | "solicitado" | "confirmado";
  clienteName?: string;
  clienteEmail?: string;
}

export default function ClienteAgendamentos() {
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [myRequests, setMyRequests] = useState<TimeSlot[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM

  const clienteData = JSON.parse(localStorage.getItem("clienteAuth") || "{}");

  // Carregar horários disponíveis
  useEffect(() => {
    loadSlots();
  }, []);

  const loadSlots = () => {
    const saved = localStorage.getItem("available_time_slots");
    if (saved) {
      const allSlots: TimeSlot[] = JSON.parse(saved);
      
      // Filtrar apenas disponíveis
      const available = allSlots.filter((slot) => slot.status === "disponivel");
      setAvailableSlots(available);

      // Filtrar minhas solicitações
      const mine = allSlots.filter(
        (slot) => 
          (slot.status === "solicitado" || slot.status === "confirmado") &&
          slot.clienteEmail === clienteData.email
      );
      setMyRequests(mine);
    }
  };

  const handleRequestSlot = (slotId: string) => {
    const saved = localStorage.getItem("available_time_slots");
    if (!saved) return;

    const allSlots: TimeSlot[] = JSON.parse(saved);
    const updated = allSlots.map((slot) =>
      slot.id === slotId
        ? {
            ...slot,
            status: "solicitado" as const,
            clienteName: clienteData.name,
            clienteEmail: clienteData.email,
          }
        : slot
    );

    localStorage.setItem("available_time_slots", JSON.stringify(updated));
    loadSlots();

    toast.success("Solicitação enviada! Aguarde a confirmação do escritório.");
  };

  const handleCancelRequest = (slotId: string) => {
    if (!confirm("Tem certeza que deseja cancelar esta solicitação?")) return;

    const saved = localStorage.getItem("available_time_slots");
    if (!saved) return;

    const allSlots: TimeSlot[] = JSON.parse(saved);
    const updated = allSlots.map((slot) =>
      slot.id === slotId
        ? {
            ...slot,
            status: "disponivel" as const,
            clienteName: undefined,
            clienteEmail: undefined,
          }
        : slot
    );

    localStorage.setItem("available_time_slots", JSON.stringify(updated));
    loadSlots();

    toast.success("Solicitação cancelada");
  };

  // Filtrar por mês selecionado
  const filteredAvailable = availableSlots.filter((slot) => slot.date.startsWith(selectedMonth));
  const solicitadosSlots = myRequests.filter((s) => s.status === "solicitado");
  const confirmadosSlots = myRequests.filter((s) => s.status === "confirmado");

  return (
    <ClienteDashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-slate-900 mb-2">Agendamentos</h1>
          <p className="text-slate-600">Solicite horários disponíveis para consultas</p>
        </div>

        {/* Minhas Solicitações Pendentes */}
        {solicitadosSlots.length > 0 && (
          <Card className="mb-8 border-yellow-300">
            <CardHeader>
              <CardTitle className="text-xl font-serif text-yellow-700">Aguardando Confirmação</CardTitle>
              <CardDescription>Suas solicitações pendentes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {solicitadosSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex items-center justify-between p-4 border border-yellow-200 rounded-lg bg-yellow-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                        <AlertCircle className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-800">
                            {new Date(slot.date + "T00:00:00").toLocaleDateString("pt-BR")}
                          </span>
                          <span className="text-slate-600">•</span>
                          <span className="text-slate-600">
                            {slot.startTime} - {slot.endTime}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mt-1">
                          Advogado: {slot.advogadoName}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCancelRequest(slot.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Cancelar
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Agendamentos Confirmados */}
        {confirmadosSlots.length > 0 && (
          <Card className="mb-8 border-green-300">
            <CardHeader>
              <CardTitle className="text-xl font-serif text-green-700">Consultas Confirmadas</CardTitle>
              <CardDescription>Seus próximos agendamentos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {confirmadosSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex items-center justify-between p-4 border border-green-200 rounded-lg bg-green-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-green-100 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-800">
                            {new Date(slot.date + "T00:00:00").toLocaleDateString("pt-BR")}
                          </span>
                          <span className="text-slate-600">•</span>
                          <span className="text-slate-600">
                            {slot.startTime} - {slot.endTime}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mt-1">
                          Advogado: {slot.advogadoName}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filtro de Mês */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <label htmlFor="month" className="text-sm font-medium text-slate-700">
                Filtrar por Mês:
              </label>
              <Input
                id="month"
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-48"
              />
            </div>
          </CardContent>
        </Card>

        {/* Horários Disponíveis */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-serif">Horários Disponíveis</CardTitle>
            <CardDescription>Selecione um horário para solicitar agendamento</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredAvailable.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum horário disponível neste mês</p>
                <p className="text-sm mt-2">Tente selecionar outro mês ou entre em contato conosco</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredAvailable.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-800">
                            {new Date(slot.date + "T00:00:00").toLocaleDateString("pt-BR")}
                          </span>
                          <span className="text-slate-600">•</span>
                          <span className="text-slate-600">
                            {slot.startTime} - {slot.endTime}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mt-1">
                          Advogado: {slot.advogadoName}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleRequestSlot(slot.id)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Solicitar
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Informações de Contato */}
        <Card className="mt-8 p-6 bg-slate-50">
          <h3 className="font-semibold text-slate-900 mb-3">Precisa de atendimento urgente?</h3>
          <p className="text-slate-600 mb-4">
            Entre em contato diretamente com nosso escritório através do WhatsApp.
          </p>
          <a
            href="https://wa.me/551936564903"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline">
              Falar no WhatsApp
            </Button>
          </a>
        </Card>
      </div>
    </ClienteDashboardLayout>
  );
}
