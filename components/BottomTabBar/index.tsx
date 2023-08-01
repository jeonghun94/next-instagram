import { useState } from "react";
import { useRouter } from "next/router";
import useUser from "@/lib/client/useUser";
import Link from "next/link";
import Avatar from "../Avatar";
import { IoPaperPlaneOutline, IoPaperPlaneSharp } from "react-icons/io5";
import {
  AiFillHome,
  AiOutlineHome,
  AiOutlineCompass,
  AiFillCompass,
} from "react-icons/ai";
import { BiUserCircle } from "react-icons/bi";
import { CgAddR } from "react-icons/cg";
import FeedUploadForm from "../Feed/UploadForm";
import ROUTE_PATH from "@/constants/route";

const BottomTabBar = () => {
  const router = useRouter();
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    if (!user) return router.push("/login");
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };

  const isCurrentPage = (path: string) => {
    return router.pathname === path;
  };

  const renderIcon = (
    path: string,
    fillIcon: React.ElementType,
    outlineIcon: React.ElementType
  ): JSX.Element => {
    const Icon = isCurrentPage(path) ? fillIcon : outlineIcon;
    return <Icon className="w-7 h-7" />;
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 max-w-lg w-full m-auto flex justify-between items-center border-t bg-white px-10 py-3">
        <Link href={`${ROUTE_PATH.HOME}`}>
          {renderIcon(ROUTE_PATH.HOME, AiFillHome, AiOutlineHome)}
        </Link>
        <Link href={`${ROUTE_PATH.SEARCH}`}>
          {renderIcon(ROUTE_PATH.SEARCH, AiFillCompass, AiOutlineCompass)}
        </Link>
        <button onClick={toggleModal}>
          <CgAddR className="w-6 h-6" />
        </button>

        <Link href={`${ROUTE_PATH.CHAT_ROOM}`}>
          {renderIcon(
            ROUTE_PATH.CHAT_ROOM,
            IoPaperPlaneSharp,
            IoPaperPlaneOutline
          )}
        </Link>

        {user ? (
          <Link href={`${ROUTE_PATH.PROFILE}`}>
            <Avatar size="7" user={user} textSize="sm" />
          </Link>
        ) : (
          <Link href={`${ROUTE_PATH.LOGIN}`}>
            <BiUserCircle className="w-7 h-7" />
          </Link>
        )}
      </div>
      <FeedUploadForm isOpen={isOpen} onClose={toggleModal} />
    </>
  );
};

export default BottomTabBar;
