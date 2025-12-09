import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import PermissionGuard from "@/components/PermissionGuard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAuditLogs, exportAuditLogsToPDF, getActionDescription } from "@/lib/permissions";
import type { AuditLog } from "@/types";
import { Download, Shield, Clock } from "lucide-react";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    setLogs(getAuditLogs());
  }, []);

  const getActionColor = (action: AuditLog["action"]) => {
    switch (action) {
      case "criar": return "text-green-600 bg-green-100";
      case "editar": return "text-blue-600 bg-blue-100";
      case "excluir": return "text-red-600 bg-red-100";
    }
  };

  return (
    <DashboardLayout>
      <PermissionGuard>
        <div className="p-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-serif text-slate-800 mb-2 flex items-center gap-3">
                  <Shield className="h-8 w-8 text-slate-600" />
                  Logs de Auditoria
                </h1>
                <p className="text-slate-600">{logs.length} registros de ações administrativas</p>
              </div>
              <Button 
                className="bg-slate-800 hover:bg-slate-900"
                onClick={exportAuditLogsToPDF}
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar para PDF
              </Button>
            </div>
          </div>

          {logs.length === 0 ? (
            <Card className="p-12 text-center">
              <Shield className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">Nenhum log registrado</h3>
              <p className="text-slate-500">
                As ações de criar, editar e excluir serão registradas automaticamente aqui.
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {logs.reverse().map((log) => (
                <Card key={log.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getActionColor(log.action)}`}>
                          {log.action.toUpperCase()}
                        </span>
                        <span className="text-sm font-medium text-slate-800">
                          {getActionDescription(log)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Clock className="h-3 w-3" />
                        <span>{log.timestamp.toLocaleString("pt-BR")}</span>
                        <span>•</span>
                        <span>Usuário ID: {log.userId}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          <Card className="mt-8 p-6 bg-amber-50 border-amber-200">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-900 mb-1">Sobre os Logs de Auditoria</h3>
                <p className="text-sm text-amber-700">
                  Todos os logs são armazenados de forma permanente no servidor e podem ser exportados para PDF.
                  Em produção, estes logs seriam enviados automaticamente para o backend e armazenados em banco de dados seguro.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </PermissionGuard>
    </DashboardLayout>
  );
}
