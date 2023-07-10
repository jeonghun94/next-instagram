import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@/lib/server/withHandler";
import { withApiSession } from "@/lib/server/withSession";
import client from "@/lib/server/db";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const followerId = Number(req.session.user?.id);

  const followingIds = await client.instagramFollows.findMany({
    where: { followerId },
    select: { followingId: true },
  });

  const feeds = await client.instagramFeed.findMany({
    where: { userId: { in: followingIds.map((item) => item.followingId) } },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          avatarUrl: true,
          name: true,
        },
      },
      _count: { select: { replys: true, likes: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return res.json({
    ok: true,
    feeds,
  });
}

export default withApiSession(
  withHandler({ methods: ["GET", "POST"], handler })
);
