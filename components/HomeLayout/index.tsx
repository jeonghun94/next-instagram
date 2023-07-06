import Head from "next/head";
import { useRouter } from "next/router";
import { FaArrowLeft } from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";
import { IoLogOut } from "react-icons/io5";
import { FaUserAlt, FaTwitter } from "react-icons/fa";
import { BiLeftArrowAlt } from "react-icons/bi";
import { ImCompass2 } from "react-icons/im";
import { CgAddR } from "react-icons/cg";

import { IoPaperPlaneOutline, IoPaperPlaneSharp } from "react-icons/io5";

import useUser from "../../lib/client/useUser";
import Link from "next/link";
import React from "react";
import Avatar from "../user/avatar";
import CustomHead from "../CustomHead";

interface LayoutProps {
  subTitle?: string | React.ReactNode;
  actionBtn?: React.ReactNode;
  children: React.ReactNode;
  pageTitle?: string;
  isHome?: boolean;
  header?: boolean;
}

const Layout = ({
  children,
  isHome,
  subTitle,
  pageTitle,
  actionBtn,
  header = true,
}: LayoutProps) => {
  const router = useRouter();
  const { user } = useUser();
  const handleBack = () => {
    router.back();
  };

  console.log(user);

  const handleLogout = () => {
    fetch("/api/logout").then(() => (window.location.href = "/"));
  };

  return (
    <div className="w-full min-h-screen flex flex-col ">
      {header && (
        <>
          <CustomHead pageTitle={pageTitle} />
          <div
            className={`px-4 py-4 flex items-center border-b border-gray-250 sticky top-0 bg-white`}
          >
            {isHome ? (
              <i className=" w-[103px] h-[30px] bg-no-repeat bg-[url('https://static.cdninstagram.com/rsrc.php/v3/yK/r/ATdtiLb2BQ9.png')] bg-cover" />
            ) : (
              <button className="mr-10" onClick={handleBack}>
                <FaArrowLeft />
              </button>
            )}
            {subTitle && subTitle}
            {actionBtn && <div className="ml-auto">{actionBtn}</div>}
          </div>
        </>
      )}

      {children}

      <div className="fixed bottom-0 left-0 right-0 max-w-lg w-full m-auto flex justify-between items-center border-t bg-white px-10 py-3">
        <Link href="/">
          <AiFillHome className="w-7 h-7" />
        </Link>
        <Link href="/search">
          <ImCompass2 className="w-6 h-6" />
        </Link>
        <Link href="/profile">
          <CgAddR className="w-6 h-6 " />
        </Link>
        <Link href="/chat">
          <IoPaperPlaneOutline className="w-7 h-7 " />
        </Link>
        <Link href="/profile">
          <Avatar size="6" user={user} />
        </Link>
      </div>
    </div>
  );
};

export default Layout;
