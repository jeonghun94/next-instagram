import { User } from "@prisma/client";

interface PageProps {
  isTop?: boolean;
  size: string;
  user: User;
}

const Avatar = ({ user, size, isTop = false }: PageProps) => {
  return (
    <div
      className={`flex justify-center items-center h-${size} w-${size} ${
        isTop ? "-mt-16" : ""
      }  aspect-square rounded-full text-md  font-semibold border text-white dark:border-black `}
      style={{
        backgroundColor: String(user?.color),
        backgroundImage: `url(https://imagedelivery.net/jhi2XPYSyyyjQKL_zc893Q/${user?.avatarUrl}/avatar)`,
        backgroundSize: "cover",
      }}
    >
      {user?.avatarUrl ? "" : user?.name[0]}
    </div>
  );
};

export default Avatar;
