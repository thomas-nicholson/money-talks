export type Bet = {
  id: string;
  user1: string;
  user2: string;
  user1Amount: number;
  user2Amount: number;
  totalAmount: number;
  stripe_payment_id: string | null;
  status: string;
  mediator_id: string | null;
  created_at: Date;
  resolved_at: Date | null;
};