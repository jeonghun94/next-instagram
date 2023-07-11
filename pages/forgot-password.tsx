import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useMutation from "../lib/client/useMutation";
import Layout from "../components/HomeLayout";
import Link from "next/link";
import { IoLockClosedOutline } from "react-icons/io5";
import ErrorText from "@/components/error-text";

interface FormProps {
  email: string;
}

interface MutationResult {
  ok: boolean;
  error: string;
  password: string;
}

export default function ResetPassword() {
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState } = useForm<FormProps>();
  const [password, { loading, data }] =
    useMutation<MutationResult>("/api/user/password");

  const onSubmit = async (formData: FormProps) => {
    await password(formData);
  };

  const setErrorWithTimeout = (errorMessage: string) => {
    setError(errorMessage);
    setTimeout(() => {
      setError(null);
    }, 3000);
  };

  useEffect(() => {
    if (data) {
      if (data.ok) {
        console.log(data, "data");
      } else {
        setErrorWithTimeout(data.error);
      }
    }
  }, [data]);

  return (
    <Layout isHome pageTitle="비밀번호 재설정" bottomTabBar={false}>
      <div className="m-14 my-20">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full border rounded-[3px] p-4 px-10 flex flex-col items-center pb-32 relative"
        >
          <div className="p-4 my-3 border-2 border-black rounded-full">
            <IoLockClosedOutline className="w-14 h-14" />
          </div>
          <h1 className="font-semibold">로그인에 문제가 있나요?</h1>
          <p className="my-2 text-sm text-center text-gray-500">
            이메일 주소, 또는 사용자 이름을 입력하시면 <br /> 계정에 다시
            액세스할 비밀번호를 보내드립니다.
          </p>
          <div className="w-full flex flex-col gap-2">
            <label htmlFor="email">
              <input
                {...register("email", {
                  required: {
                    value: true,
                    message: "Email is required",
                  },
                })}
                className="text-xs border bg-[#FAFAFA] border-gray-300 rounded-[2px] p-3 w-full placeholder:text-gray-600 placeholder:bg-[#FAFAFA] focus:outline-none"
                placeholder="사용자 이메일"
                type="email"
                name="email"
                id="email"
              />
            </label>
          </div>
          <button
            className={`w-full p-1.5 mt-4 rounded-lg text-sm text-white font-bold ${
              formState.isValid
                ? "bg-[#0095F6]"
                : "bg-[#C0DFFD] cursor-not-allowed"
            }`}
          >
            비밀번호 재설정
          </button>
          <Link
            href="/forgot-password"
            className="text-[#385898] flex justify-center items-center text-xs gap-2 rounded-3xl my-3 w-full cursor-not-allowed placeholder:text-gray-600 focus:outline-none"
            placeholder="이메일 주소"
          >
            비밀번호를 재설정할 수 없나요?
          </Link>
          <div className="w-full grid grid-cols-10 place-items-center my-3">
            <div className="w-full col-span-4 h-1 border-b border-gray-300 divide-x-2"></div>
            <span className="col-span-2 text-sm text-center">또는</span>
            <div className="w-full col-span-4 h-1 border-b border-gray-300 divide-x-2"></div>
          </div>
          <Link
            href="/register"
            className="flex justify-center items-center text-sm gap-2 rounded-3xl p-1 w-full font-semibold cursor-pointer placeholder:text-gray-600 focus:outline-none"
          >
            새 계정 만들기
          </Link>

          {data && data.ok && (
            <p className="mt-3 -mb-7 text-xs text-red-500 font-semibold">
              저장된 비밀번호는 {data.password} 입니다.
            </p>
          )}

          <Link
            href={"/login"}
            className="w-full py-3 text-center text-sm font-semibold border absolute bottom-0 bg-gray-50"
          >
            로그인으로 돌아가기
          </Link>
        </form>
      </div>
      {error && <ErrorText error={error} />}
    </Layout>
  );
}
