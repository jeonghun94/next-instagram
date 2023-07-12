import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@/lib/server/withHandler";
import { withApiSession } from "@/lib/server/withSession";
import client from "@/lib/server/db";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  try {
    const { newAvatarUrl, name, password } = req.body;
    const userId = req.session.user?.id;

    await client.instagramUser.update({
      where: { id: Number(userId) },
      data: {
        avatarUrl: newAvatarUrl !== "" ? newAvatarUrl : undefined,
        password,
        name,
      },
    });

    res.json({ ok: true });
  } catch (error) {
    res.json({
      ok: false,
      error: "유저 정보 업데이트 중 오류가 발생했습니다.",
    });
  }
}

export default withApiSession(withHandler({ methods: ["POST"], handler }));
