CREATE TABLE `city_players` (
	`user_id` text PRIMARY KEY NOT NULL,
	`public_id` text NOT NULL,
	`name` text NOT NULL,
	`x` real NOT NULL,
	`z` real NOT NULL,
	`yaw` real NOT NULL,
	`updated` integer NOT NULL
);
