import { NextPageContext } from "next";
import { withSsrSession } from "@/lib/server/withSession";
import client from "@/lib/server/db";
import { Feeds } from "@/types";
import Feed from "@/components/Feed";
import Layout from "@/components/HomeLayout";

interface FeedProps {
  feed: Feeds;
}

const FeedDetail = ({ feed }: FeedProps) => {
  return (
    <Layout>
      <div className="px-4">
        <Feed feed={feed} includeUser includeIcons includeReplyForm />
      </div>
    </Layout>
  );
};

export default FeedDetail;

export const getServerSideProps = withSsrSession(
  async ({ query }: NextPageContext) => {
    const { id } = query;

    const feed = await client.instagramFeed.findUnique({
      where: { id: Number(id) },
      include: {
        user: true,
        replys: {
          include: {
            user: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    return {
      props: {
        feed: JSON.parse(JSON.stringify(feed)),
      },
    };
  }
);
