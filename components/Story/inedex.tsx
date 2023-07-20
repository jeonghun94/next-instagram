import { InstagramUser } from "@prisma/client";
import Avatar from "../Avatar";
import { FaPlus } from "react-icons/fa";

interface StoryProps {
  user: InstagramUser;
  isMe?: boolean;
}

const Story = ({ user, isMe }: StoryProps) => {
  const handleClick = () => {
    alert("서비스 준비중 입니다.");
  };

  return (
    <div
      onClick={handleClick}
      className="relative flex flex-col items-center gap-2 cursor-pointer"
    >
      <Avatar user={user} textSize="xl" size="14" hasRing />
      {isMe && (
        <div className=" p-1.5 mb-6 flex items-center justify-center aspect-square rounded-full bg-blue-500 absolute ring-2 ring-black bottom-0 right-0 text-white ">
          <FaPlus size={10} />
        </div>
      )}
      <p className="text-sm">{isMe ? "내 스토리" : user.username}</p>
    </div>
  );
};

export default Story;
