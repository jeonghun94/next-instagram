import { useState } from "react";
import useUser from "@/lib/client/useUser";
import Link from "next/link";
import Avatar from "../user/avatar";
import { IoPaperPlaneOutline } from "react-icons/io5";
import { AiFillHome } from "react-icons/ai";
import { ImCompass2 } from "react-icons/im";
import { CgAddR } from "react-icons/cg";
import { ModalOverlay } from "../HomeLayout";

const BottomTabBar = () => {
  const { user } = useUser();

  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };
  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-lg w-full m-auto flex justify-between items-center border-t bg-white px-10 py-3">
      <Link href="/">
        <AiFillHome className="w-7 h-7" />
      </Link>
      <Link href="/search">
        <ImCompass2 className="w-6 h-6" />
      </Link>
      <button onClick={openModal}>
        <CgAddR className="w-6 h-6 " />
      </button>
      <Link href="/chat">
        <IoPaperPlaneOutline className="w-7 h-7 " />
      </Link>
      <Link href="/profile">
        <Avatar size="7" user={user} textSize="sm" />
      </Link>
      <ModalOverlay isOpen={isOpen} onClose={closeModal} />
    </div>
  );
};

export default BottomTabBar;
