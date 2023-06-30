import useUser from "../lib/client/useUser";
import { Tweet, User } from "@prisma/client";
import Layout from "../components/tweetLayout";
import { AiFillCalendar } from "react-icons/ai";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useState } from "react";
import { capitalizeFirstLetter } from "@/lib/client/utils";
import Avatar from "@/components/user/avartar";
// import Image from "next/image";

export interface IForm {
  text: string;
  photo?: FileList;
}
export interface ITweets {
  ok?: boolean;
  tweets: TweetWithUser[];
}

export interface MutationResult {
  ok: boolean;
}

interface TweetWithUser extends Tweet {
  user: User;
}

const UserTweets = dynamic(() => import("@/components/user/tweets"), {
  loading: () => <p>Loading...</p>,
});

const UserReplies = dynamic(() => import("@/components/user/replies"), {
  loading: () => <p>Loading...</p>,
});

const UserLikes = dynamic(() => import("@/components/user/likes"), {
  loading: () => <p>Loading...</p>,
});

const Profile = () => {
  const { user, isLoading } = useUser();
  const [tabMenu, setTabMenu] = useState<string>("tweets");

  const handleTabMenu = (e: any) => {
    const { tabMenu } = e.target.dataset;
    setTabMenu(tabMenu);
  };

  const subTitle = () => {
    return (
      <div className="flex flex-col ml-3 items-start ">
        <h1 className="text-lg font-bold">{user?.name}</h1>
        <span className="text-xs text-gray-500">
          {user?._count.tweets} Tweets
        </span>
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
        <div className="w-full h-36 bg-[#333639]"></div>
        <div className=" w-full flex items-center justify-between p-2">
          <Avatar user={user} size={"28"} isTop={true} />

          <Link
            href="/edit"
            className="w-1.5/5 h-10  flex items-center text-sm px-2 rounded-3xl border font-bold hover:opacity-[0.8]"
          >
            Edit profile
          </Link>
        </div>
        <div className="h-atuo px-5">
          <p className="text-2xl  font-semibold">{user.name}</p>
          <p className="text-gray-400">{user.email}</p>
          <p className="flex items-center gap-1 text-gray-400">
            <AiFillCalendar /> Joined {user.createdAt.split("T")[0]}
          </p>
          <p className="flex items-center gap-3 text-gray-400">
            <span>
              <strong className="text-white">{user?._count?.following}</strong>{" "}
              Following
            </span>
            <span>
              <strong className="text-white">{user?._count?.followers}</strong>{" "}
              Followers
            </span>
          </p>
          <div className="flex justify-between w-full h-auto px-4 border-b  mt-4 dark:border-b-[#282828]">
            {["tweets", "replies", "likes"].map((tab, idx) => {
              return (
                <div
                  key={idx}
                  className="relative flex flex-col justify-between pb-3  cursor-pointer"
                  data-tab-menu={tab}
                  onClick={handleTabMenu}
                >
                  {capitalizeFirstLetter(tab)}
                  {tabMenu === tab && (
                    <div className="absolute h-1 bottom-0 w-full bg-[#1C9BEF] rounded-md"></div>
                  )}
                </div>
              );
            })}
          </div>

          {tabMenu === "tweets" && <UserTweets />}
          {tabMenu === "replies" && <UserReplies />}
          {tabMenu === "likes" && <UserLikes />}
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
