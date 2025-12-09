import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bell, Mail, MessageCircle, Calendar, Clock, FileText } from "lucide-react";
import { 
  loadNotificationConfig, 
  saveNotificationConfig, 
  sendNotification,
  notificationTemplates,
  type NotificationConfig 
} from "@/lib/notifications";
import { toast } from "sonner";

export default function NotificacoesPage() {
  const [config, setConfig] = useState<NotificationConfig>(loadNotificationConfig());
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    saveNotificationConfig(config);
    setTimeout(() => setIsSaving(false), 500);
  };

  const handleTestNotification = async () => {
    const userName = localStorage.getItem("userName") || "Usuário";
    const userEmail = localStorage.getItem("userEmail") || "usuario@djairrotta.com.br";
    
    const testNotification = {
      type: "lembrete" as const,
      title: "Teste de Notificação",
      message: "Este é um teste do sistema de notificações do Portal do Advogado. Se você recebeu esta mensagem, o sistema está funcionando corretamente!",
      recipient: {
        name: userName,
        email: userEmail,
        phone: "+55 19 99999-9999", // Telefone de teste
      },
    };

    await sendNotification(testNotification, config);
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-serif text-slate-800 mb-2 flex items-center gap-3">
                <Bell className="h-8 w-8" />
                Notificações
              </h1>
              <p className="text-slate-600">Configure como você deseja receber alertas e lembretes</p>
            </div>
            <Button 
              variant="outline"
              onClick={handleTestNotification}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Enviar Teste
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Canais de Notificação */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-blue-600" />
              Canais de Comunicação
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <Label htmlFor="email" className="font-medium">E-mail</Label>
                    <p className="text-sm text-slate-600">Receber notificações por e-mail</p>
                  </div>
                </div>
                <Switch
                  id="email"
                  checked={config.email}
                  onCheckedChange={(checked) => setConfig({ ...config, email: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <Label htmlFor="whatsapp" className="font-medium">WhatsApp</Label>
                    <p className="text-sm text-slate-600">Receber notificações por WhatsApp</p>
                  </div>
                </div>
                <Switch
                  id="whatsapp"
                  checked={config.whatsapp}
                  onCheckedChange={(checked) => setConfig({ ...config, whatsapp: checked })}
                />
              </div>
            </div>
          </Card>

          {/* Tipos de Notificação */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Bell className="h-5 w-5 text-purple-600" />
              Tipos de Alerta
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <Label htmlFor="audiencias" className="font-medium">Audiências</Label>
                    <p className="text-sm text-slate-600">Lembretes de audiências próximas</p>
                  </div>
                </div>
                <Switch
                  id="audiencias"
                  checked={config.audiencias}
                  onCheckedChange={(checked) => setConfig({ ...config, audiencias: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <Label htmlFor="prazos" className="font-medium">Prazos</Label>
                    <p className="text-sm text-slate-600">Alertas de prazos próximos do vencimento</p>
                  </div>
                </div>
                <Switch
                  id="prazos"
                  checked={config.prazos}
                  onCheckedChange={(checked) => setConfig({ ...config, prazos: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <Label htmlFor="atualizacoes" className="font-medium">Atualizações</Label>
                    <p className="text-sm text-slate-600">Notificações de mudanças em processos</p>
                  </div>
                </div>
                <Switch
                  id="atualizacoes"
                  checked={config.atualizacoes}
                  onCheckedChange={(checked) => setConfig({ ...config, atualizacoes: checked })}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Exemplos de Notificações */}
        <Card className="p-6 mt-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Exemplos de Notificações</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-slate-200 rounded-lg bg-blue-50">
              <h3 className="font-medium text-slate-800 mb-2">📧 Lembrete de Audiência</h3>
              <p className="text-sm text-slate-600">
                "Você tem uma audiência agendada para amanhã às 14:00 no Fórum de Mococa - Processo 0001234-56.2024"
              </p>
            </div>
            <div className="p-4 border border-slate-200 rounded-lg bg-orange-50">
              <h3 className="font-medium text-slate-800 mb-2">⚠️ Alerta de Prazo</h3>
              <p className="text-sm text-slate-600">
                "Prazo para contestação vence em 3 dias - Processo 0007890-12.2024. Ação necessária!"
              </p>
            </div>
            <div className="p-4 border border-slate-200 rounded-lg bg-green-50">
              <h3 className="font-medium text-slate-800 mb-2">📱 Atualização de Processo</h3>
              <p className="text-sm text-slate-600">
                "Processo 0001234-56.2024 foi atualizado: Nova sentença publicada. Verifique os detalhes."
              </p>
            </div>
          </div>
        </Card>

        {/* Botão de Salvar */}
        <div className="mt-6 flex justify-end">
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-slate-800 hover:bg-slate-900"
          >
            {isSaving ? "Salvando..." : "Salvar Preferências"}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
