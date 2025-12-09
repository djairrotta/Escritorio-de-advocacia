// Serviço de Notificações - E-mail e WhatsApp

interface NotificationData {
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  subject: string;
  message: string;
}

/**
 * Envia notificação por e-mail usando Manus Forge API
 */
export async function sendEmailNotification(data: NotificationData): Promise<boolean> {
  try {
    const forgeApiKey = import.meta.env.VITE_FRONTEND_FORGE_API_KEY;
    const forgeApiUrl = import.meta.env.VITE_FRONTEND_FORGE_API_URL;

    if (!forgeApiKey || !forgeApiUrl) {
      console.warn("Manus Forge API não configurada");
      return false;
    }

    if (!data.clientEmail) {
      console.warn("E-mail do cliente não fornecido");
      return false;
    }

    const response = await fetch(`${forgeApiUrl}/v1/email/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${forgeApiKey}`,
      },
      body: JSON.stringify({
        to: data.clientEmail,
        subject: data.subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #1e293b; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Djair Rota Advogados</h1>
            </div>
            <div style="padding: 30px; background-color: #f8fafc;">
              <h2 style="color: #1e293b;">Olá, ${data.clientName}!</h2>
              <p style="color: #475569; line-height: 1.6;">${data.message}</p>
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
              <p style="color: #64748b; font-size: 14px;">
                Esta é uma mensagem automática do sistema de gerenciamento jurídico.<br>
                Para mais informações, entre em contato conosco.
              </p>
              <p style="color: #64748b; font-size: 14px;">
                <strong>Djair Rota Advogados</strong><br>
                Rua Coronel Diogo, 525 - Mococa/SP<br>
                Telefone: (19) 3656-4903<br>
                E-mail: djair@djairrotta.com.br
              </p>
            </div>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      console.error("Erro ao enviar e-mail:", await response.text());
      return false;
    }

    console.log("✅ E-mail enviado com sucesso para:", data.clientEmail);
    return true;
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    return false;
  }
}

/**
 * Envia notificação por WhatsApp usando API configurada
 */
export async function sendWhatsAppNotification(data: NotificationData): Promise<boolean> {
  try {
    // Buscar configuração do WhatsApp
    const configStr = localStorage.getItem("whatsappConfig");
    if (!configStr) {
      console.warn("WhatsApp não configurado");
      return false;
    }

    const config = JSON.parse(configStr);
    if (!config.linkId || !config.token) {
      console.warn("Credenciais do WhatsApp incompletas");
      return false;
    }

    if (!data.clientPhone) {
      console.warn("Telefone do cliente não fornecido");
      return false;
    }

    // Formatar número (remover caracteres especiais)
    const phone = data.clientPhone.replace(/\D/g, "");

    // Formatar mensagem
    const whatsappMessage = `
*${data.subject}*

Olá, ${data.clientName}!

${data.message}

---
_Djair Rota Advogados_
_Rua Coronel Diogo, 525 - Mococa/SP_
_Tel: (19) 3656-4903_
    `.trim();

    // Tentar enviar via API do WhatsApp
    // Nota: A URL e estrutura podem variar dependendo do provedor
    const response = await fetch(`https://api.whatsapp.com/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${config.token}`,
      },
      body: JSON.stringify({
        link_id: config.linkId,
        phone: phone,
        message: whatsappMessage,
      }),
    });

    if (response.ok) {
      console.log("✅ WhatsApp enviado com sucesso para:", data.clientPhone);
      return true;
    } else {
      // Fallback: abrir WhatsApp Web
      console.warn("Erro na API, usando fallback WhatsApp Web");
      const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(whatsappMessage)}`;
      console.log("📱 Link WhatsApp:", whatsappUrl);
      return false;
    }
  } catch (error) {
    console.error("Erro ao enviar WhatsApp:", error);
    
    // Fallback: gerar link WhatsApp Web
    if (data.clientPhone) {
      const phone = data.clientPhone.replace(/\D/g, "");
      const whatsappMessage = `*${data.subject}*\n\nOlá, ${data.clientName}!\n\n${data.message}`;
      const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(whatsappMessage)}`;
      console.log("📱 Link WhatsApp (fallback):", whatsappUrl);
    }
    
    return false;
  }
}

/**
 * Envia notificação completa (e-mail + WhatsApp)
 */
export async function sendNotification(data: NotificationData): Promise<{
  email: boolean;
  whatsapp: boolean;
}> {
  const results = {
    email: false,
    whatsapp: false,
  };

  // Enviar e-mail
  if (data.clientEmail) {
    results.email = await sendEmailNotification(data);
  }

  // Enviar WhatsApp
  if (data.clientPhone) {
    results.whatsapp = await sendWhatsAppNotification(data);
  }

  return results;
}

/**
 * Notificar cliente sobre atualização de processo
 */
export async function notifyProcessUpdate(
  clientName: string,
  clientEmail: string | undefined,
  clientPhone: string | undefined,
  processNumber: string,
  updateType: "nova_movimentacao" | "audiencia_agendada" | "prazo_proximo" | "status_alterado",
  details: string
): Promise<void> {
  const subjects = {
    nova_movimentacao: "Nova Movimentação no Processo",
    audiencia_agendada: "Audiência Agendada",
    prazo_proximo: "Prazo Próximo - Atenção Necessária",
    status_alterado: "Status do Processo Atualizado",
  };

  const messages = {
    nova_movimentacao: `Houve uma nova movimentação no seu processo ${processNumber}.\n\n${details}\n\nPara mais detalhes, acesse o Portal do Cliente ou entre em contato conosco.`,
    audiencia_agendada: `Foi agendada uma audiência para o processo ${processNumber}.\n\n${details}\n\nPor favor, compareça no horário e local indicados.`,
    prazo_proximo: `Há um prazo importante se aproximando no processo ${processNumber}.\n\n${details}\n\nPor favor, entre em contato urgentemente.`,
    status_alterado: `O status do processo ${processNumber} foi atualizado.\n\n${details}\n\nAcesse o Portal do Cliente para mais informações.`,
  };

  await sendNotification({
    clientName,
    clientEmail,
    clientPhone,
    subject: subjects[updateType],
    message: messages[updateType],
  });
}
