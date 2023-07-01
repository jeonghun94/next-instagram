import Head from "next/head";
import { useRouter } from "next/router";
import { FaArrowLeft } from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";
import { IoLogOut } from "react-icons/io5";
import { FaUserAlt, FaTwitter } from "react-icons/fa";

import useUser from "../lib/client/useUser";
import Link from "next/link";
import React from "react";
import Avatar from "./user/avartar";

interface LayoutProps {
  subTitle: string | React.ReactNode;
  children: React.ReactNode;
  pageTitle: string;
  isHome?: boolean;
  sideBar?: boolean;
  actionBtn?: React.ReactNode;
}

const Layout = ({
  children,
  isHome,
  subTitle,
  pageTitle,
  sideBar = true,
  actionBtn,
}: LayoutProps) => {
  const router = useRouter();
  const { user } = useUser();
  const handleBack = () => {
    router.back();
  };

  const handleLogout = () => {
    fetch("/api/logout").then(() => (window.location.href = "/"));
  };

  const title = `${pageTitle ? `${pageTitle} /` : ""}  Twitter`;
  const pathName = router.pathname;

  return (
    <div className="w-full min-h-screen flex">
      <Head>
        <title> Instagram</title>
        <link
          data-default-icon="https://static.cdninstagram.com/rsrc.php/yv/r/BTPhT6yIYfq.ico"
          rel="shortcut icon"
          type="image/x-icon"
          href="https://static.cdninstagram.com/rsrc.php/yv/r/BTPhT6yIYfq.ico"
        ></link>
      </Head>

      {sideBar && (
        <div className="fixed bottom-0 w-full flex z-10 justify-between bg-white   gap-7 border-r px-10 py-3  border-t  items-center dark:border-r-[#181818]">
          <Link href="/">
            <FaTwitter className="w-7 h-7 cursor-pointer fill-[#1C9BEF] dark:fill-white" />
          </Link>
          <Link href="/">
            <AiFillHome className="w-7 h-7 cursor-pointer" />
          </Link>
          <Link href="/profile">
            <FaUserAlt className="w-6 h-6 cursor-pointer" />
          </Link>

          <Avatar size="10" user={user} />
        </div>
      )}
      <div className={"w-full"}>
        <div className="mb-3 px-4 py-3 flex items-center">
          {!isHome && (
            <button className="mr-10" onClick={handleBack}>
              <FaArrowLeft />
            </button>
          )}
          <p className="font-semibold text-xl">{subTitle}</p>
          {actionBtn && <div className="ml-auto">{actionBtn}</div>}
        </div>

        {isHome && (
          <div className="w-full flex border-b justify-between pb-3 dark:dark:border-b-[#181818]">
            <Link
              href={"/"}
              className="w-full text-center text-sm text-gray-500"
            >
              <span
                className={`${
                  pathName === "/" ? "border-b-2 border-b-[#1C9BEF] pb-3" : ""
                } `}
              >
                For you
              </span>
            </Link>
            <Link
              href={"/following"}
              className="w-full text-center text-sm text-gray-500"
            >
              <span
                className={`${
                  pathName === "/following"
                    ? "border-b-2 border-b-[#1C9BEF] pb-3"
                    : ""
                } `}
              >
                Following
              </span>
            </Link>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default Layout;
