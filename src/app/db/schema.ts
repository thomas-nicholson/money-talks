// db/schema.ts
import { pgTable, text, uuid, timestamp, boolean, numeric } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  handle: text('handle').unique().notNull(),
  email: text('email').unique().notNull(),
  password: text('password').notNull(),
  is_mediator: boolean('is_mediator').default(false),
  profile_picture: text('profile_picture'),
  bio: text('bio'),
  created_at: timestamp('created_at').defaultNow(),
  last_login: timestamp('last_login'),
});

export const bets = pgTable('bets', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  user1: uuid('user1').references(() => users.id).notNull(),
  user2: uuid('user2').references(() => users.id).notNull(),
  user1Amount: numeric('user1Amount').notNull(),
  user2Amount: numeric('user2Amount').notNull(),
  totalAmount: numeric('totalAmount').notNull(),
  stripe_payment_id: text('stripe_payment_id'),
  status: text('status').notNull(), // Use text for status field
  mediator_id: uuid('mediator_id').references(() => users.id),
  created_at: timestamp('created_at').defaultNow().notNull(),
  resolved_at: timestamp('resolved_at'),
});

// Define allowed statuses for enum-like validation
export const BetStatus = ['pending', 'accepted', 'resolved', 'mediated'] as const;
export type BetStatusType = typeof BetStatus[number];
