import { NextApiRequest, NextApiResponse } from "next";
import client from "@/lib/server/db";
import { randomColor } from "@/lib/client/utils";

interface BodyProps {
  email: string;
  name: string;
  username: string;
  password: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let errorMessages: string | null = null;
  const { email, name, username, password }: BodyProps = req.body;
  const existingUser = await client.instagramUser.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  if (existingUser) {
    if (existingUser.email === email) {
      errorMessages = "해당 이메일이 존재 합니다. 다른 이메일을 사용해주세요.";
    }

    if (existingUser.username === username) {
      errorMessages =
        "해당 유저네임이 존재 합니다. 다른 유저네임을 사용해주세요.";
    }

    res.send({
      ok: false,
      error: errorMessages,
    });
    return;
  } else {
    const user = await client.instagramUser.create({
      data: {
        password,
        username,
        name,
        email,
        color: randomColor().toUpperCase(),
      },
    });

    res.send({
      ok: true,
      email: user.email,
    });
  }
}
