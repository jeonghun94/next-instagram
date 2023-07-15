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

  const feedId = Number(id);
  const userId = Number(user?.id);

  const exists = await client.instagramBookMark.findFirst({
    where: {
      feedId,
      userId,
    },
  });

  if (exists) {
    await client.instagramBookMark.delete({
      where: {
        id: exists.id,
      },
    });
  } else {
    await client.instagramBookMark.create({
      data: {
        user: { connect: { id: userId } },
        feed: { connect: { id: feedId } },
      },
    });
  }

  return res.json({
    ok: true,
  });
}

export default withApiSession(withHandler({ methods: ["POST"], handler }));
