import {sqliteTable,text,integer,real} from 'drizzle-orm/sqlite-core';
export const players=sqliteTable('city_players',{userId:text('user_id').primaryKey(),publicId:text('public_id').notNull(),name:text('name').notNull(),x:real('x').notNull(),z:real('z').notNull(),yaw:real('yaw').notNull(),updated:integer('updated').notNull()});
