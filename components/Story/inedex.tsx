import { InstagramUser } from "@prisma/client";
import Avatar from "../User/avatar";

interface StoryProps {
  user: InstagramUser;
  isMe?: boolean;
}

const Story = ({ user, isMe }: StoryProps) => {
  return (
    <div className=" flex flex-col items-center gap-2 ">
      <Avatar user={user} textSize="xl" size="14" hasRing />
      <p className="text-sm">{isMe ? "내 스토리" : user.username}</p>
    </div>
  );
};

export default Story;
