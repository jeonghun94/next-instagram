import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FaArrowLeft } from "react-icons/fa";
import CustomHead from "@/components/Head";
import BottomTabBar from "@/components/BottomTabBar";

interface LayoutProps {
  subTitle?: string | React.ReactNode;
  actionBtn?: React.ReactNode;
  children: React.ReactNode;
  pageTitle?: string;
  isHome?: boolean;
  header?: boolean;
  bottomTabBar?: boolean;
}

const Layout = ({
  children,
  isHome,
  subTitle,
  pageTitle,
  actionBtn,
  header = true,
  bottomTabBar = true,
}: LayoutProps) => {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };

  return (
    <div className="w-full min-h-screen flex flex-col pb-7 ">
      <CustomHead pageTitle={pageTitle} />
      {header && (
        <div
          className={`z-10 px-4 py-4 flex items-center border-b border-gray-250 sticky top-0 bg-white `}
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
      )}

      {children}
      {bottomTabBar && <BottomTabBar />}
    </div>
  );
};

export default Layout;
