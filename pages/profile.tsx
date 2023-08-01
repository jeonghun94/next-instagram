import { useState } from "react";
import Link from "next/link";
import { NextPageContext } from "next";
import { BsGrid3X3, BsBookmark, BsHeart, BsCamera } from "react-icons/bs";
import Layout from "@/components/Layout/MainLayout";
import Avatar from "@/components/Avatar";
import { SStory } from "@/components/Story/inedex";
import client from "@/lib/server/db";
import { withSsrSession } from "@/lib/server/withSession";
import useMutation from "@/lib/client/useMutation";
import { getBackgroundUrl } from "@/lib/client/utils";
import { MutationResult, FeedLight, ProfileProps } from "@/types";
import { FollowsPopup } from "@/components/Popups";
import ROUTE_PATH from "@/constants/route";

const Profile = ({
  feeds,
  likeFeeds,
  bookmarkFeeds,
  isFollowing,
  isMe,
  user,
  followers,
  following,
}: ProfileProps) => {
  const [activeTab, setActiveTab] = useState<string>("feed");
  const [isFollowed, setIsFollowed] = useState<boolean>(isFollowing);
  const [toggleFollow] = useMutation<MutationResult>(
    `/api/user/following/${user.id}`
  );

  const handleFollow = () => {
    setIsFollowed((prev) => !prev);
    toggleFollow({});
  };
  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  const getIcon = (IconComponent: React.ElementType, isActive: boolean) => (
    <IconComponent className={`w-4 h-4 ${isActive ? "text-[#0095F6]" : ""}`} />
  );

  const tabs = [
    {
      id: "feed",
      icon: (isActive: boolean) => getIcon(BsGrid3X3, isActive),
      content: feeds,
      isFeed: true,
    },
    {
      id: "bookmarkFeed",
      icon: (isActive: boolean) => getIcon(BsBookmark, isActive),
      content: bookmarkFeeds,
      isFeed: false,
    },
    {
      id: "likeFeed",
      content: likeFeeds,
      icon: (isActive: boolean) => getIcon(BsHeart, isActive),
      isFeed: false,
    },
  ];

  const renderSubtitle = () => {
    return (
      <div className="flex flex-col items-start">
        <h1 className="text-lg font-semibold text-center">{user?.username}</h1>
      </div>
    );
  };

  const EmptyFeed = ({ isFeed }: { isFeed: boolean }) => {
    return (
      <div className="w-full h-auto flex flex-col justify-center items-center gap-3 mt-16">
        <div className="w-auto h-auto p-3 aspect-square border-[1.5px] border-black rounded-full">
          <BsCamera className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold">
          {" "}
          {isFeed ? "사진 공유" : "게시글 없음"}
        </h1>

        {isFeed && (
          <>
            <h3 className="text-sm text-gray-500 font-semibold">
              사진, 좋아요를 공유하면 회원님의 프로필에 표시됩니다.
            </h3>

            <h3 className="text-sm text-[#0095F6] font-semibold">
              첫 사진 공유하기
            </h3>
          </>
        )}
      </div>
    );
  };

  return (
    <Layout isHome={false} pageTitle="Profile" subTitle={renderSubtitle()}>
      <div className="w-full flex items-center gap-5 p-2">
        <Avatar user={user} size={"14"} textSize="3xl" />
        <div className="w-full flex flex-col gap-3">
          <p className="text-xl font-normal">{user.username}</p>

          {isMe ? (
            <Link
              href={`${ROUTE_PATH.EDIT_PROFILE}`}
              className="w-3/5 flex py-1.5  items-center text-sm transition-all ease-in-out  bg-[#EFEFEF] justify-center rounded-lg font-bold hover:bg-[#DBDBDB]"
            >
              프로필 편집
            </Link>
          ) : (
            <button
              onClick={handleFollow}
              className="w-3/5 flex py-1.5  items-center text-sm transition-all ease-in-out  bg-[#EFEFEF] justify-center rounded-lg font-bold hover:bg-[#DBDBDB]"
            >
              {isFollowed ? "팔로잉" : "팔로우"}
            </button>
          )}
        </div>
      </div>
      <div className="h-atuo mt-3 px-3">
        <p className="text-sm  font-semibold">{user.name}</p>
      </div>
      <div className="flex items-center gap-4 mt-5 px-2">
        <SStory text={"신규"} isNew />
        <SStory text={"무제"} />
      </div>
      <div className="w-full mt-3 py-2 flex justify-around border-t">
        <div className="flex flex-col items-center">
          <p className="text-sm text-gray-500">게시물</p>
          {/* <p className="text-sm font-semibold">{user._count.feeds}</p> */}
          <p className="text-sm font-semibold">{feeds.length}</p>
        </div>
        <FollowsPopup content="followers" follows={following} />
        <FollowsPopup content="following" follows={followers} />
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

      {tabs.map((tab) => {
        if (activeTab === tab.id) {
          return tab.content.length > 0 ? (
            <div key={tab.id} className="grid grid-cols-3 mb-7">
              {tab.content.map((feed: FeedLight) => (
                <div key={feed.id} className="border-[0.5px]">
                  <Link href={`${ROUTE_PATH.FEED}/${feed.id}`}>
                    <div
                      className="w-full h-30 aspect-square bg-cover bg-no-repeat bg-center"
                      style={{
                        backgroundImage: `url('${getBackgroundUrl(
                          feed.imageUrl!.split(",")[0]
                        )}')`,
                      }}
                    ></div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <EmptyFeed key={tab.id} isFeed={tab.isFeed} />
          );
        }
      })}
    </Layout>
  );
};

export default Profile;

export const getServerSideProps = withSsrSession(
  async ({ req, query }: NextPageContext) => {
    const userId = Number(req?.session.user?.id);
    const pathId = Number(query?.id);
    const isMe = !pathId ? true : pathId === userId ? true : false;
    let isFollowing = false;

    if (!userId) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    const user = await client.instagramUser.findUnique({
      where: { id: pathId ? pathId : userId },
      select: {
        id: true,
        username: true,
        name: true,
        avatarUrl: true,
        color: true,
        followers: {
          select: {
            following: true,
          },
        },
        following: {
          select: {
            follower: true,
          },
        },
        _count: {
          select: {
            feeds: true,
            followers: true,
            following: true,
          },
        },
      },
    });

    const followers = user?.followers?.map((item) => item.following);
    const following = user?.following?.map((item) => item.follower);

    if (!isMe) {
      const follow = await client.instagramFollows.findFirst({
        where: {
          followerId: userId,
          followingId: pathId,
        },
      });

      if (follow) {
        isFollowing = true;
      }
    }

    const feeds = await client.instagramFeed.findMany({
      where: { userId: pathId ? pathId : userId },
      select: {
        id: true,
        imageUrl: true,
      },
    });

    const likeFeeds = await client.instagramLike
      .findMany({
        where: { userId: pathId ? pathId : userId },
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
        where: { userId: pathId ? pathId : userId },
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

    return {
      props: {
        followers: JSON.parse(JSON.stringify(followers)),
        following: JSON.parse(JSON.stringify(following)),
        bookmarkFeeds: JSON.parse(JSON.stringify(bookmarkFeeds)),
        likeFeeds: JSON.parse(JSON.stringify(likeFeeds)),
        feeds: JSON.parse(JSON.stringify(feeds)),
        isFollowing,
        isMe,
        user: JSON.parse(JSON.stringify(user)),
      },
    };
  }
);
