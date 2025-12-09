import { toast } from "sonner";

export interface NotificationConfig {
  email: boolean;
  whatsapp: boolean;
  audiencias: boolean;
  prazos: boolean;
  atualizacoes: boolean;
}

export interface NotificationData {
  type: "audiencia" | "prazo" | "atualizacao" | "lembrete";
  title: string;
  message: string;
  recipient: {
    name: string;
    email?: string;
    phone?: string;
  };
  data?: any;
}

// Simula envio de e-mail
export async function sendEmail(notification: NotificationData): Promise<boolean> {
  try {
    // Em produção, aqui seria uma chamada para API de e-mail (SendGrid, AWS SES, etc.)
    console.log("📧 Enviando e-mail:", {
      to: notification.recipient.email,
      subject: notification.title,
      body: notification.message,
    });

    // Simula delay de envio
    await new Promise(resolve => setTimeout(resolve, 500));

    toast.success(`E-mail enviado para ${notification.recipient.name}`);
    return true;
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    toast.error("Falha ao enviar e-mail");
    return false;
  }
}

// Simula envio de WhatsApp
export async function sendWhatsApp(notification: NotificationData): Promise<boolean> {
  try {
    // Em produção, aqui seria uma chamada para API do WhatsApp Business (Twilio, etc.)
    console.log("📱 Enviando WhatsApp:", {
      to: notification.recipient.phone,
      message: `*${notification.title}*\n\n${notification.message}`,
    });

    // Simula delay de envio
    await new Promise(resolve => setTimeout(resolve, 500));

    toast.success(`WhatsApp enviado para ${notification.recipient.name}`);
    return true;
  } catch (error) {
    console.error("Erro ao enviar WhatsApp:", error);
    toast.error("Falha ao enviar WhatsApp");
    return false;
  }
}

// Envia notificação baseada nas preferências do usuário
export async function sendNotification(
  notification: NotificationData,
  config: NotificationConfig
): Promise<void> {
  const promises: Promise<boolean>[] = [];

  // Verifica se o tipo de notificação está habilitado
  const typeEnabled = {
    audiencia: config.audiencias,
    prazo: config.prazos,
    atualizacao: config.atualizacoes,
    lembrete: true, // Lembretes sempre habilitados
  }[notification.type];

  if (!typeEnabled) {
    console.log(`Notificação de ${notification.type} desabilitada nas preferências`);
    return;
  }

  // Envia por e-mail se habilitado e e-mail disponível
  if (config.email && notification.recipient.email) {
    promises.push(sendEmail(notification));
  }

  // Envia por WhatsApp se habilitado e telefone disponível
  if (config.whatsapp && notification.recipient.phone) {
    promises.push(sendWhatsApp(notification));
  }

  await Promise.all(promises);
}

// Templates de notificação
export const notificationTemplates = {
  audienciaProxima: (caseNumber: string, date: Date, location: string) => ({
    title: "Lembrete de Audiência",
    message: `Você tem uma audiência agendada:\n\nProcesso: ${caseNumber}\nData: ${date.toLocaleDateString("pt-BR")} às ${date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}\nLocal: ${location}\n\nPrepare-se com antecedência!`,
  }),

  prazoVencendo: (caseNumber: string, prazo: string, dias: number) => ({
    title: "Alerta de Prazo",
    message: `⚠️ Prazo próximo do vencimento!\n\nProcesso: ${caseNumber}\nPrazo: ${prazo}\nVence em: ${dias} ${dias === 1 ? "dia" : "dias"}\n\nAção necessária!`,
  }),

  processoAtualizado: (caseNumber: string, atualizacao: string) => ({
    title: "Atualização de Processo",
    message: `Processo ${caseNumber} foi atualizado:\n\n${atualizacao}\n\nVerifique os detalhes no sistema.`,
  }),

  novoCliente: (clientName: string, advogado: string) => ({
    title: "Novo Cliente Atribuído",
    message: `Novo cliente foi atribuído a você:\n\nCliente: ${clientName}\nAdvogado responsável: ${advogado}\n\nAcesse o sistema para mais detalhes.`,
  }),
};

// Salva preferências de notificação no localStorage
export function saveNotificationConfig(config: NotificationConfig): void {
  localStorage.setItem("notification_config", JSON.stringify(config));
  toast.success("Preferências de notificação salvas");
}

// Carrega preferências de notificação do localStorage
export function loadNotificationConfig(): NotificationConfig {
  const saved = localStorage.getItem("notification_config");
  if (saved) {
    return JSON.parse(saved);
  }
  // Configuração padrão
  return {
    email: true,
    whatsapp: true,
    audiencias: true,
    prazos: true,
    atualizacoes: true,
  };
}
