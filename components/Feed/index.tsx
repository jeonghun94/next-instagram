import { useEffect, useState } from "react";
import { BsChat, BsDot, BsThreeDots } from "react-icons/bs";
import { IoPaperPlaneOutline } from "react-icons/io5";
import {
  BsBookmark,
  BsBookmarkFill,
  BsHeart,
  BsHeartFill,
} from "react-icons/bs";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";
import useMutation from "@/lib/client/useMutation";
import { convertTime, getBackgroundUrl } from "@/lib/client/utils";
import { Feeds, ReplyWithUser } from "@/types";
import { useForm } from "react-hook-form";
import Avatar from "@/components/Avatar";
import { RepliesPopup } from "../Popups";

interface FeedProps {
  includeUser?: boolean;
  includeReplys?: boolean;
  includeIcons?: boolean;
  includeReplyForm?: boolean;
  imageOnly?: boolean;
  feed: Feeds;
}

interface FormProps {
  text?: string;
}

const Feed = ({
  feed,
  includeUser,
  includeIcons,
  includeReplys,
  includeReplyForm,
  imageOnly,
}: FeedProps) => {
  const [textExpanded, setTextExpanded] = useState<boolean>(false);

  useEffect(() => {
    const kakao = window.Kakao;
    if (!kakao.isInitialized()) {
      kakao.init(process.env.NEXT_PUBLIC_KAKAO_API_KEY);
    }
  }, []);

  const onClick = () => {
    const { Kakao, location } = window;
    Kakao.Link.sendScrap({
      requestUrl: location.href,
    });
  };

  const hasLongText = feed.text.length > 20;

  const handleTextExpandClick = () => {
    setTextExpanded(true);
  };

  const { register, handleSubmit, reset, formState } = useForm<FormProps>();

  const { data: feedData, mutate } = useSWR<Feeds>(`/api/feed/${feed.id}`);
  const [toggleBookmarkMutation] = useMutation(`/api/feed/${feed.id}/bookmark`);
  const [toggleLikeMutation] = useMutation(`/api/feed/${feed.id}/like`);
  const [addReply, { data }] = useMutation(`/api/feed/${feed.id}/reply`);

  const [replies, setReplies] = useState<ReplyWithUser[]>(feed.replies || []);

  const onSubmit = ({ text }: FormProps) => {
    addReply({ text });
    reset();
  };

  useEffect(() => {
    if (!data) return;
    setReplies((prev) => [data.reply, ...prev]);
  }, [data]);

  const toggleLikeStatus = () => {
    if (!feedData) return;
    mutate((prev) => prev && { ...prev, isLiked: !prev.isLiked }, false);
    toggleLikeMutation({});
  };

  const toggleBookmarkStatus = () => {
    if (!feedData) return;
    mutate(
      (prev) => prev && { ...prev, isBookmarked: !prev.isBookmarked },
      false
    );
    toggleBookmarkMutation({});
  };

  const feedImageUrls = feed.imageUrl!.split(",");
  const [feedImageIndex, setFeedImageIndex] = useState(0);

  const handleImageIndex = (action: "left" | "right") => {
    if (action === "left") {
      setFeedImageIndex((prev) =>
        prev === 0 ? feedImageUrls.length - 1 : prev - 1
      );
    } else {
      setFeedImageIndex((prev) =>
        prev === feedImageUrls.length - 1 ? 0 : prev + 1
      );
    }
  };

  return imageOnly ? (
    <Link key={feed.id} href={`/feed/${feed.id}`}>
      <div
        className="w-full h-30 aspect-square  bg-cover bg-no-repeat bg-center"
        style={{
          backgroundImage: `url('${getBackgroundUrl(
            feedImageUrls[feedImageIndex]
          )}')`,
        }}
      ></div>
    </Link>
  ) : (
    <>
      {includeUser && (
        <div className="h-10 my-2">
          <div className="w-full h-full flex items-center justify-between">
            <Link
              href={`/profile?id=${feed.user.id}`}
              className="flex items-center gap-3"
            >
              <Avatar user={feed.user} size="10" textSize="xl" />
              <div>
                <p className="text-sm font-semibold">
                  {`${feed.user.username}  `}
                  <span className="text-gray-500 text-sm font-normal ">
                    {` • ${convertTime(feed.createdAt.toString())}`}
                  </span>
                </p>
                <p className="text-xs text-gray-500">Seoul, Korea</p>
              </div>
            </Link>

            <button>
              <BsThreeDots />
            </button>
          </div>
        </div>
      )}

      <Link key={feed.id} href={`/feed/${feed.id}`}>
        <div className="h-[30rem] border rounded-sm relative ">
          <Image
            src={getBackgroundUrl(feedImageUrls[feedImageIndex])}
            className="relative object-fill"
            alt="feed image"
            quality={100}
            sizes="100%"
            priority
            fill
          />
          {includeReplyForm && feedImageUrls.length > 1 && (
            <>
              {feedImageIndex !== 0 && (
                <button
                  onClick={() => handleImageIndex("left")}
                  className="absolute -mt-3 flex justify-center items-center bg-black bg-opacity-80 w-8 h-8 text-white aspect-square rounded-full left-3 top-1/2"
                >
                  <BsChevronLeft />
                </button>
              )}

              {feedImageIndex + 1 !== feedImageUrls.length && (
                <button
                  onClick={() => handleImageIndex("right")}
                  className="absolute -mt-3 flex justify-center items-center bg-black bg-opacity-80 w-8 h-8 text-white aspect-square rounded-full right-3 top-1/2"
                >
                  <BsChevronRight />
                </button>
              )}
            </>
          )}
          {!includeReplyForm && feedImageUrls.length > 1 && (
            <div className="absolute w-full flex justify-center  bottom-0  left-0 right-0 ">
              {feedImageUrls.map((url) => (
                <div key={url}>
                  <BsDot className="text-gray-100" size={25} />
                </div>
              ))}
            </div>
          )}
        </div>
      </Link>

      {includeIcons && (
        <div className="flex justify-between items-center px-2 py-3">
          <div className="flex gap-6 items-center ">
            <button onClick={toggleLikeStatus}>
              {feedData?.isLiked ? (
                <BsHeartFill className="w-6 h-6 text-red-500" />
              ) : (
                <BsHeart className="w-6 h-6" />
              )}
            </button>

            {!includeReplyForm && (
              <Link href={`/feed/${feed.id}`} className="-mt-1">
                <BsChat className="w-6 h-6" />
              </Link>
            )}

            <button className="-ml-1" onClick={onClick}>
              <IoPaperPlaneOutline className="w-6 h-6" />
            </button>
          </div>

          <div>
            <button onClick={toggleBookmarkStatus}>
              {feedData?.isBookmarked ? (
                <BsBookmarkFill className="w-6 h-6" />
              ) : (
                <BsBookmark className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      )}

      <>
        <div className="w-full px-2 ">
          <p className="text-sm font-semibold">
            {`${feed.user.username} `}
            <span className="text-gray-500 text-sm font-normal ">
              {hasLongText && !textExpanded
                ? `${feed.text.slice(0, 20)}...`
                : feed.text}
              {textExpanded && feed.text.slice(20)}
            </span>
          </p>
          {includeReplys && (
            <>
              {hasLongText && !textExpanded && (
                <p
                  className={`text-sm text-gray-800 cursor-pointer  ${
                    textExpanded ? "hidden" : ""
                  }}`}
                  onClick={handleTextExpandClick}
                >
                  더 보기
                </p>
              )}

              {feed.replies?.length > 0 && <RepliesPopup replies={replies} />}
            </>
          )}
        </div>
        <hr className="my-6" />
      </>

      {includeReplyForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full flex gap-3">
          <input
            {...register("text", {
              required: {
                value: true,
                message: "Please enter your text",
              },
            })}
            type="text"
            className="text-xs border bg-[#FAFAFA] border-gray-300 rounded-md p-3 w-full placeholder:text-gray-600 placeholder:bg-[#FAFAFA] focus:outline-none "
            placeholder="댓글달기..."
          />
          <button
            className={`min-w-fit p-2 px-4 text-sm text-white rounded-3xl outline-none ${
              formState.isValid
                ? "bg-[#0095F6]"
                : "bg-[#C0DFFD] cursor-not-allowed"
            }`}
          >
            게시
          </button>
        </form>
      )}

      {includeReplyForm && (
        <div className="w-full my-3 flex flex-col items-start gap-2 mb-10">
          {replies.length > 0 ? (
            replies.map((reply) => (
              <div key={reply?.id} className="w-full flex flex-col gap-3">
                <div className="w-full flex items-center">
                  <div className="w-full flex justify-between items-center py-1">
                    <div className="flex gap-3">
                      <Avatar user={reply?.user} size="8" textSize="md" />
                      <div className="flex flex-col items-start gap-1 text-xs">
                        <p className="text-gray-500">{reply?.user?.name}</p>
                        <p className="text-sm">{reply?.text}</p>
                      </div>
                    </div>
                    <p className=" text-gray-500 text-xs">
                      {convertTime(reply?.createdAt?.toString())}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="w-full py-28 text-center  text-sm ">
              등록된 댓글이 없습니다.
            </p>
          )}
        </div>
      )}
    </>
  );
};

export default Feed;
