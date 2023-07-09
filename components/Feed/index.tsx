import { FeedWithUser } from "@/types";
import { BsChat, BsHeart, BsBookmark, BsThreeDots } from "react-icons/bs";
import { IoPaperPlaneOutline } from "react-icons/io5";
import Avatar from "../user/avatar";
import Image from "next/image";
import Link from "next/link";
import { convertTime } from "@/lib/client/utils";

interface FeedProps {
  feed: FeedWithUser;
}

const Feed = ({ feed }: FeedProps) => {
  const bgUrl = (url: string) => {
    return `https://imagedelivery.net/jhi2XPYSyyyjQKL_zc893Q/${url}/public`;
  };

  return (
    <Link key={feed.id} href={`/feed/${feed.id}`}>
      <div className="w-full px-4">
        <div className="h-10 mb-2">
          <div className="w-full h-full flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* <div className="w-10 h-10  border rounded-full ring-gray-300"></div> */}
              <Avatar user={feed.user} size="10" />
              <div>
                <p className="text-sm font-semibold">
                  {`${feed.user.username} `}
                  <span className="text-gray-500 text-sm font-normal ">
                    {` • ${convertTime(feed.createdAt.toString())}`}
                  </span>
                </p>
                <p className="text-xs text-gray-500">Seoul, Korea</p>
              </div>
            </div>

            <button>
              <BsThreeDots />
            </button>
          </div>
        </div>

        <div className="h-96 border rounded-sm relative ">
          <Image
            alt="feed image"
            src={bgUrl(feed.imageUrl!)}
            fill
            quality={100}
          />
        </div>

        {/* <div className="h-96 border rounded-sm"></div> */}
        <div className="flex justify-between items-center px-2 py-3">
          <div className="flex gap-6 items-center ">
            <button>
              <BsHeart className="w-6 h-6" />
            </button>
            <button className="-mt-1">
              <BsChat className="w-6 h-6" />
            </button>
            <button className="-ml-1">
              <IoPaperPlaneOutline className="w-6 h-6" />
            </button>
          </div>
          <div>
            <BsBookmark className="w-6 h-6" />
          </div>
        </div>
        <div className="w-full px-2 ">
          <p className="text-sm font-semibold">
            {`${feed.user.username}의 `}
            <span className="text-gray-500 text-sm font-normal ">
              {feed.text}
            </span>
          </p>
          <p className="text-sm text-gray-500">더보기</p>
        </div>
        <hr className="my-6" />
      </div>
    </Link>
  );
};

export default Feed;
