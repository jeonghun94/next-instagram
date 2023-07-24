import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import useMutation from "@/lib/client/useMutation";
import Link from "next/link";
import Head from "next/head";
import Layout from "@/components/Layout/AuthLayout";
import LoadingSpinner from "@/components/LoadingSpinner";

interface IForm {
  email: string;
  password: string;
}

interface MutationResult {
  ok: boolean;
  error: string;
}

const Login = () => {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const { register, handleSubmit, formState } = useForm<IForm>();
  const [login, { loading, data }] = useMutation<MutationResult>("/api/login");
  const submitting = async (validForm: IForm) => {
    if (loading) return;
    await login(validForm);
  };

  const setErrorWithTimeout = (errorMessage: string) => {
    setError(errorMessage);
    setTimeout(() => {
      setError(null);
    }, 3000);
  };

  useEffect(() => {
    if (data) {
      data.ok ? router.push("/") : setErrorWithTimeout(data.error);
    }
  }, [data]);

  return (
    <Layout isLogin error={error}>
      <Head>
        <title>Instagram</title>
        <meta property="og:locale" content="ko_KR" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Instagram" />
        <meta property="og:description" content="Instagram 졸작" />
        <meta
          property="og:url"
          content="https://next-instagram-five.vercel.app/"
        />
        <meta property="og:site_name" content="Instagram 졸작" />
        <meta
          property="og:image"
          content="data:image/png;base64,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"
        />
        <link
          data-default-icon="https://static.cdninstagram.com/rsrc.php/yv/r/BTPhT6yIYfq.ico"
          rel="shortcut icon"
          type="image/x-icon"
          href="https://static.cdninstagram.com/rsrc.php/yv/r/BTPhT6yIYfq.ico"
        ></link>
      </Head>
      <form
        onSubmit={handleSubmit(submitting)}
        className="w-full border p-4 px-8 flex flex-col items-center"
      >
        <i className="my-8 w-[175px] h-[51px] inline-block bg-no-repeat bg-[url('https://static.cdninstagram.com/rsrc.php/v3/yK/r/ATdtiLb2BQ9.png')] bg-cover"></i>
        <div className="w-full flex flex-col gap-2 ">
          <label htmlFor="email">
            <input
              {...register("email", {
                required: {
                  value: true,
                  message: "Email is required",
                },
              })}
              className="text-xs border bg-[#FAFAFA] border-gray-300 rounded-[2px] p-3 w-full placeholder:text-gray-600 placeholder:bg-[#FAFAFA] focus:outline-none "
              placeholder="사용자 이메일"
              type="email"
              name="email"
              id="email"
            />
          </label>{" "}
          <label htmlFor="password">
            <input
              {...register("password", {
                required: {
                  value: true,
                  message: "Email is required",
                },
              })}
              className="text-xs border bg-[#FAFAFA] border-gray-300 rounded-[2px] p-3 w-full placeholder:text-gray-600 placeholder:bg-[#FAFAFA] focus:outline-none "
              placeholder="비밀번호"
              type="password"
              name="password"
              id="password"
            />
          </label>
        </div>
        <button
          className={`w-full p-1.5 mt-4 rounded-lg ${
            formState.isValid ? "bg-[#0095F6]" : "bg-[#67B5FA]"
          }  text-sm text-white font-bold ${
            loading && "cursor-not-allowed bg-opacity-70"
          } `}
          disabled={loading}
        >
          {loading ? <LoadingSpinner /> : "로그인"}
        </button>
        <div className="w-full grid grid-cols-10 place-items-center my-2">
          <div className="w-full col-span-4 h-1 border-b border-gray-300 divide-x-2"></div>
          <span className="col-span-2 text-sm text-center">또는</span>
          <div className="w-full col-span-4 h-1 border-b border-gray-300 divide-x-2"></div>
        </div>
        <Link
          href="/api/auth/github/start"
          className="flex justify-center items-center text-sm gap-2 rounded-3xl p-1 w-full cursor-pointer placeholder:text-gray-600 focus:outline-none "
        >
          <svg
            aria-hidden="true"
            className="octicon octicon-mark-github"
            height="24"
            version="1.1"
            viewBox="0 0 16 16"
            width="18"
          >
            <path
              fillRule="evenodd"
              d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"
            ></path>
          </svg>
          Github 계정으로 로그인
        </Link>
        <Link
          href="/forgot-password"
          className="text-[#385898] flex justify-center items-center text-xs gap-2 rounded-3xl my-3 w-full cursor-pointer placeholder:text-gray-600 focus:outline-none  "
          placeholder="이메일 주소"
        >
          비밀번호를 잊으셨나요?
        </Link>
      </form>
    </Layout>
  );
};

export default Login;
