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
    body: { text },
  } = req;

  const userId = Number(user?.id);
  const feedId = Number(id);

  if (req.method === "GET") {
    const feed = await client.instagramFeed.findUnique({
      where: { id: Number(id) },
      include: {
        user: true,
        replys: {
          include: {
            user: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    return res.json({
      ok: true,
      replys: feed?.replys,
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
