import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "../../../lib/server/withHandler";
import { withApiSession } from "../../../lib/server/withSession";
import client from "../../../lib/server/db";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const id = Number(req.session.user?.id);
  const { name, avatarUrl } = req.body;

  await client.user.update({
    where: {
      id,
    },
    data: {
      name,
      avatarUrl,
    },
  });

  res.json({
    ok: true,
  });
}

export default withApiSession(
  withHandler({ methods: ["GET", "POST"], handler })
);
