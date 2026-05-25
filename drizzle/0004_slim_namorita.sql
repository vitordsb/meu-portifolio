CREATE TABLE `timeline_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`dateLabel` varchar(50) NOT NULL,
	`sortDate` varchar(10) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`category` varchar(80),
	`icon` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `timeline_events_id` PRIMARY KEY(`id`)
);
