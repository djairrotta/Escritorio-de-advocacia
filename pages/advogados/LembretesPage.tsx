import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Clock, Mail, MessageCircle, CheckCircle, AlertCircle } from "lucide-react";
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

export default function LembretesPage() {
  const [upcomingAppointments, setUpcomingAppointments] = useState<TimeSlot[]>([]);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    loadUpcomingAppointments();
  }, []);

  const loadUpcomingAppointments = () => {
    const saved = localStorage.getItem("available_time_slots");
    if (!saved) return;

    const allSlots: TimeSlot[] = JSON.parse(saved);

    // Data de amanhã
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];

    // Filtrar confirmados para amanhã
    const upcoming = allSlots.filter(
      (slot) => slot.status === "confirmado" && slot.date === tomorrowStr
    );

    setUpcomingAppointments(upcoming);
  };

  const handleTestReminders = async () => {
    setTesting(true);

    // Simular envio de lembretes
    setTimeout(() => {
      toast.success(
        `${upcomingAppointments.length} lembretes seriam enviados! Verifique o console do servidor.`
      );
      setTesting(false);
    }, 2000);
  };

  const handleManualReminder = (appointment: TimeSlot) => {
    toast.info(`Lembrete manual enviado para ${appointment.clienteName}`);
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-slate-800 mb-2">
            Sistema de Lembretes Automáticos
          </h1>
          <p className="text-slate-600">
            Gerenciamento de notificações 24h antes das consultas
          </p>
        </div>

        {/* Configurações */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">9:00</p>
                  <p className="text-sm text-slate-600">Horário de Envio</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">E-mail</p>
                  <p className="text-sm text-slate-600">Notificação Principal</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">WhatsApp</p>
                  <p className="text-sm text-slate-600">Notificação Secundária</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Próximos Lembretes */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-serif">
                  Lembretes Agendados para Amanhã
                </CardTitle>
                <CardDescription>
                  Consultas que receberão notificação automática
                </CardDescription>
              </div>
              <Button
                onClick={handleTestReminders}
                disabled={testing || upcomingAppointments.length === 0}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Bell className="h-4 w-4 mr-2" />
                {testing ? "Testando..." : "Testar Envio"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum lembrete agendado para amanhã</p>
                <p className="text-sm mt-2">
                  Lembretes serão enviados automaticamente 24h antes das consultas confirmadas
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-green-100 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-800">
                            {appointment.clienteName}
                          </span>
                          <span className="text-slate-600">•</span>
                          <span className="text-slate-600">
                            {appointment.startTime} - {appointment.endTime}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mt-1">
                          Advogado: {appointment.advogadoName}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {appointment.clienteEmail}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleManualReminder(appointment)}
                    >
                      Enviar Agora
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Informações do Sistema */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-serif">Como Funciona</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-blue-100 text-blue-600 mt-1">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Verificação Diária</p>
                  <p className="text-sm text-slate-600">
                    Todos os dias às 9h, o sistema verifica agendamentos confirmados para o dia seguinte
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-green-100 text-green-600 mt-1">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Notificação por E-mail</p>
                  <p className="text-sm text-slate-600">
                    Cliente e advogado recebem e-mail com detalhes da consulta e link de confirmação
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-purple-100 text-purple-600 mt-1">
                  <MessageCircle className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Notificação por WhatsApp</p>
                  <p className="text-sm text-slate-600">
                    Se configurado, cliente também recebe mensagem via WhatsApp Business API
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-yellow-100 text-yellow-600 mt-1">
                  <AlertCircle className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Confirmação de Presença</p>
                  <p className="text-sm text-slate-600">
                    Cliente pode confirmar presença respondendo o e-mail ou clicando no link do WhatsApp
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
