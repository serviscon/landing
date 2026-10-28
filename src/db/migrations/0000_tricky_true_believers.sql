CREATE TABLE `noticias` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`titulo` text NOT NULL,
	`resumo` text NOT NULL,
	`categoria` text NOT NULL,
	`data` text NOT NULL,
	`imagemUrl` text,
	`conteudo` text NOT NULL,
	`slug` text NOT NULL,
	`status` text DEFAULT 'rascunho' NOT NULL,
	`deletedAt` text,
	`createdAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `noticias_slug_unique` ON `noticias` (`slug`);