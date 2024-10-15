import { NextApiRequest, NextApiResponse } from 'next';
import { getBetById } from '../../utils/bets';

// GET /api/bet/[id] - Get details of a specific bet
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
      const { id } = req.query;
      const bet = await getBetById(id);
      res.status(200).json(bet);
    } else {
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }