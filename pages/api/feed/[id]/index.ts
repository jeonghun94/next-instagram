import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@/lib/server/withHandler";
import { withApiSession } from "@/lib/server/withSession";
import client from "@/lib/server/db";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { id },
    session: { user },
  } = req;

  const feed = await client.instagramFeed.findUnique({
    where: { id: Number(id) },
    include: { user: true },
  });

  const isLiked = Boolean(
    await client.instagramLike.findFirst({
      where: {
        feedId: feed?.id,
        userId: user?.id,
      },
      select: {
        id: true,
      },
    })
  );

  const isBookmarked = Boolean(
    await client.instagramBookMark.findFirst({
      where: {
        feedId: feed?.id,
        userId: user?.id,
      },
      select: {
        id: true,
      },
    })
  );

  const replies = await client.instagramReply.findMany({
    where: {
      feedId: feed?.id,
    },
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return res.json({
    ok: true,
    replies,
    isBookmarked,
    isLiked,
  });
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
