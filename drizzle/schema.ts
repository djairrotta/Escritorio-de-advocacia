import { mysqlTable, varchar, text, timestamp, int, boolean, mysqlEnum, json, date } from "drizzle-orm/mysql-core";

// Tabela de Usuários (Advogados)
export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: mysqlEnum("role", ["master", "moderador", "advogado"]).notNull().default("advogado"),
  oab: varchar("oab", { length: 50 }),
  phone: varchar("phone", { length: 20 }),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

// Tabela de Clientes
export const clients = mysqlTable("clients", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(), // Para login no portal do cliente
  cpf: varchar("cpf", { length: 14 }),
  rg: varchar("rg", { length: 20 }), // Novo campo RG
  birthDate: date("birth_date"), // Data de aniversário
  phone: varchar("phone", { length: 20 }),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 2 }),
  zipCode: varchar("zip_code", { length: 10 }),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

// Tabela de Processos
export const legalCases = mysqlTable("legal_cases", {
  id: int("id").primaryKey().autoincrement(),
  caseNumber: varchar("case_number", { length: 100 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  area: varchar("area", { length: 100 }).notNull(),
  status: mysqlEnum("status", ["ativo", "concluido", "arquivado"]).notNull().default("ativo"),
  court: varchar("court", { length: 255 }),
  clientId: int("client_id").notNull().references(() => clients.id),
  assignedToId: int("assigned_to_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

// Tabela de Audiências
export const hearings = mysqlTable("hearings", {
  id: int("id").primaryKey().autoincrement(),
  legalCaseId: int("legal_case_id").notNull().references(() => legalCases.id),
  type: varchar("type", { length: 100 }).notNull(),
  date: timestamp("date").notNull(),
  location: varchar("location", { length: 255 }),
  notes: text("notes"),
  status: mysqlEnum("status", ["agendada", "realizada", "cancelada"]).notNull().default("agendada"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

// Tabela de Documentos
export const documents = mysqlTable("documents", {
  id: int("id").primaryKey().autoincrement(),
  clientId: int("client_id").references(() => clients.id), // Vinculação direta com cliente
  legalCaseId: int("legal_case_id").references(() => legalCases.id),
  calendarEventId: int("calendar_event_id").references(() => calendarEvents.id),
  name: varchar("name", { length: 255 }).notNull(),
  fileUrl: varchar("file_url", { length: 500 }).notNull(),
  fileKey: varchar("file_key", { length: 500 }).notNull(),
  mimeType: varchar("mime_type", { length: 100 }),
  size: int("size"), // em bytes
  extractedText: text("extracted_text"), // Texto extraído via OCR para busca
  tags: varchar("tags", { length: 500 }), // Tags separadas por vírgula (ex: "urgente,contrato,procuração")
  uploadedById: int("uploaded_by_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Tabela de Eventos do Calendário
export const calendarEvents = mysqlTable("calendar_events", {
  id: int("id").primaryKey().autoincrement(),
  title: varchar("title", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["audiencia", "prazo", "reuniao", "outro"]).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  allDay: boolean("all_day").notNull().default(false),
  phone: varchar("phone", { length: 20 }),
  notes: text("notes"),
  legalCaseId: int("legal_case_id").references(() => legalCases.id),
  createdById: int("created_by_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

// Tabela de Logs de Auditoria
export const auditLogs = mysqlTable("audit_logs", {
  id: int("id").primaryKey().autoincrement(),
  action: varchar("action", { length: 50 }).notNull(), // criar, editar, excluir, etc
  entity: varchar("entity", { length: 50 }).notNull(), // processo, cliente, audiencia, etc
  entityId: int("entity_id").notNull(),
  details: varchar("details", { length: 500 }),
  userId: int("user_id").notNull().references(() => users.id),
  userName: varchar("user_name", { length: 255 }).notNull(),
  userRole: varchar("user_role", { length: 50 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Tabela de Notificações
export const notifications = mysqlTable("notifications", {
  id: int("id").primaryKey().autoincrement(),
  recipientType: mysqlEnum("recipient_type", ["client", "user"]).notNull(),
  recipientId: int("recipient_id").notNull(),
  recipientEmail: varchar("recipient_email", { length: 255 }),
  recipientPhone: varchar("recipient_phone", { length: 20 }),
  type: mysqlEnum("type", ["email", "whatsapp"]).notNull(),
  subject: varchar("subject", { length: 255 }),
  message: text("message").notNull(),
  status: mysqlEnum("status", ["pending", "sent", "failed"]).notNull().default("pending"),
  sentAt: timestamp("sent_at"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Tabela de Configuração do WhatsApp (apenas Master pode editar)
export const whatsappConfig = mysqlTable("whatsapp_config", {
  id: int("id").primaryKey().autoincrement(),
  linkId: varchar("link_id", { length: 255 }).notNull(),
  token: varchar("token", { length: 500 }).notNull(),
  phoneNumber: varchar("phone_number", { length: 20 }).notNull(),
  active: boolean("active").notNull().default(true),
  updatedById: int("updated_by_id").notNull().references(() => users.id),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

// Tipos TypeScript inferidos
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Client = typeof clients.$inferSelect;
export type NewClient = typeof clients.$inferInsert;

export type LegalCase = typeof legalCases.$inferSelect;
export type NewLegalCase = typeof legalCases.$inferInsert;

export type Hearing = typeof hearings.$inferSelect;
export type NewHearing = typeof hearings.$inferInsert;

export type Document = typeof documents.$inferSelect;
export type NewDocument = typeof documents.$inferInsert;

export type CalendarEvent = typeof calendarEvents.$inferSelect;
export type NewCalendarEvent = typeof calendarEvents.$inferInsert;

export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;

export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;

export type WhatsappConfig = typeof whatsappConfig.$inferSelect;
export type NewWhatsappConfig = typeof whatsappConfig.$inferInsert;

// Tabela de Mensagens (Chat Cliente-Advogado)
export const messages = mysqlTable("messages", {
  id: int("id").primaryKey().autoincrement(),
  senderType: mysqlEnum("sender_type", ["client", "user"]).notNull(),
  senderId: int("sender_id").notNull(),
  senderName: varchar("sender_name", { length: 255 }).notNull(),
  recipientType: mysqlEnum("recipient_type", ["client", "user"]).notNull(),
  recipientId: int("recipient_id").notNull(),
  recipientName: varchar("recipient_name", { length: 255 }).notNull(),
  message: text("message").notNull(),
  attachments: text("attachments"), // JSON string array de URLs
  legalCaseId: int("legal_case_id").references(() => legalCases.id),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
