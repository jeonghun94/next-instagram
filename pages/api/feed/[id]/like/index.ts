import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@/lib/server/withHandler";
import { withApiSession } from "@/lib/server/withSession";
import client from "@/lib/server/db";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const userId = Number(req.session.user?.id);
  const feedId = Number(req.query.id);

  const like = await client.instagramLike.findFirst({
    where: {
      AND: [{ userId }, { feedId }],
    },
  });

  console.log("like", like);

  if (like) {
    await client.instagramLike.delete({
      where: {
        id: like.id,
      },
    });
  } else {
    await client.instagramLike.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        feed: {
          connect: {
            id: feedId,
          },
        },
      },
    });
  }

  return res.json({
    ok: true,
  });
}

export default withApiSession(
  withHandler({ methods: ["GET", "POST"], handler })
);
