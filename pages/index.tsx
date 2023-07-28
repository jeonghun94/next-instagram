import { withSsrSession } from "@/lib/server/withSession";
import { NextPageContext } from "next";
import client from "@/lib/server/db";
import { HomeProps } from "@/types";
import Layout from "@/components/Layout/MainLayout";
import Story from "@/components/Story/inedex";
import Feed from "@/components/Feed";
import useUser from "@/lib/client/useUser";

const Home = ({ feeds, followingUsersInfo }: HomeProps) => {
  const { user, isLoading } = useUser();

  if (isLoading) return;

  return (
    <Layout isHome>
      <div className="w-full flex gap-5 py-6 px-2 overflow-x-auto ">
        <Story user={user} isMe />
        {followingUsersInfo.map((item) => (
          <Story key={item.id} user={item.following} />
        ))}
      </div>
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

    if (!followerId) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    const followingUsersInfo = await client.instagramFollows.findMany({
      where: { followerId },
      include: {
        following: true,
      },
    });

    const feeds = await client.instagramFeed.findMany({
      // where: { userId: { in: followingIds.map((item) => item.followingId) } },
      include: {
        user: true,
        replies: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      props: {
        feeds: JSON.parse(JSON.stringify(feeds)),
        followingUsersInfo: JSON.parse(JSON.stringify(followingUsersInfo)),
      },
    };
  }
);
