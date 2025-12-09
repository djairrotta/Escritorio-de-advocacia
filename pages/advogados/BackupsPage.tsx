import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Database, Download, Play, Clock, CheckCircle2, 
  AlertCircle, Trash2, RefreshCw 
} from "lucide-react";
import { toast } from "sonner";

interface Backup {
  id: string;
  date: string;
  size: string;
  status: "success" | "failed";
  path: string;
}

// Mock de backups
const mockBackups: Backup[] = [
  {
    id: "1",
    date: "2024-12-04 02:00:00",
    size: "45.2 MB",
    status: "success",
    path: "s3://backups/backup-2024-12-04.sql",
  },
  {
    id: "2",
    date: "2024-12-03 02:00:00",
    size: "44.8 MB",
    status: "success",
    path: "s3://backups/backup-2024-12-03.sql",
  },
  {
    id: "3",
    date: "2024-12-02 02:00:00",
    size: "44.5 MB",
    status: "success",
    path: "s3://backups/backup-2024-12-02.sql",
  },
];

export default function BackupsPage() {
  const [backups, setBackups] = useState<Backup[]>(mockBackups);
  const [isAutoBackupEnabled, setIsAutoBackupEnabled] = useState(true);
  const [backupSchedule, setBackupSchedule] = useState("02:00");
  const [retentionDays, setRetentionDays] = useState("30");
  const [adminEmail, setAdminEmail] = useState("admin@djairrota.com.br");
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);

  const handleCreateBackup = async () => {
    setIsCreatingBackup(true);
    toast.info("Criando backup do banco de dados...");

    // Simular criação de backup
    setTimeout(() => {
      const newBackup: Backup = {
        id: Date.now().toString(),
        date: new Date().toLocaleString("pt-BR"),
        size: "45.5 MB",
        status: "success",
        path: `s3://backups/backup-${Date.now()}.sql`,
      };

      setBackups([newBackup, ...backups]);
      setIsCreatingBackup(false);
      toast.success("Backup criado com sucesso!");
    }, 3000);
  };

  const handleDownloadBackup = (backup: Backup) => {
    toast.success(`Download iniciado: ${backup.path}`);
    console.log("Baixando backup:", backup);
  };

  const handleRestoreBackup = (backup: Backup) => {
    if (confirm(`Tem certeza que deseja restaurar o backup de ${backup.date}? Esta ação substituirá todos os dados atuais.`)) {
      toast.info("Restaurando backup...");
      setTimeout(() => {
        toast.success("Backup restaurado com sucesso!");
      }, 2000);
    }
  };

  const handleDeleteBackup = (backupId: string) => {
    if (confirm("Tem certeza que deseja excluir este backup?")) {
      setBackups(backups.filter((b) => b.id !== backupId));
      toast.success("Backup excluído");
    }
  };

  const handleSaveConfig = () => {
    toast.success("Configurações salvas!");
    console.log({
      isAutoBackupEnabled,
      backupSchedule,
      retentionDays,
      adminEmail,
    });
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif text-slate-800 mb-2">Gerenciamento de Backups</h1>
            <p className="text-slate-600">Configure e gerencie backups automáticos do banco de dados</p>
          </div>
          <Button 
            onClick={handleCreateBackup} 
            disabled={isCreatingBackup}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isCreatingBackup ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Criando...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Criar Backup Agora
              </>
            )}
          </Button>
        </div>

        {/* Configurações */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-serif text-xl">Configurações de Backup Automático</CardTitle>
            <CardDescription>Configure a rotina de backups diários</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-semibold">Backup Automático</Label>
                <p className="text-sm text-slate-600">Executar backup diariamente no horário configurado</p>
              </div>
              <Switch
                checked={isAutoBackupEnabled}
                onCheckedChange={setIsAutoBackupEnabled}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="schedule">Horário do Backup</Label>
                <Input
                  id="schedule"
                  type="time"
                  value={backupSchedule}
                  onChange={(e) => setBackupSchedule(e.target.value)}
                  disabled={!isAutoBackupEnabled}
                />
              </div>

              <div>
                <Label htmlFor="retention">Retenção (dias)</Label>
                <Input
                  id="retention"
                  type="number"
                  value={retentionDays}
                  onChange={(e) => setRetentionDays(e.target.value)}
                  disabled={!isAutoBackupEnabled}
                  min="1"
                  max="365"
                />
              </div>

              <div>
                <Label htmlFor="email">E-mail de Notificação</Label>
                <Input
                  id="email"
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  disabled={!isAutoBackupEnabled}
                />
              </div>
            </div>

            <Button onClick={handleSaveConfig} className="bg-green-600 hover:bg-green-700">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Salvar Configurações
            </Button>
          </CardContent>
        </Card>

        {/* Lista de Backups */}
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-xl">Histórico de Backups</CardTitle>
            <CardDescription>Backups disponíveis para download ou restauração</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {backups.map((backup) => (
                <div
                  key={backup.id}
                  className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${
                      backup.status === "success" 
                        ? "bg-green-100 text-green-600" 
                        : "bg-red-100 text-red-600"
                    }`}>
                      {backup.status === "success" ? (
                        <Database className="h-5 w-5" />
                      ) : (
                        <AlertCircle className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-slate-500" />
                        <span className="font-medium text-slate-800">{backup.date}</span>
                      </div>
                      <p className="text-sm text-slate-600 mt-1">
                        Tamanho: {backup.size} • {backup.path}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadBackup(backup)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Baixar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRestoreBackup(backup)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Restaurar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteBackup(backup.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {backups.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                  <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum backup disponível</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
