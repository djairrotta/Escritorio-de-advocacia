// Tipos e interfaces do sistema

export interface Client {
  id: number;
  name: string;
  email: string;
  cpf: string;
  rg?: string;
  birthDate?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: "master" | "moderador" | "advogado";
  oab?: string;
  phone?: string;
  active?: boolean;
}

export interface LegalCase {
  id: number;
  caseNumber: string;
  title: string;
  description?: string;
  area: string;
  status: "ativo" | "concluido" | "arquivado";
  court?: string;
  clientId: number;
  assignedToId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Document {
  id: number;
  clientId?: number;
  legalCaseId?: number;
  calendarEventId?: number;
  name: string;
  fileUrl: string;
  fileKey: string;
  mimeType?: string;
  size?: number;
  uploadedById: number;
  createdAt?: string;
}

export interface CalendarEvent {
  id: number;
  title: string;
  type: "audiencia" | "prazo" | "reuniao" | "outro";
  startDate: string;
  endDate?: string;
  allDay?: boolean;
  phone?: string;
  notes?: string;
  legalCaseId?: number;
  createdById: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Message {
  id: number;
  senderId: number;
  senderType: "advogado" | "cliente";
  receiverId: number;
  receiverType: "advogado" | "cliente";
  content: string;
  attachments?: string;
  read?: boolean;
  createdAt?: string;
}

export interface Notification {
  id: number;
  type: "email" | "whatsapp";
  recipient: string;
  subject?: string;
  message: string;
  status: "pendente" | "enviado" | "falhou";
  error?: string;
  sentAt?: string;
  createdAt?: string;
}

export interface AuditLog {
  id: number;
  action: string;
  entity: string;
  entityId: number;
  details?: string;
  userId: number;
  userName: string;
  userRole: string;
  timestamp?: string;
}
