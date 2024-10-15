// bets.ts
import { db } from './drizzle';
import { eq, and, or } from 'drizzle-orm/expressions';
import { bets, users, BetStatus } from '../db/schema';
import { Bet } from '../types/Bet';
import { InferSelectModel } from 'drizzle-orm';
import { uuid } from 'drizzle-orm/pg-core';


type BetModel = InferSelectModel<typeof bets>;
type UserModel = InferSelectModel<typeof users>;

export const getBets = async (user_id: string): Promise<Bet[]> => {
  const result = await db
    .select()
    .from(bets)
    .where(
      or(eq(bets.user1, user_id), eq(bets.user2, user_id))
    )
    .orderBy(bets.created_at);

  return result.map(parseBet);
};

export const getBetById = async (id: string): Promise<Bet | null> => {
  const result = await db.select().from(bets).where(eq(bets.id, id));
  return result.length ? parseBet(result[0]) : null;
};

// Create a bet with validation
export const createBet = async ({ user2_handle, user1Amount, text, mediator_handle }: { user2_handle: string; user1Amount: number; text: string; mediator_handle: string; status: string }): Promise<Bet> => {
  if (!BetStatus.includes(status as any)) {
    throw new Error(`Invalid status value. Allowed values are: ${BetStatus.join(', ')}`);
  }

  const user2 = await db.select({ id: users.id }).from(users).where(eq(users.handle, user2_handle)).limit(1);
  const mediator = await db.select({ id: users.id }).from(users).where(eq(users.handle, mediator_handle)).limit(1);

  const [newBet] = await db.insert(bets).values({
    user1: uuid(), // This would come from authenticated user
    user2: user2.length ? user2[0].id : null,
    user1Amount,
    user2Amount: user1Amount,
    totalAmount: user1Amount * 2,
    mediator_id: mediator.length ? mediator[0].id : null,
    status,
    created_at: new Date(),
  }).returning();

  return parseBet(newBet);
};

export const updateBetStatus = async (id: string, accept: boolean): Promise<Bet | null> => {
  const [updatedBet] = await db.update(bets).set({
    status: accept ? 'accepted' : 'pending',
  }).where(eq(bets.id, id)).returning();

  return updatedBet ? parseBet(updatedBet) : null;
};

export const resolveBetByMediator = async (id: string, winner: string): Promise<Bet | null> => {
  const [resolvedBet] = await db.update(bets).set({
    status: 'resolved',
    resolved_at: new Date(),
  }).where(eq(bets.id, id)).returning();

  return resolvedBet ? parseBet(resolvedBet) : null;
};

export const updateMediatorRole = async (id: string, accept: boolean): Promise<Bet | null> => {
  const [updatedBet] = await db.update(bets).set({
    status: accept ? 'mediated' : 'pending',
  }).where(eq(bets.id, id)).returning();

  return updatedBet ? parseBet(updatedBet) : null;
};

export const cancelBet = async (id: string): Promise<Bet | null> => {
  const [canceledBet] = await db.update(bets).set({
    status: 'canceled',
  }).where(eq(bets.id, id)).returning();

  return canceledBet ? parseBet(canceledBet) : null;
};

// Helper function to parse numeric fields
const parseBet = (bet: BetModel): Bet => ({
  id: bet.id,
  user1: bet.user1,
  user2: bet.user2,
  user1Amount: parseFloat(bet.user1Amount as unknown as string),
  user2Amount: parseFloat(bet.user2Amount as unknown as string),
  totalAmount: parseFloat(bet.totalAmount as unknown as string),
  stripe_payment_id: bet.stripe_payment_id,
  status: bet.status,
  mediator_id: bet.mediator_id,
  created_at: bet.created_at,
  resolved_at: bet.resolved_at,
});
