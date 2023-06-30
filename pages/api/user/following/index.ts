import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@/lib/server/withHandler";
import { withApiSession } from "@/lib/server/withSession";
import client from "@/lib/server/db";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const userId = req.session.user?.id;

  const user = await client.user.findFirst({
    where: {
      id: userId,
    },
    include: {
      following: true,
    },
  });

  const followingIds = user?.following.map((following) => following.followerId);

  const tweets = await client.tweet.findMany({
    where: {
      userId: {
        in: followingIds,
      },
    },
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  res.json({
    ok: true,
    tweets,
  });
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
