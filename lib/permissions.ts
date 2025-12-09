import type { AuditLog } from "@/types";

export type UserRole = "master" | "moderador" | "advogado";

export interface UserPermissions {
  canViewAll: boolean;
  canAssignTasks: boolean;
  canManageUsers: boolean;
  canViewReports: boolean;
  canConfigureEmail: boolean;
  canManageClients: boolean;
  canManageCases: boolean;
}

// Verificar se o usuário tem permissão para operações críticas
export function canPerformCriticalOperation(): boolean {
  const role = localStorage.getItem("advogado_role");
  return role === "Master" || role === "Moderador";
}

/**
 * Retorna as permissões baseadas no role do usuário
 */
export function getUserPermissions(role: UserRole): UserPermissions {
  switch (role) {
    case "master":
      return {
        canViewAll: true,
        canAssignTasks: true,
        canManageUsers: true,
        canViewReports: true,
        canConfigureEmail: true,
        canManageClients: true,
        canManageCases: true,
      };
    case "moderador":
      return {
        canViewAll: true,
        canAssignTasks: true,
        canManageUsers: false,
        canViewReports: false,
        canConfigureEmail: false,
        canManageClients: true,
        canManageCases: true,
      };
    case "advogado":
      return {
        canViewAll: false,
        canAssignTasks: false,
        canManageUsers: false,
        canViewReports: false,
        canConfigureEmail: false,
        canManageClients: false,
        canManageCases: false,
      };
    default:
      return {
        canViewAll: false,
        canAssignTasks: false,
        canManageUsers: false,
        canViewReports: false,
        canConfigureEmail: false,
        canManageClients: false,
        canManageCases: false,
      };
  }
}

/**
 * Verifica se o usuário tem permissão específica
 */
export function checkPermission(role: UserRole, permission: keyof UserPermissions): boolean {
  const permissions = getUserPermissions(role);
  return permissions[permission];
}

/**
 * Retorna o role do usuário logado
 */
export function getCurrentUserRole(): UserRole {
  const role = localStorage.getItem("advogado_role");
  
  if (role === "Master") return "master";
  if (role === "Moderador") return "moderador";
  return "advogado";
}

/**
 * Retorna o ID do usuário logado
 */
export function getCurrentUserId(): number {
  return parseInt(localStorage.getItem("advogado_id") || "1", 10);
}

/**
 * Verifica se o usuário pode visualizar todos os registros
 */
export function canViewAll(): boolean {
  const role = getCurrentUserRole();
  return checkPermission(role, "canViewAll");
}

/**
 * Verifica se o usuário pode atribuir tarefas/eventos a outros
 */
export function canAssignTasks(): boolean {
  const role = getCurrentUserRole();
  return checkPermission(role, "canAssignTasks");
}

/**
 * Verifica se o usuário pode acessar relatórios
 */
export function canViewReports(): boolean {
  const role = getCurrentUserRole();
  return checkPermission(role, "canViewReports");
}

/**
 * Verifica se o usuário pode configurar e-mails
 */
export function canConfigureEmail(): boolean {
  const role = getCurrentUserRole();
  return checkPermission(role, "canConfigureEmail");
}

/**
 * Filtra itens baseado nas permissões do usuário
 */
export function filterByPermission<T extends { assignedTo?: number }>(  items: T[],
  currentUserId: number
): T[] {
  if (canViewAll()) {
    return items;
  }
  
  // Advogados veem apenas o que foi atribuído a eles
  return items.filter((item) => item.assignedTo === currentUserId);
}

// Verificar permissões específicas por role
export function hasPermission(role: "Master" | "Moderador" | "Advogado", action: "criar" | "editar" | "excluir"): boolean {
  const permissions = {
    Master: ["criar", "editar", "excluir"],
    Moderador: ["criar", "editar", "excluir"],
    Advogado: ["criar", "editar"], // Advogados não podem excluir
  };
  return permissions[role]?.includes(action) || false;
}

// Registrar log de auditoria
export function logAuditAction(
  action: AuditLog["action"],
  entity: AuditLog["entity"],
  entityId: number,
  details: string
): void {
  const userId = parseInt(localStorage.getItem("advogado_user_id") || "0");
  const userName = localStorage.getItem("advogado_name") || "Usuário Desconhecido";

  const log: AuditLog = {
    id: Date.now(), // Em produção, seria gerado pelo backend
    userId,
    userName,
    action,
    entity,
    entityId,
    details,
    timestamp: new Date(),
  };

  // Armazenar logs no localStorage (em produção, seria enviado para o backend)
  const existingLogs = JSON.parse(localStorage.getItem("audit_logs") || "[]");
  existingLogs.push(log);
  localStorage.setItem("audit_logs", JSON.stringify(existingLogs));

  // Log no console para desenvolvimento
  console.log("🔒 AUDIT LOG:", log);
}

// Obter todos os logs de auditoria
export function getAuditLogs(): AuditLog[] {
  const logs = JSON.parse(localStorage.getItem("audit_logs") || "[]");
  return logs.map((log: any) => ({
    ...log,
    timestamp: new Date(log.timestamp),
  }));
}

// Exportar logs para PDF (simulação - em produção, seria gerado no backend)
export function exportAuditLogsToPDF(): void {
  const logs = getAuditLogs();
  console.log("📄 Exportando logs para PDF...", logs);
  alert(`${logs.length} logs serão exportados para PDF no servidor.`);
  // Em produção, faria uma chamada para o backend que geraria o PDF
}

// Obter descrição legível da ação
export function getActionDescription(log: AuditLog): string {
  const actionLabels = {
    criar: "criou",
    editar: "editou",
    excluir: "excluiu",
  };
  const entityLabels = {
    cliente: "cliente",
    processo: "processo",
    documento: "documento",
    tarefa: "tarefa",
    atendimento: "atendimento",
    audiencia: "audiência",
  };

  return `${log.userName} ${actionLabels[log.action]} ${entityLabels[log.entity]} #${log.entityId}: ${log.details}`;
}
