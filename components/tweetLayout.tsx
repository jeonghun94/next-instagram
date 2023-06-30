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
  const { user, isLoading } = useUser();
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
        <title>{title}</title>
        <link
          rel="shortcut icon"
          href="https://abs.twimg.com/favicons/twitter.2.ico"
          type="image/x-icon"
        />
      </Head>

      {sideBar && (
        <div className="flex flex-col  gap-7 border-r w-[14%]  p-1 py-3  items-center dark:border-r-[#181818]">
          <Link href="/">
            <FaTwitter className="w-7 h-7 cursor-pointer fill-[#1C9BEF] dark:fill-white" />
          </Link>
          <Link href="/">
            <AiFillHome className="w-7 h-7 cursor-pointer" />
          </Link>
          <Link href="/profile">
            <FaUserAlt className="w-6 h-6 cursor-pointer" />
          </Link>
          {/* <IoLogOut
          onClick={handleLogout}
          className="ml-1 w-8 h-8 cursor-pointer"
        /> */}

          <Avatar size="10" user={user} />
        </div>
      )}
      <div className={sideBar ? "w-[86%]" : "w-full"}>
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
