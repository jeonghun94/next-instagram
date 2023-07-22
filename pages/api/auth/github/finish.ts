import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@/lib/server/withSession";
import { randomColor } from "@/lib/client/utils";
import withHandler from "@/lib/server/withHandler";
import client from "@/lib/server/db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config: any = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();

  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    // console.log(userData, "유저데이터");
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObj = emailData.find(
      (email: any) => email.primary === true && email.verified === true
    );

    if (!emailObj) {
      return res.redirect("/login");
    }

    const existingUser = await client.instagramUser.findUnique({
      where: {
        email: emailObj.email,
      },
    });
    if (existingUser) {
      req.session.user = existingUser;
      await req.session.save();
      return res.redirect("/");
    } else {
      const user = await client.instagramUser.create({
        data: {
          email: emailObj.email,
          name: userData.name,
          username: userData.login,
          isSocialUser: true,
          password: "",
          color: randomColor().toUpperCase(),
        },
      });
      req.session.user = user;

      return res.redirect("/");
    }
  } else {
    return res.redirect("/login");
  }
};

export default withApiSession(
  withHandler({ methods: ["POST", "GET"], handler, isPrivate: false })
);
