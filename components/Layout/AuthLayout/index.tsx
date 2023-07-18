import React from "react";
import Link from "next/link";
import ErrorText from "../../error-text";

interface LayoutProps {
  children: React.ReactNode;
  error?: string | null;
  isLogin?: boolean;
}

export default function Layout({ children, isLogin, error }: LayoutProps) {
  return (
    <div className="w-full min-h-screen flex justify-center ">
      <div
        className={`w-full h-full mx-4 p-4 px-4 flex flex-col justify-center items-center ${
          isLogin ? "mt-12" : ""
        }`}
      >
        {children}

        <div className="p-5 my-3 border w-full text-sm text-black text-center font-medium ">
          {isLogin ? "계정이 없으신가요?" : "이미 계정이 있으신가요?"}{" "}
          <Link href={isLogin ? "/register" : "login"}>
            <button className="text-[#1C9BEF] cursor-pointer">
              {isLogin ? "가입하기" : "로그인"}
            </button>
          </Link>
        </div>
        {error && <ErrorText error={error} />}
      </div>
    </div>
  );
}
