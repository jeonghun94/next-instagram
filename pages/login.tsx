import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import useMutation from "../lib/client/useMutation";
import Layout from "../components/layout";
import Link from "next/link";
import Head from "next/head";

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
        <link
          data-default-icon="https://static.cdninstagram.com/rsrc.php/yv/r/BTPhT6yIYfq.ico"
          rel="shortcut icon"
          type="image/x-icon"
          href="https://static.cdninstagram.com/rsrc.php/yv/r/BTPhT6yIYfq.ico"
        ></link>
      </Head>
      <form
        onSubmit={handleSubmit(submitting)}
        className="w-full border p-4 px-10 flex flex-col items-center"
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
          }  text-white font-bold text-sm`}
        >
          로그인
        </button>
        <div className="w-full grid grid-cols-10 place-items-center my-2">
          <div className="w-full col-span-4 h-1 border-b border-gray-300 divide-x-2"></div>
          <span className="col-span-2 text-sm text-center">또는</span>
          <div className="w-full col-span-4 h-1 border-b border-gray-300 divide-x-2"></div>
        </div>
        <Link
          type="button"
          href="/api/auth/github/start"
          className="flex justify-center items-center text-sm gap-2 rounded-3xl p-1 w-full cursor-pointer placeholder:text-gray-600 focus:outline-none "
          placeholder="이메일 주소"
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
          type="button"
          href="/api/auth/google/start"
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
