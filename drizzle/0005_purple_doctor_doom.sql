ALTER TABLE `projects` ADD `slug` varchar(100);--> statement-breakpoint
ALTER TABLE `projects` ADD `period` varchar(100);--> statement-breakpoint
ALTER TABLE `projects` ADD `featured` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `skills` ADD `level` int DEFAULT 3 NOT NULL;--> statement-breakpoint
ALTER TABLE `skills` ADD `projectSlugs` json;--> statement-breakpoint
ALTER TABLE `projects` ADD CONSTRAINT `projects_slug_unique` UNIQUE(`slug`);