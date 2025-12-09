import { useState, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import EventForm from "@/components/EventForm";
import EventDetailsModal from "@/components/EventDetailsModal";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, Download, Share2 } from "lucide-react";
import { mockHearings } from "@/data/mockData";
import { toast } from "sonner";
import type { EventClickArg, DateSelectArg } from "@fullcalendar/core";

export default function CalendarioPage() {
  const calendarRef = useRef<FullCalendar>(null);
  const [currentView, setCurrentView] = useState("dayGridMonth");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);

  // Converter dados mockados para eventos do calendário
  const initialEvents = [
    // Audiências
    ...mockHearings.map((h) => ({
      id: `hearing-${h.id}`,
      title: `🏛️ ${h.caseTitle}`,
      start: h.date,
      end: new Date(h.date.getTime() + 2 * 60 * 60 * 1000), // 2 horas de duração
      backgroundColor: h.completed ? "#10b981" : "#3b82f6",
      borderColor: h.completed ? "#059669" : "#2563eb",
      extendedProps: {
        type: "audiencia",
        location: h.location,
        caseNumber: h.caseNumber,
        completed: h.completed,
      },
    })),
    // Tarefas (exemplo)
    {
      id: "task-1",
      title: "📋 Protocolar Petição - Processo 0001234-56.2024",
      start: new Date(2024, 11, 15, 10, 0),
      backgroundColor: "#f59e0b",
      borderColor: "#d97706",
      extendedProps: {
        type: "tarefa",
      },
    },
    {
      id: "task-2",
      title: "📋 Revisar Documentos - Cliente Maria Silva",
      start: new Date(2024, 11, 18, 14, 0),
      backgroundColor: "#f59e0b",
      borderColor: "#d97706",
      extendedProps: {
        type: "tarefa",
      },
    },
    // Atendimentos (exemplo)
    {
      id: "meeting-1",
      title: "👥 Reunião com Cliente - João Santos",
      start: new Date(2024, 11, 16, 15, 0),
      end: new Date(2024, 11, 16, 16, 0),
      backgroundColor: "#8b5cf6",
      borderColor: "#7c3aed",
      extendedProps: {
        type: "atendimento",
      },
    },
    // Prazos (exemplo)
    {
      id: "deadline-1",
      title: "⚠️ PRAZO: Contestação - Processo 0007890-12.2024",
      start: new Date(2024, 11, 20),
      allDay: true,
      backgroundColor: "#ef4444",
      borderColor: "#dc2626",
      extendedProps: {
        type: "prazo",
      },
    },
  ];

  const allEvents = [...initialEvents, ...calendarEvents];

  const handleEventClick = (info: EventClickArg) => {
    const { event } = info;
    setSelectedEvent({
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      backgroundColor: event.backgroundColor,
      borderColor: event.borderColor,
      extendedProps: event.extendedProps,
    });
    setIsDetailsModalOpen(true);
  };

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    setSelectedDate(selectInfo.start);
    setIsModalOpen(true);
    selectInfo.view.calendar.unselect();
  };

  const handleEventCreated = (newEvent: any) => {
    setCalendarEvents([...calendarEvents, newEvent]);
    setIsModalOpen(false);
    setSelectedDate(undefined);
  };

  const handleEventDeleted = (eventId: string) => {
    setCalendarEvents(calendarEvents.filter(e => e.id !== eventId));
    setIsDetailsModalOpen(false);
  };

  const handleEventUpdated = (updatedEvent: any) => {
    setCalendarEvents(calendarEvents.map(e => 
      e.id === updatedEvent.id ? updatedEvent : e
    ));
    setIsDetailsModalOpen(false);
  };

  const handleExportToGoogleCalendar = () => {
    // Gera arquivo .ics para importação no Google Calendar
    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Djair Rota Advogados//NONSGML v1.0//EN\n";
    
    allEvents.forEach((event) => {
      const start = new Date(event.start);
      const end = event.end ? new Date(event.end) : new Date(start.getTime() + 60 * 60 * 1000);
      
      icsContent += "BEGIN:VEVENT\n";
      icsContent += `UID:${event.id}@djairrotta.com.br\n`;
      icsContent += `DTSTAMP:${formatICSDate(new Date())}\n`;
      icsContent += `DTSTART:${formatICSDate(start)}\n`;
      icsContent += `DTEND:${formatICSDate(end)}\n`;
      icsContent += `SUMMARY:${event.title}\n`;
      const extProps = event.extendedProps as any;
      if (extProps?.location) {
        icsContent += `LOCATION:${extProps.location}\n`;
      }
      if (extProps?.description) {
        icsContent += `DESCRIPTION:${extProps.description}\n`;
      }
      icsContent += "END:VEVENT\n";
    });
    
    icsContent += "END:VCALENDAR";
    
    // Download do arquivo
    const blob = new Blob([icsContent], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "calendario_djairrotta.ics";
    link.click();
    URL.revokeObjectURL(url);
    
    toast.success("Arquivo .ics gerado! Importe no Google Calendar.");
  };

  const formatICSDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  };

  const handleSyncGoogleCalendar = () => {
    // Em produção, aqui seria integração com Google Calendar API
    toast.info("Sincronização com Google Calendar em desenvolvimento. Use 'Exportar .ics' para importar manualmente.");
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-serif text-slate-800 mb-2 flex items-center gap-3">
                <Calendar className="h-8 w-8" />
                Calendário
              </h1>
              <p className="text-slate-600">
                Visualize audiências, tarefas, atendimentos e prazos
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={handleExportToGoogleCalendar}
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar .ics
              </Button>
              <Button 
                variant="outline"
                onClick={handleSyncGoogleCalendar}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Sincronizar Google
              </Button>
            </div>
          </div>
        </div>

        {/* Legenda */}
        <Card className="p-4 mb-6">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-600"></div>
              <span>Audiências Pendentes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-600"></div>
              <span>Audiências Concluídas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-orange-600"></div>
              <span>Tarefas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-purple-600"></div>
              <span>Atendimentos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-600"></div>
              <span>Prazos</span>
            </div>
          </div>
        </Card>

        {/* Calendário */}
        <Card className="p-6">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
            }}
            buttonText={{
              today: "Hoje",
              month: "Mês",
              week: "Semana",
              day: "Dia",
              list: "Lista",
            }}
            locale="pt-br"
            events={allEvents}
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            eventClick={handleEventClick}
            select={handleDateSelect}
            height="auto"
            eventTimeFormat={{
              hour: "2-digit",
              minute: "2-digit",
              meridiem: false,
            }}
            slotLabelFormat={{
              hour: "2-digit",
              minute: "2-digit",
              meridiem: false,
            }}
            viewDidMount={(info) => setCurrentView(info.view.type)}
          />
        </Card>

        {/* Instruções */}
        <Card className="p-6 mt-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-slate-800 mb-2">💡 Como usar</h3>
          <ul className="text-sm text-slate-700 space-y-1">
            <li>• Clique em um evento para ver detalhes completos</li>
            <li>• Selecione uma data/período para criar novo evento com formulário completo</li>
            <li>• Arraste eventos para reagendar (funcionalidade visual)</li>
            <li>• Use "Exportar .ics" para importar no Google Calendar, Outlook ou Apple Calendar</li>
            <li>• Alterne entre visualizações: Mês, Semana, Dia ou Lista</li>
          </ul>
        </Card>
      </div>

      {/* Modal de Criação de Evento */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">Criar Novo Evento</DialogTitle>
          </DialogHeader>
          <EventForm
            initialDate={selectedDate}
            onSuccess={handleEventCreated}
            onCancel={() => {
              setIsModalOpen(false);
              setSelectedDate(undefined);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Modal de Detalhes do Evento */}
      <EventDetailsModal
        event={selectedEvent}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedEvent(null);
        }}
        onDelete={handleEventDeleted}
        onUpdate={handleEventUpdated}
      />
    </DashboardLayout>
  );
}
