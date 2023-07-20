import client from "@/lib/server/db";
import { NextPageContext } from "next";
import { withSsrSession } from "@/lib/server/withSession";
import { InstagramUser } from "@prisma/client";
import { FaFacebookMessenger } from "react-icons/fa";
import { BiMessageAdd } from "react-icons/bi";
import Avatar from "@/components/User/avatar";
import Layout from "@/components/Layout/MainLayout";

interface ChatProp {
  id: number;
  followerId: number;
  followingId: number;
  following: InstagramUser;
}

interface ChatProps {
  followingUsers: ChatProp[];
}
const Chat = ({ followingUsers }: ChatProps) => {
  const handleSend = () => {
    return alert("서비스 준비중입니다.");
  };

  return (
    <Layout header={false}>
      <div className="w-full min-h-screen grid grid-cols-10 ">
        <div className="w-full h-full py-10 col-span-2 border-r flex flex-col items-center gap-5 overflow-y-auto max-h-screen">
          <button onClick={handleSend}>
            <BiMessageAdd className="w-7 h-7" />
          </button>
          <div className="flex flex-col gap-5">
            {followingUsers.map((user, i) => (
              <div onClick={handleSend} key={i} className="cursor-pointer">
                <Avatar user={user.following} size="14" textSize="xl" />
              </div>
            ))}
          </div>
          <br />
        </div>
        <div className="w-full h-full col-span-8 flex flex-col justify-center items-center gap-3">
          <div className="-mt-12 border-[2px] border-black p-5 rounded-full">
            <FaFacebookMessenger className=" w-12 h-12" />
          </div>
          <h1 className="text-xl font-medium">내 메세지</h1>
          <h3 className="text-sm text-gray-500">
            친구나 그룹에 비공개 사진과 메시지를 보내보세요
          </h3>
          <button
            className="px-4 py-1.5 bg-[#0095F6] text-sm text-white font-semibold rounded-lg"
            onClick={handleSend}
          >
            메시지 보내기
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;

export const getServerSideProps = withSsrSession(
  async ({ req }: NextPageContext) => {
    const user = req?.session.user;

    if (!user) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    const followingUsers = await client.instagramFollows.findMany({
      where: {
        followerId: Number(req?.session.user?.id),
      },
      include: {
        following: true,
      },
    });

    return {
      props: {
        followingUsers: JSON.parse(JSON.stringify(followingUsers)),
      },
    };
  }
);
