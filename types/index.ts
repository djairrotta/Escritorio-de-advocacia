export interface User {
  id: number;
  name: string;
  email: string;
  role: "master" | "moderador" | "advogado";
}

export interface AuditLog {
  id: number;
  userId: number;
  userName: string;
  action: "criar" | "editar" | "excluir";
  entity: "cliente" | "processo" | "documento" | "tarefa" | "atendimento" | "audiencia";
  entityId: number;
  details: string;
  timestamp: Date;
}

export interface Client {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  cpf?: string;
  address?: string;
}

export interface LegalCase {
  id: number;
  caseNumber: string;
  title: string;
  description?: string;
  client: Client;
  assignedTo: User;
  status: "ativo" | "arquivado" | "concluído";
  court?: string;
  area: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Hearing {
  id: number;
  caseId: number;
  caseNumber: string;
  caseTitle: string;
  date: Date;
  location: string;
  notes?: string;
  completed: boolean;
}

export interface Activity {
  id: number;
  type: "processo" | "audiencia" | "documento" | "cliente";
  title: string;
  description: string;
  timestamp: Date;
  user: string;
}
