import { withSsrSession } from "@/lib/server/withSession";
import { NextPageContext } from "next";
import client from "@/lib/server/db";
import { Feeds } from "@/types";
import Layout from "@/components/HomeLayout";
import Stories from "@/components/Stories/inedex";
import Feed from "@/components/Feed";

interface FeedsProps {
  feeds: Feeds[];
}

const Home = ({ feeds }: FeedsProps) => {
  return (
    <Layout isHome>
      <Stories />
      <div className="px-4">
        {feeds.map((feed) => (
          <Feed
            key={feed.id}
            feed={feed}
            includeUser
            includeIcons
            includeReplys
          />
        ))}
      </div>
    </Layout>
  );
};

export default Home;

export const getServerSideProps = withSsrSession(
  async ({ req }: NextPageContext) => {
    const followerId = Number(req?.session.user?.id);

    const followingIds = await client.instagramFollows.findMany({
      where: { followerId },
      select: { followingId: true },
    });

    const query = {
      include: {
        user: {
          select: {
            id: true,
          },
        },
      },
    };

    const feeds = await client.instagramFeed.findMany({
      where: { userId: { in: followingIds.map((item) => item.followingId) } },
      include: {
        user: true,
        replys: query,
      },
      orderBy: { createdAt: "desc" },
    });

    console.log(feeds);

    return {
      props: {
        feeds: JSON.parse(JSON.stringify(feeds)),
      },
    };
  }
);
