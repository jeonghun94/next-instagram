import Link from "next/link";
import Layout from "@/components/HomeLayout";
import Avatar from "@/components/user/avatar";
import Feed from "@/components/Feed";
import useUser from "@/lib/client/useUser";
import { BsGrid3X3, BsBookmark, BsPerson, BsHeart } from "react-icons/bs";
import { AiOutlinePlus } from "react-icons/ai";
import { useState } from "react";
import client from "@/lib/server/db";
import { withSsrSession } from "@/lib/server/withSession";
import { NextPageContext } from "next";

export interface MutationResult {
  ok: boolean;
}

interface Tab {
  id: string;
  content: any;
  icon: (isActive: boolean) => JSX.Element;
}

interface F {
  id: number;
  imageUrl: string;
}

interface PageProps {
  feeds: F[];
  likeFeeds: F[];
  bookmarkFeeds: F[];
}

const Profile = ({ feeds, likeFeeds, bookmarkFeeds }: PageProps) => {
  const getBackgroundUrl = (url: string) => {
    return `https://imagedelivery.net/jhi2XPYSyyyjQKL_zc893Q/${url}/public`;
  };
  const { user, isLoading } = useUser();
  const tabs: Tab[] = [
    {
      id: "a",
      icon: (isActive: boolean) => (
        <BsGrid3X3 className={`w-4 h-4 ${isActive && "text-[#0095F6]"}`} />
      ),
      content: feeds,
    },
    {
      id: "b",
      icon: (isActive: boolean) => (
        <BsBookmark className={`w-4 h-4 ${isActive && "text-[#0095F6]"}`} />
      ),
      content: likeFeeds,
    },
    {
      id: "c",
      icon: (isActive: boolean) => (
        <BsHeart className={`w-4 h-4 ${isActive && "text-[#0095F6]"}`} />
      ),
      content: bookmarkFeeds,
    },
  ];

  const [activeTab, setActiveTab] = useState("a");

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

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
              href="/edit-profile"
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

        <div className="w-full flex justify-around">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`flex flex-col items-center py-3  ${
                activeTab === tab.id && "border-t"
              } border-black w-full`}
            >
              <button key={tab.id} onClick={() => handleTabClick(tab.id)}>
                {tab.icon(activeTab === tab.id)}
              </button>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3">
          {tabs.map(
            (tab) =>
              activeTab === tab.id &&
              tab.content.map((feed: F) => (
                <div key={feed.id} className="border-[0.5px]">
                  <Link href={`/feed/${feed.id}`}>
                    <div
                      className="w-full h-30 aspect-square bg-cover bg-no-repeat bg-center"
                      style={{
                        backgroundImage: `url('${getBackgroundUrl(
                          feed.imageUrl!
                        )}')`,
                      }}
                    ></div>
                  </Link>
                </div>
              ))
          )}
        </div>

        {/* {user.feeds ? (
          <div className="grid grid-cols-3">
            {user.feeds.map((feed) => (
              <Feed key={feed.id} feed={feed} imageOnly />
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
        )} */}
      </div>
    </Layout>
  );
};

export default Profile;

export const getServerSideProps = withSsrSession(
  async ({ query, req }: NextPageContext) => {
    const userId = Number(req?.session.user?.id);

    const feeds = await client.instagramFeed.findMany({
      where: { userId },
      select: {
        id: true,
        imageUrl: true,
      },
    });

    const likeFeeds = await client.instagramLike
      .findMany({
        where: { userId },
        select: {
          feed: {
            select: {
              id: true,
              imageUrl: true,
            },
          },
        },
      })
      .then((res) =>
        res.map((item) => ({
          id: item.feed.id,
          imageUrl: item.feed.imageUrl,
        }))
      );

    const bookmarkFeeds = await client.instagramBookMark
      .findMany({
        where: { userId },
        select: {
          feed: {
            select: {
              id: true,
              imageUrl: true,
            },
          },
        },
      })
      .then((res) =>
        res.map((item) => ({
          id: item.feed.id,
          imageUrl: item.feed.imageUrl,
        }))
      );

    console.log(feeds, "feeds");
    console.log(likeFeeds, "likeFeeds");
    console.log(bookmarkFeeds, "bookmarkFeeds");

    return {
      props: {
        feeds: JSON.parse(JSON.stringify(feeds)),
        likeFeeds: JSON.parse(JSON.stringify(likeFeeds)),
        bookmarkFeeds: JSON.parse(JSON.stringify(bookmarkFeeds)),
      },
    };
  }
);
