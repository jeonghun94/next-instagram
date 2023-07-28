import client from "@/lib/server/db";
import { NextPageContext } from "next";
import { withSsrSession } from "@/lib/server/withSession";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import useMutation from "@/lib/client/useMutation";
import Layout from "@/components/Layout/MainLayout";
import ErrorText from "@/components/error-text";
import Avatar from "@/components/Avatar";
import Image from "next/image";
import LoadingLayout from "@/components/Layout/LoadingLayout";
import {
  EditProfileFormProps,
  EditProfileProps,
  MutationResult,
} from "@/types";

const EditProFile = ({ user }: EditProfileProps) => {
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const { register, handleSubmit, watch, formState } =
    useForm<EditProfileFormProps>({
      defaultValues: {
        password: user.password,
        name: user.name,
      },
    });

  const avatar = watch("avatar");
  const [editProfile, { data }] = useMutation<MutationResult>(
    "/api/user/edit-profile"
  );

  const onSubmit = async ({ avatar, name, password }: EditProfileFormProps) => {
    let newAvatarUrl = "";
    setLoading(true);

    if (avatar && avatar.length > 0) {
      const form = new FormData();
      const { uploadURL } = await (await fetch(`/api/files`)).json();
      form.append("file", avatar[0]);
      const response = await fetch(uploadURL, { method: "POST", body: form });
      const { result } = await response.json();
      newAvatarUrl = result.id;
    }

    editProfile({
      newAvatarUrl,
      password,
      name,
    });
  };

  const setErrorWithTimeout = (errorMessage: string) => {
    setError(errorMessage);
    setTimeout(() => {
      setError(null);
    }, 3000);
  };

  useEffect(() => {
    if (avatar && avatar.length > 0) {
      const files = [];
      files.push(URL.createObjectURL(avatar[0]));
      setAvatarPreview(files.toString());
    }
  }, [avatar]);

  useEffect(() => {
    if (data?.ok) {
      setLoading(false);
      router.push("/profile");
    } else if (data?.error) {
      setErrorWithTimeout(data.error);
    }
    setLoading(false);
  }, [data]);

  return (
    <LoadingLayout loading={loading}>
      <Layout
        pageTitle="프로필 편집"
        subTitle="프로필 편집"
        bottomTabBar={false}
      >
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
              {!avatarPreview ? (
                <Avatar size="10" user={user} textSize="md" />
              ) : (
                <Image
                  className="rounded-full aspect-square"
                  src={avatarPreview}
                  alt="이미지를 불러올 수 없습니다:("
                  width={"40"}
                  height={"40"}
                />
              )}
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
                    {...register("avatar")}
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
    </LoadingLayout>
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
