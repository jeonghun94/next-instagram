import { User } from "@prisma/client";

interface PageProps {
  textSize: string;
  size: string;
  user: User;
}

const Avatar = ({ user, size, textSize }: PageProps) => {
  return (
    <div
      className={`flex justify-center items-center h-${size} w-${size}
      }  aspect-square rounded-full ${`text-${textSize}`}  font-semibold border text-white`}
      style={{
        backgroundColor: String(user?.color),
        backgroundImage: `url(https://imagedelivery.net/jhi2XPYSyyyjQKL_zc893Q/${user?.avatarUrl}/avatar)`,
        backgroundSize: "cover",
      }}
    >
      {user?.avatarUrl ? "" : user?.name[0].toUpperCase()}
    </div>
  );
};

export default Avatar;
