import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@/lib/server/withHandler";
import { withApiSession } from "@/lib/server/withSession";
import client from "@/lib/server/db";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { email } = req.body;

  try {
    const user = await client.instagramUser.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        ok: false,
        error: "해당 이메일로 가입된 정보가 존재하지 않습니다.",
      });
    }

    const passwordLength = user.password.length;
    const hiddenPassword =
      user.password.substring(0, Math.floor(passwordLength / 2)) +
      "*".repeat(Math.ceil(passwordLength / 2));

    return res.json({ ok: true, password: hiddenPassword });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: "서버 오류가 발생했습니다.",
    });
  }
}

export default withApiSession(withHandler({ methods: ["POST"], handler }));
