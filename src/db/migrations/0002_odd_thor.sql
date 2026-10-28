CREATE TABLE `candidaturas` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`area` text NOT NULL,
	`nome` text NOT NULL,
	`email` text NOT NULL,
	`telefone` text NOT NULL,
	`cidade` text NOT NULL,
	`respostas` text,
	`observacoes` text,
	`curriculoUrl` text NOT NULL,
	`curriculoNome` text NOT NULL,
	`status` text DEFAULT 'novo' NOT NULL,
	`createdAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
