CREATE TABLE `messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sender_type` enum('client','user') NOT NULL,
	`sender_id` int NOT NULL,
	`sender_name` varchar(255) NOT NULL,
	`recipient_type` enum('client','user') NOT NULL,
	`recipient_id` int NOT NULL,
	`recipient_name` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`legal_case_id` int,
	`is_read` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `messages` ADD CONSTRAINT `messages_legal_case_id_legal_cases_id_fk` FOREIGN KEY (`legal_case_id`) REFERENCES `legal_cases`(`id`) ON DELETE no action ON UPDATE no action;