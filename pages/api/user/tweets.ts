import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@/lib/server/withHandler";
import { withApiSession } from "@/lib/server/withSession";
import client from "@/lib/server/db";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const userId = Number(req.session.user?.id);

  const tweets = await client.tweet.findMany({
    where: {
      userId,
    },
    include: {
      user: true,
      _count: {
        select: {
          replys: true,
          likes: true,
        },
      },
    },
  });

  res.json({
    ok: true,
    tweets,
  });
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
