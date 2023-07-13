import { withSsrSession } from "@/lib/server/withSession";
import { NextPageContext } from "next";
import client from "@/lib/server/db";
import { Feeds } from "@/types";
import Layout from "@/components/HomeLayout";
import Stories from "@/components/Stories/inedex";
import Feed from "@/components/Feed";
import useSWR from "swr";

interface FeedsProps {
  ok?: boolean;
  feeds: Feeds[];
  userId: number;
}

const Home = ({ feeds, userId }: FeedsProps) => {
  // const { data } = useSWR<FeedsProps>("/api/feed/following");
  return (
    <Layout isHome>
      <Stories />
      {feeds.map((feed) => (
        <Feed key={feed.id} feed={feed} userId={userId} />
      ))}
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
        user: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
            name: true,
            color: true,
          },
        },
        bookmarks: query,
        likes: query,
        replys: query,
        _count: { select: { replys: true, likes: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      props: {
        feeds: JSON.parse(JSON.stringify(feeds)),
        userId: Number(req?.session.user?.id),
      },
    };
  }
);
