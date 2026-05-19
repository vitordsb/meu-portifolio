CREATE TABLE `freelance_work` (
	`id` int AUTO_INCREMENT NOT NULL,
	`company` varchar(255) NOT NULL,
	`companyLogoUrl` text,
	`role` varchar(255),
	`description` text NOT NULL,
	`period` varchar(100),
	`website` varchar(500),
	`displayOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `freelance_work_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `certificates` ADD `tags` json;--> statement-breakpoint
ALTER TABLE `projects` ADD `tags` json;--> statement-breakpoint
ALTER TABLE `users` ADD `username` varchar(64);--> statement-breakpoint
ALTER TABLE `users` ADD `passwordHash` text;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_username_unique` UNIQUE(`username`);