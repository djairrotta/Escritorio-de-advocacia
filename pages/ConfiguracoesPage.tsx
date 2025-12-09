import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, UserPlus, Edit, Trash2, Shield, Mail, Plus, CheckCircle, XCircle } from "lucide-react";
import FormModal from "@/components/FormModal";
import { mockUsers } from "@/data/mockData";
import { canPerformCriticalOperation, logAuditAction } from "@/lib/permissions";
import { toast } from "sonner";
import type { User } from "@/types";

export default function ConfiguracoesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "advogado" as "master" | "moderador" | "advogado",
  });

  // Estados para configuração de e-mails
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailAccounts, setEmailAccounts] = useState<any[]>([]);
  const [emailFormData, setEmailFormData] = useState({
    userId: "",
    provider: "gmail" as "gmail" | "outlook" | "custom",
    email: "",
    password: "",
    smtpHost: "",
    smtpPort: "587",
    imapHost: "",
    imapPort: "993",
  });
  const [testingConnection, setTestingConnection] = useState(false);

  // Carregar contas de e-mail do localStorage
  useEffect(() => {
    const saved = localStorage.getItem("email_accounts");
    if (saved) {
      setEmailAccounts(JSON.parse(saved));
    }
  }, []);

  const currentUserRole = localStorage.getItem("userRole") as "master" | "moderador" | "advogado";
  const isMaster = currentUserRole === "master";

  const handleOpenModal = (user?: User) => {
    if (user) {
      setSelectedUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      setSelectedUser(null);
      setFormData({
        name: "",
        email: "",
        role: "advogado",
      });
    }
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canPerformCriticalOperation()) {
      toast.error("Você não tem permissão para esta operação");
      return;
    }

    const action = selectedUser ? "editar" : "criar";
    const userId = selectedUser?.id || Date.now();
    
    logAuditAction(
      action,
      "advogado" as any,
      userId,
      `${formData.name} (${formData.email})`
    );

    toast.success(`Advogado ${selectedUser ? "atualizado" : "cadastrado"} com sucesso!`);
    setModalOpen(false);
    setSelectedUser(null);
    setFormData({ name: "", email: "", role: "advogado" });
  };

  const handleTestEmail = async (account: any) => {
    setTestingConnection(true);
    toast.info("Testando conexão SMTP...");

    // Simular teste de conexão
    setTimeout(() => {
      setTestingConnection(false);
      toast.success(`Conexão com ${account.email} testada com sucesso!`);
    }, 2000);
  };

  const handleDeleteEmail = (index: number) => {
    if (confirm("Tem certeza que deseja excluir esta conta de e-mail?")) {
      const updated = emailAccounts.filter((_, i) => i !== index);
      setEmailAccounts(updated);
      localStorage.setItem("email_accounts", JSON.stringify(updated));
      toast.success("Conta de e-mail excluída");
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newAccount = { ...emailFormData };
    const updated = [...emailAccounts, newAccount];
    setEmailAccounts(updated);
    localStorage.setItem("email_accounts", JSON.stringify(updated));

    toast.success("Conta de e-mail adicionada com sucesso!");
    setEmailModalOpen(false);
  };

  const handleDelete = (user: User) => {
    if (!isMaster) {
      toast.error("Apenas o Master pode excluir advogados");
      return;
    }

    if (user.role === "master") {
      toast.error("Não é possível excluir o usuário Master");
      return;
    }

    if (confirm(`Deseja excluir ${user.name}?`)) {
      logAuditAction("excluir", "advogado" as any, user.id, user.name);
      toast.success("Advogado excluído com sucesso");
    }
  };

  const getRoleBadge = (role: string) => {
    const styles = {
      master: "bg-purple-100 text-purple-800 border-purple-200",
      moderador: "bg-blue-100 text-blue-800 border-blue-200",
      advogado: "bg-green-100 text-green-800 border-green-200",
    };
    return styles[role as keyof typeof styles] || styles.advogado;
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-serif text-slate-800 mb-2 flex items-center gap-3">
                <Settings className="h-8 w-8" />
                Configurações
              </h1>
              <p className="text-slate-600">Gerencie advogados e permissões do sistema</p>
            </div>
            {canPerformCriticalOperation() && (
              <Button 
                className="bg-slate-800 hover:bg-slate-900"
                onClick={() => handleOpenModal()}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Adicionar Advogado
              </Button>
            )}
          </div>
        </div>

        {/* Advogados */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Advogados Cadastrados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockUsers.map((user) => (
              <Card key={user.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-slate-800">{user.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded border ${getRoleBadge(user.role)}`}>
                        {user.role === "master" ? "Master" : user.role === "moderador" ? "Moderador" : "Advogado"}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">{user.email}</p>
                    {user.role === "master" && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-purple-600">
                        <Shield className="h-3 w-3" />
                        <span>Acesso total ao sistema</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {canPerformCriticalOperation() && (
                      <>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleOpenModal(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {isMaster && user.role !== "master" && (
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDelete(user)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Configuração de E-mails */}
        {isMaster && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-800">Contas de E-mail</h2>
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  setEmailFormData({
                    userId: "",
                    provider: "gmail",
                    email: "",
                    password: "",
                    smtpHost: "",
                    smtpPort: "587",
                    imapHost: "",
                    imapPort: "993",
                  });
                  setEmailModalOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Conta
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {emailAccounts.length === 0 ? (
                <Card className="p-8 text-center text-slate-500">
                  <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma conta de e-mail configurada</p>
                </Card>
              ) : (
                emailAccounts.map((account, index) => (
                  <Card key={index} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                          <Mail className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-slate-800">{account.email}</h3>
                            <span className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-600">
                              {account.provider === "gmail" ? "Gmail" : account.provider === "outlook" ? "Outlook" : "Custom"}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 mt-1">
                            Advogado: {mockUsers.find(u => u.id === parseInt(account.userId))?.name || "Não atribuído"}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTestEmail(account)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Testar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteEmail(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}

        {/* Permissões */}
        <div>
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Níveis de Permissão</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6 border-l-4 border-l-purple-600">
              <h3 className="font-semibold text-slate-800 mb-2">Master</h3>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Acesso total ao sistema</li>
                <li>• Criar, editar e excluir qualquer dado</li>
                <li>• Gerenciar advogados</li>
                <li>• Visualizar logs de auditoria</li>
              </ul>
            </Card>
            <Card className="p-6 border-l-4 border-l-blue-600">
              <h3 className="font-semibold text-slate-800 mb-2">Moderador</h3>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Criar, editar e excluir dados</li>
                <li>• Visualizar logs de auditoria</li>
                <li>• Gerenciar processos e clientes</li>
                <li>• Não pode gerenciar advogados</li>
              </ul>
            </Card>
            <Card className="p-6 border-l-4 border-l-green-600">
              <h3 className="font-semibold text-slate-800 mb-2">Advogado</h3>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Visualizar dados do sistema</li>
                <li>• Acessar seus processos</li>
                <li>• Visualizar clientes e audiências</li>
                <li>• Não pode criar ou editar</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>

      <FormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={selectedUser ? "Editar Advogado" : "Adicionar Advogado"}
        description={selectedUser ? "Atualize os dados do advogado" : "Preencha os dados do novo advogado"}
      >
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="name">Nome Completo *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Dr. João Silva"
            />
          </div>

          <div>
            <Label htmlFor="email">E-mail *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="joao@djairrotta.com.br"
            />
          </div>

          <div>
            <Label htmlFor="role">Nível de Permissão *</Label>
            <Select 
              value={formData.role} 
              onValueChange={(value) => setFormData({ ...formData, role: value as "master" | "moderador" | "advogado" })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {isMaster && <SelectItem value="master">Master</SelectItem>}
                <SelectItem value="moderador">Moderador</SelectItem>
                <SelectItem value="advogado">Advogado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setModalOpen(false)} 
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-slate-800 hover:bg-slate-900">
              {selectedUser ? "Atualizar" : "Cadastrar"}
            </Button>
          </div>
        </form>
      </FormModal>

      {/* Modal de Configuração de E-mail */}
      <FormModal
        open={emailModalOpen}
        onOpenChange={setEmailModalOpen}
        title="Adicionar Conta de E-mail"
        description="Configure uma conta de e-mail para um advogado"
      >
        <form onSubmit={handleEmailSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="userId">Advogado *</Label>
            <Select 
              value={emailFormData.userId} 
              onValueChange={(value) => setEmailFormData({ ...emailFormData, userId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um advogado" />
              </SelectTrigger>
              <SelectContent>
                {mockUsers.map((user) => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="provider">Provedor *</Label>
            <Select 
              value={emailFormData.provider} 
              onValueChange={(value) => setEmailFormData({ ...emailFormData, provider: value as "gmail" | "outlook" | "custom" })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gmail">Gmail</SelectItem>
                <SelectItem value="outlook">Outlook</SelectItem>
                <SelectItem value="custom">Customizado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="emailAddress">E-mail *</Label>
            <Input
              id="emailAddress"
              type="email"
              value={emailFormData.email}
              onChange={(e) => setEmailFormData({ ...emailFormData, email: e.target.value })}
              required
              placeholder="exemplo@gmail.com"
            />
          </div>

          <div>
            <Label htmlFor="password">Senha ou App Password *</Label>
            <Input
              id="password"
              type="password"
              value={emailFormData.password}
              onChange={(e) => setEmailFormData({ ...emailFormData, password: e.target.value })}
              required
              placeholder="••••••••"
            />
            <p className="text-xs text-slate-500 mt-1">
              Para Gmail, use uma senha de aplicativo. <a href="https://support.google.com/accounts/answer/185833" target="_blank" className="text-blue-600 hover:underline">Saiba mais</a>
            </p>
          </div>

          {emailFormData.provider === "custom" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtpHost">SMTP Host *</Label>
                  <Input
                    id="smtpHost"
                    value={emailFormData.smtpHost}
                    onChange={(e) => setEmailFormData({ ...emailFormData, smtpHost: e.target.value })}
                    required
                    placeholder="smtp.example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPort">SMTP Port *</Label>
                  <Input
                    id="smtpPort"
                    type="number"
                    value={emailFormData.smtpPort}
                    onChange={(e) => setEmailFormData({ ...emailFormData, smtpPort: e.target.value })}
                    required
                    placeholder="587"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="imapHost">IMAP Host</Label>
                  <Input
                    id="imapHost"
                    value={emailFormData.imapHost}
                    onChange={(e) => setEmailFormData({ ...emailFormData, imapHost: e.target.value })}
                    placeholder="imap.example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="imapPort">IMAP Port</Label>
                  <Input
                    id="imapPort"
                    type="number"
                    value={emailFormData.imapPort}
                    onChange={(e) => setEmailFormData({ ...emailFormData, imapPort: e.target.value })}
                    placeholder="993"
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setEmailModalOpen(false)} 
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
              Adicionar Conta
            </Button>
          </div>
        </form>
      </FormModal>
    </DashboardLayout>
  );
}
