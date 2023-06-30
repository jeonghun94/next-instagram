import Link from "next/link";
import { convertTime } from "../lib/client/utils";
import { ITweets } from "../pages";
import TweetImage from "./tweetImage";
import { FiMessageCircle, FiHeart, FiEye } from "react-icons/fi";
import Avatar from "./user/avartar";

export default function Tweets({ tweets }: ITweets) {
  return tweets?.length > 0 ? (
    <>
      {tweets.map((tweet, idx) => (
        <Link href={`/tweet/${tweet.id}`} key={idx}>
          <div className="w-full px-4 py-3 border-b cursor-pointer dark:border-b-[#181818] ">
            <div className="flex items-start gap-3 ">
              <Avatar user={tweet.user} size={"10"} />

              <div className="w-full flex flex-col">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-sm">{tweet.user.name}</p>
                  <p className="text-sm text-gray-500">
                    {convertTime(tweet.createdAt.toString())}
                  </p>
                </div>
                <p className="text-sm text-white">{tweet.text}</p>
                {tweet.imageUrl && <TweetImage imageUrl={tweet.imageUrl} />}
                <div className="w-full flex items-center gap-5 py-1 text-sm text-gray-500">
                  <div className="flex items-center gap-3">
                    <FiMessageCircle />
                    <span>{tweet._count?.replys}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiHeart />
                    <span>{tweet._count?.likes}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiEye />
                    <span>{tweet.views}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </>
  ) : null;
}
