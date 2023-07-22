import { User } from "@prisma/client";
import { useRouter } from "next/router";

interface PageProps {
  hasRing?: boolean;
  textSize: string;
  size: string;
  user: User;
}

const Avatar = ({ user, size, textSize = "md", hasRing }: PageProps) => {
  const router = useRouter();
  const avatarUrl = user?.avatarUrl;
  const hasAvatar = !!avatarUrl;
  const containerClass = `flex justify-center items-center w-${size} h-${size} aspect-square rounded-full text-${textSize} text-white font-semibold ${
    hasRing && "ring-1 ring-offset-1 ring-gray-300"
  }`;

  const handleClick = () => {
    router.push(`/profile?id=${user.id}`);
  };
  return (
    <div
      onClick={handleClick}
      className={containerClass}
      style={{
        backgroundColor: String(user?.color),
        backgroundImage: hasAvatar
          ? `url(https://imagedelivery.net/jhi2XPYSyyyjQKL_zc893Q/${avatarUrl}/avatar)`
          : "none",
        backgroundSize: "cover",
      }}
    >
      {hasAvatar ? "" : user?.name[0].toUpperCase()}
    </div>
  );
};

export default Avatar;
