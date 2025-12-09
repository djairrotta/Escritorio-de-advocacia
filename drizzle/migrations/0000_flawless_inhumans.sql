CREATE TABLE `audit_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`action` varchar(50) NOT NULL,
	`entity` varchar(50) NOT NULL,
	`entity_id` int NOT NULL,
	`details` varchar(500),
	`user_id` int NOT NULL,
	`user_name` varchar(255) NOT NULL,
	`user_role` varchar(50) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `audit_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `calendar_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`type` enum('audiencia','prazo','reuniao','outro') NOT NULL,
	`start_date` timestamp NOT NULL,
	`end_date` timestamp,
	`all_day` boolean NOT NULL DEFAULT false,
	`phone` varchar(20),
	`notes` text,
	`legal_case_id` int,
	`created_by_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `calendar_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `clients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`cpf` varchar(14),
	`phone` varchar(20),
	`address` text,
	`city` varchar(100),
	`state` varchar(2),
	`zip_code` varchar(10),
	`active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `clients_id` PRIMARY KEY(`id`),
	CONSTRAINT `clients_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `documents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`legal_case_id` int,
	`calendar_event_id` int,
	`name` varchar(255) NOT NULL,
	`file_url` varchar(500) NOT NULL,
	`file_key` varchar(500) NOT NULL,
	`mime_type` varchar(100),
	`size` int,
	`uploaded_by_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `documents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `hearings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`legal_case_id` int NOT NULL,
	`type` varchar(100) NOT NULL,
	`date` timestamp NOT NULL,
	`location` varchar(255),
	`notes` text,
	`status` enum('agendada','realizada','cancelada') NOT NULL DEFAULT 'agendada',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `hearings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `legal_cases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`case_number` varchar(100) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`area` varchar(100) NOT NULL,
	`status` enum('ativo','concluido','arquivado') NOT NULL DEFAULT 'ativo',
	`court` varchar(255),
	`client_id` int NOT NULL,
	`assigned_to_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `legal_cases_id` PRIMARY KEY(`id`),
	CONSTRAINT `legal_cases_case_number_unique` UNIQUE(`case_number`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`recipient_type` enum('client','user') NOT NULL,
	`recipient_id` int NOT NULL,
	`recipient_email` varchar(255),
	`recipient_phone` varchar(20),
	`type` enum('email','whatsapp') NOT NULL,
	`subject` varchar(255),
	`message` text NOT NULL,
	`status` enum('pending','sent','failed') NOT NULL DEFAULT 'pending',
	`sent_at` timestamp,
	`error_message` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`role` enum('master','moderador','advogado') NOT NULL DEFAULT 'advogado',
	`oab` varchar(50),
	`phone` varchar(20),
	`active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `whatsapp_config` (
	`id` int AUTO_INCREMENT NOT NULL,
	`link_id` varchar(255) NOT NULL,
	`token` varchar(500) NOT NULL,
	`phone_number` varchar(20) NOT NULL,
	`active` boolean NOT NULL DEFAULT true,
	`updated_by_id` int NOT NULL,
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `whatsapp_config_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `audit_logs` ADD CONSTRAINT `audit_logs_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `calendar_events` ADD CONSTRAINT `calendar_events_legal_case_id_legal_cases_id_fk` FOREIGN KEY (`legal_case_id`) REFERENCES `legal_cases`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `calendar_events` ADD CONSTRAINT `calendar_events_created_by_id_users_id_fk` FOREIGN KEY (`created_by_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `documents` ADD CONSTRAINT `documents_legal_case_id_legal_cases_id_fk` FOREIGN KEY (`legal_case_id`) REFERENCES `legal_cases`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `documents` ADD CONSTRAINT `documents_calendar_event_id_calendar_events_id_fk` FOREIGN KEY (`calendar_event_id`) REFERENCES `calendar_events`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `documents` ADD CONSTRAINT `documents_uploaded_by_id_users_id_fk` FOREIGN KEY (`uploaded_by_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `hearings` ADD CONSTRAINT `hearings_legal_case_id_legal_cases_id_fk` FOREIGN KEY (`legal_case_id`) REFERENCES `legal_cases`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `legal_cases` ADD CONSTRAINT `legal_cases_client_id_clients_id_fk` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `legal_cases` ADD CONSTRAINT `legal_cases_assigned_to_id_users_id_fk` FOREIGN KEY (`assigned_to_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `whatsapp_config` ADD CONSTRAINT `whatsapp_config_updated_by_id_users_id_fk` FOREIGN KEY (`updated_by_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;