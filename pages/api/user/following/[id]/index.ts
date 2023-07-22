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

  const followingId = Number(id);
  const userId = Number(user?.id);

  const exists = await client.instagramFollows.findFirst({
    where: {
      followingId,
      followerId: userId,
    },
  });

  if (exists) {
    await client.instagramFollows.delete({
      where: {
        id: exists.id,
      },
    });
  } else {
    await client.instagramFollows.create({
      data: {
        follower: { connect: { id: userId } },
        following: { connect: { id: followingId } },
      },
    });
  }

  // if (!userId) {
  //   return res.status(401).json({
  //     ok: false,
  //     error: "Unauthorized",
  //   });
  // }

  res.json({
    ok: true,
  });
}

export default withApiSession(withHandler({ methods: ["POST"], handler }));
