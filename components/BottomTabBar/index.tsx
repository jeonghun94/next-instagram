import { useState } from "react";
import { useRouter } from "next/router";
import useUser from "@/lib/client/useUser";
import Link from "next/link";
import Avatar from "../user/avatar";
import { IoPaperPlaneOutline, IoPaperPlaneSharp } from "react-icons/io5";
import {
  AiFillHome,
  AiOutlineHome,
  AiOutlineCompass,
  AiFillCompass,
} from "react-icons/ai";
import { CgAddR } from "react-icons/cg";
import { ModalOverlay } from "../HomeLayout";

const BottomTabBar = () => {
  const { user } = useUser();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
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
    <div className="fixed bottom-0 left-0 right-0 max-w-lg w-full m-auto flex justify-between items-center border-t bg-white px-10 py-3">
      <Link href="/">{renderIcon("/", AiFillHome, AiOutlineHome)}</Link>
      <Link href="/search">
        {renderIcon("/search", AiFillCompass, AiOutlineCompass)}
      </Link>
      <button onClick={toggleModal}>
        <CgAddR className="w-6 h-6" />
      </button>
      <Link href="/chat">
        {renderIcon("/chat", IoPaperPlaneSharp, IoPaperPlaneOutline)}
      </Link>
      <Link href="/profile">
        <Avatar size="7" user={user} textSize="sm" />
      </Link>
      <ModalOverlay isOpen={isOpen} onClose={toggleModal} />
    </div>
  );
};

export default BottomTabBar;
