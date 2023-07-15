import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IoPaperPlaneOutline } from "react-icons/io5";
import {
  BsBookmark,
  BsBookmarkFill,
  BsChat,
  BsHeart,
  BsHeartFill,
  BsThreeDots,
} from "react-icons/bs";
import useSWR from "swr";
import useMutation from "@/lib/client/useMutation";
import { convertTime } from "@/lib/client/utils";
import Avatar from "@/components/user/avatar";
import { Feeds } from "@/types";

interface FeedProps {
  includeUser?: boolean;
  includeReplys?: boolean;
  includeIcons?: boolean;
  imageOnly?: boolean;
  feed: Feeds;
}

const Feed = ({
  feed,
  includeUser,
  includeIcons,
  includeReplys,
  imageOnly,
}: FeedProps) => {
  const [isMoreTextClicked, setIsMoreTextClicked] = useState<boolean>(false);
  const bgUrl = (url: string) => {
    return `https://imagedelivery.net/jhi2XPYSyyyjQKL_zc893Q/${url}/public`;
  };

  const isLongText = feed.text.length > 20;

  const handleMoreTextClick = () => {
    setIsMoreTextClicked(true);
  };
  const { data, mutate } = useSWR<Feeds>(`/api/feed/${feed.id}`);

  const [toggleLike] = useMutation(`/api/feed/${feed.id}/like`);
  const [toggleBookmark] = useMutation(`/api/feed/${feed.id}/bookmark`);

  const onLikeClick = () => {
    if (!data) return;
    mutate((prev) => prev && { ...prev, isLiked: !prev.isLiked }, false);
    toggleLike({});
  };

  const onBookmarkClick = () => {
    if (!data) return;
    mutate(
      (prev) => prev && { ...prev, isBookmarked: !prev.isBookmarked },
      false
    );
    toggleBookmark({});
  };

  return (
    <>
      <Link key={feed.id} href={`/feed/${feed.id}`}>
        {imageOnly ? (
          <div
            className="w-full h-30 aspect-square  bg-cover bg-no-repeat bg-center"
            style={{
              backgroundImage: `url('${bgUrl(feed.imageUrl!)}')`,
            }}
          ></div>
        ) : (
          <>
            {includeUser && (
              <div className="h-10 my-2">
                <div className="w-full h-full flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar user={feed.user} size="10" textSize="xl" />
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
            )}

            <Link key={feed.id} href={`/feed/${feed.id}`}>
              <div className="h-96 border rounded-sm relative ">
                <Image
                  alt="feed image"
                  src={bgUrl(feed.imageUrl!)}
                  fill
                  quality={100}
                />
              </div>
            </Link>

            {includeIcons && (
              <div className="flex justify-between items-center px-2 py-3">
                <div className="flex gap-6 items-center ">
                  <button onClick={onLikeClick}>
                    {data?.isLiked ? (
                      <BsHeartFill className="w-6 h-6 text-red-500" />
                    ) : (
                      <BsHeart className="w-6 h-6" />
                    )}
                  </button>
                  <Link href={`/feed/${feed.id}`} className="-mt-1">
                    <BsChat className="w-6 h-6" />
                  </Link>
                  <button className="-ml-1">
                    <IoPaperPlaneOutline className="w-6 h-6" />
                  </button>
                </div>
                <div>
                  <button onClick={onBookmarkClick}>
                    {data?.isBookmarked ? (
                      <BsBookmarkFill className="w-6 h-6" />
                    ) : (
                      <BsBookmark className="w-6 h-6" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {includeReplys && (
              <>
                <div className="w-full px-2 ">
                  <p className="text-sm font-semibold">
                    {`${feed.user.username}의 `}
                    <span className="text-gray-500 text-sm font-normal ">
                      {isLongText && !isMoreTextClicked
                        ? `${feed.text.slice(0, 20)}...`
                        : feed.text}
                      {isMoreTextClicked && feed.text.slice(20)}
                    </span>
                  </p>
                  {isLongText && !isMoreTextClicked && (
                    <p
                      className={`text-sm text-gray-800 cursor-pointer  ${
                        isMoreTextClicked ? "hidden" : ""
                      }}`}
                      onClick={handleMoreTextClick}
                    >
                      더 보기
                    </p>
                  )}

                  {feed.replys.length > 0 && (
                    <Link
                      href={`/feed/${feed.id}`}
                      className="text-sm text-gray-700"
                    >
                      {`댓글 ${feed.replys.length}개 모두 보기`}
                    </Link>
                  )}
                </div>
                <hr className="my-6" />
              </>
            )}
          </>
        )}
      </Link>
    </>
  );
};

export default Feed;
