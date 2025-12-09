ALTER TABLE `clients` ADD `rg` varchar(20);--> statement-breakpoint
ALTER TABLE `documents` ADD `client_id` int;--> statement-breakpoint
ALTER TABLE `documents` ADD CONSTRAINT `documents_client_id_clients_id_fk` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE no action ON UPDATE no action;