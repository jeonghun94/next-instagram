import { NextPageContext } from "next";
import { withSsrSession } from "@/lib/server/withSession";
import client from "@/lib/server/db";
import { FeedDetailProps } from "@/types";
import Feed from "@/components/Feed";
import Layout from "@/components/Layout/MainLayout";

const FeedDetail = ({ feed }: FeedDetailProps) => {
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
        replies: {
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
