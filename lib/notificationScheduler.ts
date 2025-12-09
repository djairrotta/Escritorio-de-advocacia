// Serviço de Agendamento de Notificações Automáticas

import { notifyProcessUpdate } from "./notificationService";

interface ScheduledEvent {
  id: number;
  title: string;
  date: Date;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  processNumber?: string;
  type: "audiencia" | "prazo" | "reuniao" | "outro";
}

/**
 * Verifica se um evento está próximo (dentro de 24h)
 */
function isEventWithin24Hours(eventDate: Date): boolean {
  const now = new Date();
  const diff = eventDate.getTime() - now.getTime();
  const hoursUntilEvent = diff / (1000 * 60 * 60);
  
  // Evento entre 23h e 25h (janela de 2h para garantir que não perca)
  return hoursUntilEvent > 23 && hoursUntilEvent <= 25;
}

/**
 * Verifica eventos próximos e envia lembretes
 */
export async function checkAndSendReminders(events: ScheduledEvent[]): Promise<void> {
  const now = new Date();
  const sentKey = `reminders_sent_${now.toISOString().split('T')[0]}`; // Key por dia
  const sentToday = JSON.parse(localStorage.getItem(sentKey) || "[]");

  for (const event of events) {
    const eventDate = new Date(event.date);
    
    // Verificar se está dentro de 24h e ainda não foi enviado hoje
    if (isEventWithin24Hours(eventDate) && !sentToday.includes(event.id)) {
      console.log(`📅 Enviando lembrete para evento: ${event.title}`);
      
      const message = event.type === "audiencia"
        ? `Lembrete: Você tem uma audiência agendada para amanhã!\n\nEvento: ${event.title}\nData/Hora: ${eventDate.toLocaleString('pt-BR')}\n\nPor favor, compareça no horário indicado.`
        : event.type === "prazo"
        ? `Atenção: Prazo importante se aproxima!\n\nEvento: ${event.title}\nData/Hora: ${eventDate.toLocaleString('pt-BR')}\n\nNão perca este prazo!`
        : `Lembrete: Você tem um compromisso agendado para amanhã!\n\nEvento: ${event.title}\nData/Hora: ${eventDate.toLocaleString('pt-BR')}`;

      try {
        await notifyProcessUpdate(
          event.clientName,
          event.clientEmail,
          event.clientPhone,
          event.processNumber || "N/A",
          event.type === "audiencia" ? "audiencia_agendada" : "prazo_proximo",
          message
        );

        // Marcar como enviado
        sentToday.push(event.id);
        localStorage.setItem(sentKey, JSON.stringify(sentToday));
        
        console.log(`✅ Lembrete enviado para: ${event.clientName}`);
      } catch (error) {
        console.error(`❌ Erro ao enviar lembrete:`, error);
      }
    }
  }
}

/**
 * Inicia o agendador (verifica a cada hora)
 */
export function startNotificationScheduler(getEvents: () => ScheduledEvent[]): void {
  console.log("🔔 Agendador de notificações iniciado");

  // Verificar imediatamente ao iniciar
  checkAndSendReminders(getEvents());

  // Verificar a cada hora
  setInterval(() => {
    console.log("🔍 Verificando eventos próximos...");
    checkAndSendReminders(getEvents());
  }, 60 * 60 * 1000); // 1 hora
}

/**
 * Limpar registros antigos de lembretes enviados (manter apenas últimos 7 dias)
 */
export function cleanupOldReminderRecords(): void {
  const keys = Object.keys(localStorage);
  const now = new Date();
  
  keys.forEach(key => {
    if (key.startsWith("reminders_sent_")) {
      const dateStr = key.replace("reminders_sent_", "");
      const recordDate = new Date(dateStr);
      const daysDiff = (now.getTime() - recordDate.getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysDiff > 7) {
        localStorage.removeItem(key);
        console.log(`🗑️ Removido registro antigo: ${key}`);
      }
    }
  });
}

/**
 * Configurar horário preferencial para envio (padrão: 9h da manhã)
 */
export function getPreferredNotificationTime(): number {
  const config = localStorage.getItem("notificationTimeConfig");
  if (config) {
    return parseInt(config);
  }
  return 9; // 9h padrão
}

export function setPreferredNotificationTime(hour: number): void {
  if (hour >= 0 && hour <= 23) {
    localStorage.setItem("notificationTimeConfig", hour.toString());
    console.log(`⏰ Horário de notificação configurado para: ${hour}:00`);
  }
}
