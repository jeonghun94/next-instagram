import { InstagramUser } from "@prisma/client";
import Avatar from "../Avatar";
import { FaPlus } from "react-icons/fa";
import { AiOutlinePlus } from "react-icons/ai";

interface StoryProps {
  user: InstagramUser;
  isMe?: boolean;
}

export const SStory = ({ text, isNew }: { text: string; isNew?: boolean }) => {
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
