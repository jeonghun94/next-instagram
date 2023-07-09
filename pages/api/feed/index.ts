import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "../../../lib/server/withHandler";
import { withApiSession } from "../../../lib/server/withSession";
import client from "../../../lib/server/db";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "GET") {
    const feeds = await client.instagramFeed.findMany({
      include: {
        user: true,
        _count: {
          select: {
            replys: true,
            likes: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log(feeds, "ds");

    res.json({
      ok: true,
      feeds,
    });
  } else {
    const { text, photoId } = req.body;

    await client.instagramFeed.create({
      data: {
        text,
        userId: Number(req.session.user?.id),
        imageUrl: photoId,
      },
    });

    res.json({ ok: true });
  }
}

export default withApiSession(
  withHandler({ methods: ["GET", "POST"], handler })
);
