import { NextPageContext } from "next";
import client from "@/lib/server/db";
import Avatar from "@/components/user/avatar";
import Layout from "@/components/HomeLayout";
import { FeedWithUser } from "@/types";
import Image from "next/image";

interface FeedProps {
  feed: FeedWithUser;
}

const Feed = ({ feed }: FeedProps) => {
  const bgUrl = `https://imagedelivery.net/jhi2XPYSyyyjQKL_zc893Q/${feed.imageUrl}/public`;

  return (
    <Layout>
      <Avatar size="10" user={feed.user} textSize="md" />
      <h1>{feed.user.username}</h1>
      <Image
        src={bgUrl}
        width={300}
        height={300}
        alt="Picture of the author"
        loading="eager"
      />
      <h1>{feed.text}</h1>
      <h1>{feed.createdAt.toString()}</h1>
    </Layout>
  );
};

export default Feed;

export const getServerSideProps = async (ctx: NextPageContext) => {
  const { id } = ctx.query;

  const feed = await client.instagramFeed.findUnique({
    where: { id: Number(id) },
    include: { user: true },
  });

  return {
    props: {
      feed: JSON.parse(JSON.stringify(feed)),
    },
  };
};
