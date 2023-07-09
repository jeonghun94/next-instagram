import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import useMutation from "../lib/client/useMutation";
import Layout from "../components/layout";
import Link from "next/link";
import Head from "next/head";
import { AiFillFacebook } from "react-icons/ai";

interface IForm {
  email: string;
  name: string;
  username: string;
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
  const [registerUser, { loading, data }] =
    useMutation<MutationResult>("/api/register");
  const submitting = async (validForm: IForm) => {
    if (loading) return;
    await registerUser(validForm);
  };

  const setErrorWithTimeout = (errorMessage: string) => {
    setError(errorMessage);
    setTimeout(() => {
      setError(null);
    }, 3000);
  };

  useEffect(() => {
    if (data) {
      data.ok ? router.push("/login") : setErrorWithTimeout(data.error);
    }
  }, [data]);

  return (
    <Layout error={error}>
      <Head>
        <title>가입하기 • Instagram</title>
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
        <i className="mt-8 w-[175px] h-[51px] inline-block bg-no-repeat bg-[url('https://static.cdninstagram.com/rsrc.php/v3/yK/r/ATdtiLb2BQ9.png')] bg-cover"></i>
        <p className="my-4 text-lg text-[#737373] text-center font-semibold">
          친구들의 사진과 동영상을 보려면 가입하세요.
        </p>

        <button className="flex justify-center gap-1 items-center bg-[#0095F6] w-full py-2 text-white rounded-lg mb-1 text-sm">
          <AiFillFacebook className="text-xl" /> Facebook으로 로그인
        </button>

        <div className="w-full grid grid-cols-10 place-items-center my-2">
          <div className="w-full col-span-4 h-1 border-b border-gray-300 divide-x-2"></div>
          <span className="col-span-2 text-sm text-center  ">또는</span>
          <div className="w-full col-span-4 h-1 border-b border-gray-300 divide-x-2"></div>
        </div>

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
          <label htmlFor="name">
            <input
              {...register("name", {
                required: {
                  value: true,
                  message: "name is required",
                },
              })}
              className="text-xs border bg-[#FAFAFA] border-gray-300 rounded-[2px] p-3 w-full placeholder:text-gray-600 placeholder:bg-[#FAFAFA] focus:outline-none "
              placeholder="성명"
              type="name"
              name="name"
              id="name"
            />
          </label>
          <label htmlFor="username">
            <input
              {...register("username", {
                required: {
                  value: true,
                  message: "username is required",
                },
              })}
              className="text-xs border bg-[#FAFAFA] border-gray-300 rounded-[2px] p-3 w-full placeholder:text-gray-600 placeholder:bg-[#FAFAFA] focus:outline-none "
              placeholder="사용자 이름"
              type="username"
              name="username"
              id="username"
            />
          </label>
          <label htmlFor="password">
            <input
              {...register("password", {
                required: {
                  value: true,
                  message: "password is required",
                },
              })}
              className="text-xs border bg-[#FAFAFA] border-gray-300 rounded-[2px] p-3 w-full placeholder:text-gray-600 placeholder:bg-[#FAFAFA] focus:outline-none "
              placeholder="비밀번호"
              type="password"
              name="password"
              id="password"
            />
          </label>
          <p className="text-xs text-[#777] font-medium">
            저희 서비스를 이용하는 사람이 회원님의 연락처 정보를 Instagram에
            업로드했을 수도 있습니다.{" "}
            <span className="text-[#385898] font-semibold">더 알아보기</span>
          </p>
        </div>

        <button
          className={`w-full p-1.5 mt-4 rounded-lg ${
            formState.isValid ? "bg-[#0095F6]" : "bg-[#67B5FA]"
          }  text-white font-bold text-sm`}
        >
          가입
        </button>
      </form>
    </Layout>
  );
};

export default Login;
