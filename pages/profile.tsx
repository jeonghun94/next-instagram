import useUser from "../lib/client/useUser";
import Layout from "../components/HomeLayout";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useState } from "react";
import { BsGrid3X3, BsBookmark, BsPerson, BsCamera } from "react-icons/bs";
import { AiOutlinePlus } from "react-icons/ai";
import Avatar from "@/components/user/avatar";
import { NextPageContext } from "next";
import client from "@/lib/server/db";
import Image from "next/image";
import Feed from "@/components/Feed";

export interface MutationResult {
  ok: boolean;
}

const Profile = () => {
  const bgUrl = (url: string) => {
    return `https://imagedelivery.net/jhi2XPYSyyyjQKL_zc893Q/${url}/public`;
  };

  const { user, isLoading } = useUser();
  const subTitle = () => {
    return (
      <div className="flex flex-col items-start ">
        <h1 className="text-lg font-semibold text-center">{user?.username}</h1>
      </div>
    );
  };

  const Story = ({ text, isNew }: { text: string; isNew?: boolean }) => {
    return (
      <div className="flex flex-col items-center gap-2">
        <div
          className={`${
            isNew ? "bg-[#FAFAFA]" : ""
          }  w-12 h-12 aspect-square border ring-1 ring-gray-300 ring-offset-1 rounded-full`}
        >
          {isNew && (
            <div className="w-full h-full flex justify-center items-center">
              <button type="button">
                <AiOutlinePlus className="w-6 h-6 text-gray-400" />
              </button>
            </div>
          )}
        </div>
        <p className="text-xs">{text}</p>
      </div>
    );
  };

  return isLoading ? (
    <div className="min-h-screen w-full flex justify-center items-center">
      <h1>Loading</h1>
    </div>
  ) : (
    <Layout isHome={false} pageTitle="Profile" subTitle={subTitle()}>
      <div>
        <div className="w-full flex items-center gap-5 p-2">
          <Avatar user={user} size={"20"} textSize="3xl" />
          <div className="w-full flex flex-col gap-3">
            <p className="text-xl font-normal">{user.username}</p>
            <Link
              href="/edit"
              className="w-3/5 flex py-1.5  items-center text-sm transition-all ease-in-out  bg-[#EFEFEF] justify-center rounded-lg font-bold hover:bg-[#DBDBDB]"
            >
              프로필 편집
            </Link>
          </div>
        </div>
        <div className="h-atuo mt-3 px-3">
          <p className="text-sm  font-semibold">{user.name}</p>
        </div>
        <div className="flex items-center gap-4 mt-5 px-2">
          <Story text={"오사카"} />
          <Story text={"후쿠오카"} />
          <Story text={"도쿄"} />
          <Story text={"신규"} isNew />
        </div>
        <div className="w-full mt-3 py-2 flex justify-around border-t">
          <div className="flex flex-col items-center">
            <p className="text-sm text-gray-500">게시물</p>
            <p className="text-sm font-semibold">{user._count.feeds}</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm text-gray-500">팔로워</p>
            <p className="text-sm font-semibold">{user._count.following}</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm text-gray-500">팔로잉</p>
            <p className="text-sm font-semibold">{user._count.followers}</p>
          </div>
        </div>

        <div className="w-full  flex justify-around ">
          <div className="flex flex-col items-center py-3 border-t border-black w-full">
            <p className="text-sm text-gray-500">
              {<BsGrid3X3 className="w-4 h-4 text-[#0095F6]" />}
            </p>
          </div>
          <div className="flex flex-col items-center py-3 border-t w-full">
            <p className="text-sm text-gray-500">
              {<BsBookmark className="w-4 h-4" />}
            </p>
          </div>
          <div className="flex flex-col items-center py-3 border-t w-full">
            {<BsPerson className="w-4 h-4" />}
          </div>
        </div>

        {user.feeds ? (
          <div className="grid grid-cols-3 ">
            {user.feeds.map((feed) => (
              <Link key={feed.id} href={`/feed/${feed.id}`}>
                <div
                  className="w-full h-50 aspect-square border-[0.5px] border-[#c8c8c8] bg-cover bg-no-repeat bg-center"
                  style={{
                    backgroundImage: `url('${bgUrl(feed.imageUrl!)}')`,
                  }}
                ></div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="w-full h-auto flex flex-col justify-center items-center gap-3 mt-16">
            <div className="w-auto h-auto p-3 aspect-square border-[1.5px] border-black rounded-full">
              <BsCamera className="w-10 h-10" />
            </div>

            <h1 className="text-3xl font-bold">사진 공유</h1>

            <h3 className="text-sm text-gray-500 font-semibold">
              사진을 공유하면 회원님의 프로필에 표시됩니다.
            </h3>

            <h3 className="text-sm text-[#0095F6] font-semibold">
              첫 사진 공유하기
            </h3>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Profile;

// export const getServerSideProps = async (ctx: NextPageContext) => {
//   const { req, res } = ctx;

//   const myFeeds = await client.instagramFeed.findMany({
//     where: {
//       userId: Number(req?.session.user?.id),
//     },
//     include: {
//       user: true,
//     },
//   });

//   console.log(myFeeds);
// };
