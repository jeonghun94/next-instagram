import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { convertTime } from "@/lib/client/utils";
import { ReplyWithUser } from "@/types";
import Avatar from "../Avatar";
import Link from "next/link";
import { useRouter } from "next/router";
import { InstagramUser } from "@prisma/client";

interface FollowsProps {
  avatarUrl: string | null;
  username: string;
  color: string;
  name: string;
  id: number;
}
interface RepliesPopupProps {
  replies: ReplyWithUser[];
}

interface FollowsPopupProps {
  follows: InstagramUser[];
  content: "following" | "followers";
}

export const FollowsPopup = ({ follows, content }: FollowsPopupProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const containerClass = `flex justify-center items-center w-12 h-12 aspect-square rounded-full text-white font-semibold`;
  const isFollower = content === "followers";

  const handleFollows = (id: number) => {
    setIsOpen(false);
    router.push(`/profile?id=${id}`);
  };

  return (
    <>
      <div
        className="flex flex-col items-center cursor-pointer"
        onClick={togglePopup}
      >
        <p className="text-sm text-gray-500">
          {isFollower ? "팔로워 " : "팔로잉"}
        </p>
        <p className="text-sm font-semibold">{follows.length}</p>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed top-0 left-0 w-full h-screen bg-[rgba(0,0,0,0.2)] z-10"
              onClick={togglePopup}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="fixed flex flex-col items-center max-w-[480px] min-h-[60vh] bottom-0 left-0 right-0 mx-auto rounded-t-2xl bg-white z-10 overflow-y-auto"
              initial={{ y: 1000 }}
              animate={{ y: 0 }}
              exit={{ y: 1000 }}
              transition={{
                duration: 0.5,
              }}
            >
              <div className=" w-full p-5 flex flex-col gap-3">
                {follows.length > 0 ? (
                  follows?.map((follow, i) => (
                    <div
                      key={i}
                      onClick={() => handleFollows(follow.id)}
                      className="w-full flex items-center gap-3 cursor-pointer"
                    >
                      <div
                        className={containerClass}
                        style={{
                          backgroundColor: String(follow.color),
                          backgroundImage: follow.avatarUrl
                            ? `url(https://imagedelivery.net/jhi2XPYSyyyjQKL_zc893Q/${follow.avatarUrl}/avatar)`
                            : "none",
                          backgroundSize: "cover",
                        }}
                      >
                        {follow.avatarUrl
                          ? ""
                          : follow.username[0].toUpperCase()}
                      </div>
                      <div className="flex flex-col justify-center">
                        <p>{follow.username}</p>
                        <p className="text-sm text-gray-500">{follow.name}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="w-full py-60 text-center text-sm">
                    {isFollower
                      ? "팔로워 목록이 없습니다."
                      : "팔로잉 목록이 없습니다."}
                  </p>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export const RepliesPopup = ({ replies }: RepliesPopupProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const repliesLength = replies.length;
  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button className="text-sm text-gray-700" onClick={togglePopup}>
        {`댓글 ${repliesLength}개 모두 보기`}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed top-0 left-0 w-full h-screen bg-[rgba(0,0,0,0.2)] z-10"
              onClick={togglePopup}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="fixed flex flex-col items-center max-w-[480px] min-h-[60vh] bottom-0 left-0 right-0 mx-auto rounded-t-2xl bg-white z-10 overflow-y-auto"
              initial={{ y: 1000 }}
              animate={{ y: 0 }}
              exit={{ y: 1000 }}
              transition={{
                duration: 0.5,
              }}
            >
              <div className="flex justify-center items-center w-full h-12 border-b">
                <h1 className="font-semibold">댓글</h1>
              </div>
              <div className="w-full p-3">
                {replies.length > 0 ? (
                  replies.map((reply) => (
                    <div key={reply.id} className="w-full flex flex-col gap-3">
                      <div className="w-full flex items-center">
                        <div className="w-full flex justify-between items-center py-1">
                          <div className="flex gap-3">
                            <Avatar user={reply.user} size="8" textSize="md" />
                            <div className="flex flex-col items-start gap-1 text-xs">
                              <p className="text-gray-500">{reply.user.name}</p>
                              <p className="text-sm">{reply.text}</p>
                            </div>
                          </div>
                          <p className=" text-gray-500 text-xs">
                            {convertTime(reply.createdAt.toString())}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="w-full py-28 text-center text-sm ">
                    등록된 댓글이 없습니다.
                  </p>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
