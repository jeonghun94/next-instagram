import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@/lib/server/withHandler";
import { withApiSession } from "@/lib/server/withSession";
import client from "@/lib/server/db";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const userId = Number(req.session.user?.id);

  const replies = await client.reply.findMany({
    where: {
      userId,
    },
    include: {
      tweet: {
        include: {
          user: true,
          _count: {
            select: {
              replys: true,
              likes: true,
            },
          },
        },
      },
    },
  });

  res.json({
    ok: true,
    replies,
  });
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
