import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@/lib/server/withHandler";
import { withApiSession } from "@/lib/server/withSession";
import client from "@/lib/server/db";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    session: { user },
    body: { text },
    query: { id },
  } = req;

  const userId = Number(user?.id);
  const feedId = Number(id);

  if (req.method === "GET") {
    const feed = await client.instagramFeed.findUnique({
      where: { id: Number(id) },
      include: {
        user: true,
        replies: {
          include: {
            user: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    return res.json({
      ok: true,
      replys: feed?.replies,
    });
  } else {
    const newNeply = await client.instagramReply.create({
      data: {
        feedId,
        userId,
        text,
      },
      include: {
        user: true,
      },
    });

    return res.json({
      ok: true,
      reply: newNeply,
    });
  }
}

export default withApiSession(
  withHandler({ methods: ["GET", "POST"], handler })
);
