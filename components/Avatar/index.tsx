import { User } from "@prisma/client";
import Link from "next/link";

interface PageProps {
  textSize: string;
  size: string;
  user: User;
  hasRing?: boolean;
}

const Avatar = ({ user, size, textSize = "md", hasRing }: PageProps) => {
  return (
    user && (
      <div
        className={`flex justify-center items-center h-${size} w-${size}
      }  aspect-square rounded-full ${`text-${textSize}`} ${
          hasRing ? "ring-1 ring-gray-300" : ""
        } font-semibold border text-white`}
        style={{
          backgroundColor: String(user?.color),
          backgroundImage: `url(https://imagedelivery.net/jhi2XPYSyyyjQKL_zc893Q/${user?.avatarUrl}/avatar)`,
          backgroundSize: "cover",
        }}
      >
        {user?.avatarUrl ? "" : user?.name[0].toUpperCase()}
      </div>
    )
  );
};

export default Avatar;
