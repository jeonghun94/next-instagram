import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "../../../lib/server/withHandler";
import { withApiSession } from "../../../lib/server/withSession";
import client from "../../../lib/server/db";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "GET") {
    const tweets = await client.tweet.findMany({
      include: {
        user: true,
        _count: {
          select: {
            replys: true,
            likes: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.json({
      ok: true,
      tweets,
    });
  } else {
    const { text, photoId } = req.body;
    // const wordsWithHash = text.match(/#[^\s#]+/g).join(", ");

    // const wordsWithoutHash = text
    //   .split(/\s+/)
    //   .filter((word: string) => !word.startsWith("#"));

    // console.log(wordsWithoutHash);
    // console.log(wordsWithHash);

    // console.log(text);

    await client.tweet.create({
      data: {
        text,
        userId: Number(req.session.user?.id),
        createdById: Number(req.session.user?.id),
        imageUrl: photoId,
      },
    });

    res.json({ ok: true });
  }
}

export default withApiSession(
  withHandler({ methods: ["GET", "POST"], handler })
);
