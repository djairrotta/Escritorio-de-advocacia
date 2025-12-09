import { sendEmail, sendWhatsApp } from "./notifications";
import { toast } from "sonner";

export interface Reminder {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: Date;
  reminderDate: Date;
  type: "email" | "whatsapp" | "both";
  sent: boolean;
}

// Verificar e enviar lembretes pendentes
export function checkAndSendReminders(): void {
  const reminders = getReminders();
  const now = new Date();

  reminders.forEach((reminder) => {
    if (!reminder.sent && new Date(reminder.reminderDate) <= now) {
      sendReminder(reminder);
    }
  });
}

// Enviar lembrete
function sendReminder(reminder: Reminder): void {
  const message = `🔔 Lembrete: ${reminder.eventTitle}\n\nData do evento: ${new Date(reminder.eventDate).toLocaleString("pt-BR")}\n\nEste é um lembrete automático gerado pelo sistema.`;

  const userName = localStorage.getItem("advogado_name") || "Usuário";

  if (reminder.type === "email" || reminder.type === "both") {
    const userEmail = localStorage.getItem("advogado_email") || "";
    if (userEmail) {
      sendEmail({
        type: "lembrete",
        title: `Lembrete: ${reminder.eventTitle}`,
        message,
        recipient: {
          name: userName,
          email: userEmail,
        },
      });
    }
  }

  if (reminder.type === "whatsapp" || reminder.type === "both") {
    const userPhone = localStorage.getItem("advogado_phone") || "";
    if (userPhone) {
      sendWhatsApp({
        type: "lembrete",
        title: `Lembrete: ${reminder.eventTitle}`,
        message,
        recipient: {
          name: userName,
          phone: userPhone,
        },
      });
    }
  }

  // Marcar como enviado
  markReminderAsSent(reminder.id);

  // Notificação visual
  toast.success(`Lembrete enviado: ${reminder.eventTitle}`);
}

// Criar lembrete automático (24h antes do evento)
export function createAutoReminder(
  eventId: string,
  eventTitle: string,
  eventDate: Date,
  type: "email" | "whatsapp" | "both" = "both"
): void {
  const reminderDate = new Date(eventDate);
  reminderDate.setHours(reminderDate.getHours() - 24); // 24 horas antes

  // Não criar lembrete se o evento for em menos de 24h
  if (reminderDate <= new Date()) {
    return;
  }

  const reminder: Reminder = {
    id: `reminder-${Date.now()}`,
    eventId,
    eventTitle,
    eventDate,
    reminderDate,
    type,
    sent: false,
  };

  saveReminder(reminder);
}

// Salvar lembrete no localStorage
function saveReminder(reminder: Reminder): void {
  const reminders = getReminders();
  reminders.push(reminder);
  localStorage.setItem("reminders", JSON.stringify(reminders));
}

// Obter todos os lembretes
export function getReminders(): Reminder[] {
  const reminders = JSON.parse(localStorage.getItem("reminders") || "[]");
  return reminders.map((r: any) => ({
    ...r,
    eventDate: new Date(r.eventDate),
    reminderDate: new Date(r.reminderDate),
  }));
}

// Marcar lembrete como enviado
function markReminderAsSent(reminderId: string): void {
  const reminders = getReminders();
  const updated = reminders.map((r) =>
    r.id === reminderId ? { ...r, sent: true } : r
  );
  localStorage.setItem("reminders", JSON.stringify(updated));
}

// Excluir lembrete
export function deleteReminder(reminderId: string): void {
  const reminders = getReminders();
  const filtered = reminders.filter((r) => r.id !== reminderId);
  localStorage.setItem("reminders", JSON.stringify(filtered));
}

// Excluir lembretes de um evento
export function deleteEventReminders(eventId: string): void {
  const reminders = getReminders();
  const filtered = reminders.filter((r) => r.eventId !== eventId);
  localStorage.setItem("reminders", JSON.stringify(filtered));
}

// Iniciar verificação periódica de lembretes (a cada 5 minutos)
export function startReminderChecker(): void {
  // Verificar imediatamente
  checkAndSendReminders();

  // Verificar a cada 5 minutos
  setInterval(() => {
    checkAndSendReminders();
  }, 5 * 60 * 1000); // 5 minutos
}

// Obter lembretes pendentes
export function getPendingReminders(): Reminder[] {
  const reminders = getReminders();
  return reminders.filter((r) => !r.sent && new Date(r.reminderDate) > new Date());
}

// Obter próximos lembretes (nas próximas 48h)
export function getUpcomingReminders(): Reminder[] {
  const reminders = getPendingReminders();
  const now = new Date();
  const in48Hours = new Date(now.getTime() + 48 * 60 * 60 * 1000);

  return reminders.filter(
    (r) =>
      new Date(r.reminderDate) >= now &&
      new Date(r.reminderDate) <= in48Hours
  );
}
