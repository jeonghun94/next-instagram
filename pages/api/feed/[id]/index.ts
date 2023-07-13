import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@/lib/server/withHandler";
import { withApiSession } from "@/lib/server/withSession";
import client from "@/lib/server/db";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  console.log("req.query", req.query);

  console.log("dsdsd");

  return res.json({
    ok: true,
  });
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
