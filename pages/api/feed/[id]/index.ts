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

  return res.json({
    ok: true,
    isLiked,
    isBookmarked: false,
  });
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
