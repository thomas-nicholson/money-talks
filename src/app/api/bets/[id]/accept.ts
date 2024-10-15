import { NextApiRequest, NextApiResponse } from "next";
import { updateBetStatus } from "@/app/utils/bets";


// POST /api/bet/[id]/accept - Accept or reject a bet
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
      const { id } = req.query;
      const { accept } = req.body;
      const updatedBet = await updateBetStatus(id, accept);
      res.status(200).json(updatedBet);
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }