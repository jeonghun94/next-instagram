import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "../../lib/server/withHandler";
import { withApiSession } from "../../lib/server/withSession";
import client from "../../lib/server/db";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const profile = await client.instagramUser.findUnique({
    where: { id: req.session.user?.id },
    include: {
      feeds: {
        orderBy: { createdAt: "desc" },
      },
      _count: true,
    },
  });

  res.json({
    ok: true,
    profile,
  });
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
