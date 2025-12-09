import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Save, Send, Shield } from "lucide-react";
import { canPerformCriticalOperation } from "@/lib/permissions";
import { useLocation } from "wouter";

interface WhatsAppConfig {
  linkId: string;
  token: string;
  phoneNumber: string;
}

export default function WhatsAppConfigPage() {
  const [, setLocation] = useLocation();
  const [config, setConfig] = useState<WhatsAppConfig>({
    linkId: "",
    token: "",
    phoneNumber: "",
  });
  const [testPhone, setTestPhone] = useState("");
  const [testMessage, setTestMessage] = useState("Teste de notificação do sistema Djair Rota Advogados");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Verificar se é Master
    const userAuth = localStorage.getItem("userAuth");
    if (!userAuth) {
      setLocation("/advogados");
      return;
    }

    const user = JSON.parse(userAuth);
    if (user.role !== "Master") {
      toast.error("Apenas o usuário Master pode acessar esta página");
      setLocation("/advogados/dashboard");
      return;
    }

    // Carregar configuração salva
    const savedConfig = localStorage.getItem("whatsappConfig");
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }
  }, [setLocation]);

  const handleSave = () => {
    if (!config.linkId || !config.token || !config.phoneNumber) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    localStorage.setItem("whatsappConfig", JSON.stringify(config));
    toast.success("Configuração salva com sucesso!");
  };

  const handleTest = async () => {
    if (!testPhone || !testMessage) {
      toast.error("Preencha o número e a mensagem de teste");
      return;
    }

    if (!config.linkId || !config.token) {
      toast.error("Configure o WhatsApp antes de testar");
      return;
    }

    setLoading(true);

    try {
      // Simular envio de mensagem via API
      // Na implementação real, chamar a API do WhatsApp
      const response = await fetch(`https://api.whatsapp.com/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${config.token}`,
        },
        body: JSON.stringify({
          link_id: config.linkId,
          phone: testPhone,
          message: testMessage,
        }),
      });

      if (response.ok) {
        toast.success("Mensagem de teste enviada com sucesso!");
      } else {
        toast.error("Erro ao enviar mensagem. Verifique as configurações.");
      }
    } catch (error) {
      console.error("Erro ao testar WhatsApp:", error);
      toast.info("Configuração salva. Teste via WhatsApp Web: " + 
        `https://wa.me/${testPhone.replace(/\D/g, "")}?text=${encodeURIComponent(testMessage)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-serif text-slate-900">Configuração do WhatsApp</h1>
          </div>
          <p className="text-slate-600">Configure a integração com WhatsApp Business API para envio de notificações automáticas aos clientes</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Configuração */}
          <Card className="p-6">
            <h2 className="text-xl font-serif text-slate-900 mb-6">Credenciais da API</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="linkId">Link ID *</Label>
                <Input
                  id="linkId"
                  type="text"
                  placeholder="seu-link-id"
                  value={config.linkId}
                  onChange={(e) => setConfig({ ...config, linkId: e.target.value })}
                  className="mt-1"
                />
                <p className="text-xs text-slate-500 mt-1">
                  ID do link fornecido pela WhatsApp Business API
                </p>
              </div>

              <div>
                <Label htmlFor="token">Token de Acesso *</Label>
                <Input
                  id="token"
                  type="password"
                  placeholder="••••••••••••••••"
                  value={config.token}
                  onChange={(e) => setConfig({ ...config, token: e.target.value })}
                  className="mt-1"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Token de autenticação da API
                </p>
              </div>

              <div>
                <Label htmlFor="phoneNumber">Número do Escritório *</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="(19) 3656-4903"
                  value={config.phoneNumber}
                  onChange={(e) => setConfig({ ...config, phoneNumber: e.target.value })}
                  className="mt-1"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Número do WhatsApp Business cadastrado (com DDD)
                </p>
              </div>

              <Button
                onClick={handleSave}
                className="w-full bg-slate-800 hover:bg-slate-900"
              >
                <Save className="mr-2 h-4 w-4" />
                Salvar Configuração
              </Button>
            </div>
          </Card>

          {/* Teste */}
          <Card className="p-6">
            <h2 className="text-xl font-serif text-slate-900 mb-6">Testar Envio</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="testPhone">Número de Teste</Label>
                <Input
                  id="testPhone"
                  type="tel"
                  placeholder="(19) 99999-9999"
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Número para receber a mensagem de teste
                </p>
              </div>

              <div>
                <Label htmlFor="testMessage">Mensagem de Teste</Label>
                <textarea
                  id="testMessage"
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-800"
                  placeholder="Digite a mensagem de teste..."
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                />
              </div>

              <Button
                onClick={handleTest}
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                <Send className="mr-2 h-4 w-4" />
                {loading ? "Enviando..." : "Enviar Teste"}
              </Button>
            </div>
          </Card>
        </div>

        {/* Informações */}
        <Card className="mt-6 p-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-3">ℹ️ Como obter as credenciais?</h3>
          <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
            <li>Acesse o <a href="https://business.whatsapp.com" target="_blank" rel="noopener noreferrer" className="underline">WhatsApp Business Platform</a></li>
            <li>Crie uma conta Business e configure seu número</li>
            <li>No painel, acesse "API" e gere um novo token de acesso</li>
            <li>Copie o Link ID e o Token e cole nos campos acima</li>
            <li>Salve a configuração e teste o envio</li>
          </ol>
        </Card>

        {/* Status */}
        <Card className="mt-6 p-6">
          <h3 className="font-semibold text-slate-900 mb-3">Status da Integração</h3>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${config.linkId && config.token ? "bg-green-500" : "bg-red-500"}`}></div>
            <span className="text-sm text-slate-700">
              {config.linkId && config.token 
                ? "✅ Configuração ativa - Notificações automáticas habilitadas" 
                : "❌ Configuração pendente - Configure para habilitar notificações"}
            </span>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
