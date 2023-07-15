import client from "@/lib/server/db";
import { NextPageContext } from "next";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Layout from "../components/HomeLayout";
import Link from "next/link";
import { BiSearch } from "react-icons/bi";
import { FeedWithUser, Feeds } from "@/types";

import Feed from "@/components/Feed";

interface FeedsProps {
  feeds: Feeds[];
}

const Feeds = ({ feeds }: FeedsProps) => {
  const router = useRouter();
  const { register, handleSubmit } = useForm<{ text: string }>();
  const onSubmit = (data: { text: string }) => {
    router.push(`/search?text=${data.text}`);
  };

  return (
    <Layout header={false}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full h-auto flex items-center px-3 py-5">
          <div className="bg-[#EFEFEF] p-3 rounded-tl-lg rounded-bl-lg">
            <BiSearch className="text-[#8E8E8E]" />
          </div>
          <input
            {...register("text")}
            className="w-full py-2  border-0 rounded-tr-lg rounded-br-lg bg-[#EFEFEF] outline-none placeholder:text-[#8E8E8E]"
            type="text"
            placeholder="검색"
          />
        </div>
      </form>
      <div className="grid grid-cols-3 gap-[1px] ">
        {feeds && feeds.length > 0 ? (
          feeds.map((feed) => <Feed feed={feed} imageOnly key={feed.id} />)
        ) : (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <h1>검색 결과가 없습니다.</h1>
          </div>
        )}
      </div>
      <br />
      <br />
    </Layout>
  );
};

export default Feeds;

export const getServerSideProps = async (ctx: NextPageContext) => {
  const { text } = ctx.query;

  const feeds = await client.instagramFeed.findMany({
    ...(text ? { where: { text: { contains: String(text) } } } : {}),
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  return {
    props: {
      feeds: JSON.parse(JSON.stringify(feeds)),
    },
  };
};
