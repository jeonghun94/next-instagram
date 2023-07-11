import { useEffect, useState } from "react";
import client from "@/lib/server/db";
import { useForm } from "react-hook-form";
import useMutation from "@/lib/client/useMutation";
import Layout from "@/components/HomeLayout";
import ErrorText from "@/components/error-text";
import Avatar from "@/components/user/avatar";
import useUser from "@/lib/client/useUser";
import { NextPageContext } from "next";
import { withSsrSession } from "@/lib/server/withSession";
import { InstagramUser } from "@prisma/client";

interface FormProps {
  name: string;
  password: string;
  photo: FileList;
}

interface MutationResult {
  ok: boolean;
  error: string;
  password: string;
}

interface D {
  user: InstagramUser;
}

const EditProFile = ({ user }: D) => {
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState } = useForm<FormProps>();
  // const { user } = useUser();
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
    <Layout pageTitle="프로필 편집" subTitle="프로필 편집" bottomTabBar={false}>
      <h1 className="pl-5 py-5 text-2xl font-semibold">설정</h1>
      <div className="mx-2">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full border rounded-[3px] p-4  flex flex-col items-start  justify-start pb-32 relative"
        >
          <h1 className="pl-2 py-6 text-2xl text-left font-normal self-start">
            프로필 편집
          </h1>

          <div className="flex gap-4">
            <Avatar size="10" user={user} textSize="md" />
            <div className="flex flex-col">
              <p className="font-semibold">{user?.username}</p>
              <label className="cursor-pointer text-gray-600 flex items-center justify-center rounded-md relative">
                <div
                  className={`flex flex-col justify-center items-center gap-1`}
                >
                  <h3 className="text-xs text-[#0095F6] font-bold">
                    프로필 사진 바꾸기
                  </h3>
                </div>
                <input
                  {...register("photo")}
                  className="hidden"
                  accept="image/*"
                  type="file"
                  multiple
                />
              </label>
            </div>
          </div>

          <div className="w-full flex flex-col gap-2 my-3">
            <h1 className="font-semibold">이름</h1>
            <label htmlFor="name">
              <input
                {...register("name", {
                  required: {
                    value: true,
                    message: "Email is required",
                  },
                })}
                className="text-xs border bg-[#FAFAFA] border-gray-300 rounded-[4px] p-2 w-2/3  placeholder:text-gray-600 placeholder:bg-[#FAFAFA] focus:outline-none"
                placeholder="이름"
                value={user?.name}
                type="text"
                name="name"
                id="name"
              />
            </label>
          </div>
          <div className="w-full flex flex-col gap-2">
            <h1 className="font-semibold">비밀번호</h1>
            <label htmlFor="password">
              <input
                {...register("password", {
                  required: {
                    value: true,
                    message: "Email is required",
                  },
                })}
                className="text-xs border bg-[#FAFAFA] border-gray-300 rounded-[4px] p-2 w-2/3 placeholder:text-gray-600 placeholder:bg-[#FAFAFA] focus:outline-none"
                placeholder="비밀번호"
                value={user?.password}
                type="password"
                name="password"
                id="password"
              />
            </label>
          </div>

          <button
            className={`w-auto mt-4 p-1.5 px-3 text-sm text-white rounded-lg font-bold ${
              formState.isValid
                ? "bg-[#0095F6]"
                : "bg-[#C0DFFD] cursor-not-allowed"
            }`}
          >
            제출
          </button>
        </form>
      </div>
      {error && <ErrorText error={error} />}
    </Layout>
  );
};

export default EditProFile;

export const getServerSideProps = withSsrSession(
  async ({ req }: NextPageContext) => {
    const user = await client.instagramUser.findUnique({
      where: {
        id: Number(req?.session.user?.id),
      },
    });

    return {
      props: {
        user: JSON.parse(JSON.stringify(user)),
      },
    };
  }
);
