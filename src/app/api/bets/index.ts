import { NextApiRequest, NextApiResponse } from 'next';
import { getBets, createBet } from '../../utils/bets';

// GET /api/bets - List all bets
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
      // Logic to list current and past bets
      const { page, limit, status, user_id } = req.query;
      const bets = await getBets({ page, limit, status, user_id });
      res.status(200).json(bets);
    } else if (req.method === 'POST') {
        const { user2_handle, user1Amount, text, mediator_handle } = req.body;
        const newBet = await createBet({ user2_handle, user1Amount, text, mediator_handle });
        res.status(201).json(newBet);
      } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
      }
  }