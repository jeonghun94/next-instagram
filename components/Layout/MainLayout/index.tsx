import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { FaArrowLeft } from "react-icons/fa";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
// import CustomHead from "../../Head";
// import BottomTabBar from "../../BottomTabBar";
import CustomHead from "@/components/Head";
import BottomTabBar from "@/components/BottomTabBar";
import useMutation from "@/lib/client/useMutation";

interface LayoutProps {
  subTitle?: string | React.ReactNode;
  actionBtn?: React.ReactNode;
  children: React.ReactNode;
  pageTitle?: string;
  isHome?: boolean;
  header?: boolean;
  bottomTabBar?: boolean;
}

export const ModalOverlay = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { register, watch, handleSubmit, setValue } = useForm<IForm>();

  const photo = watch("photo");
  const [photos, setPhotos] = useState(0);
  const [photoPreview, setPhotoPreview] = useState("");

  useEffect(() => {
    const files = [];
    if (photo && photo.length > 0) {
      for (let i = 0; i < photo.length; i++) {
        files.push(URL.createObjectURL(photo[i]));
      }
      setPhotos(photo.length);
      setPhotoPreview(files.toString());
    }
  }, [photo]);

  const [imageIndex, setImageIndex] = useState(0);
  const handlePreviewImageIndex = (action: "left" | "right") => {
    if (action === "left") {
      imageIndex === 0
        ? setImageIndex(photos - 1)
        : setImageIndex(imageIndex - 1);
    } else {
      imageIndex === photos - 1
        ? setImageIndex(0)
        : setImageIndex(imageIndex + 1);
    }
  };

  interface MutationResult {
    ok: boolean;
  }

  interface IForm {
    text: string;
    photo?: FileList;
  }
  const [feed, { data, loading }] = useMutation<MutationResult>("/api/feed");

  const onSubmit = async ({ text, photo }: IForm) => {
    if (loading) return;
    const photoIds = [];

    if (photo && photo.length > 0) {
      // setImageLoading(true);
      for (let i = 0; i < photo.length; i++) {
        const form = new FormData();
        const { uploadURL } = await (await fetch(`/api/files`)).json();
        form.append("file", photo[i], text);
        const {
          result: { id },
        } = await (
          await fetch(uploadURL, { method: "POST", body: form })
        ).json();
        photoIds.push(id);
        // setImageLoading(false);
      }
    }

    feed({
      text,
      photoId: photoIds.join(","),
    });

    setValue("text", "");
    setPhotoPreview("");
    setImageIndex(0);
    setPhotos(0);
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 w-full h-full bg-black opacity-50 
    ${isOpen ? "block" : "hidden"}`}
        onClick={onClose}
      />
      <div
        className={`
    fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg min-w-[350px] h-1/2 overflow-y-auto
    ${isOpen ? "block" : "hidden"}
  `}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1 className="text-center border-b py-2">새 게시물 만들기</h1>
          <div className=" flex flex-col items-center">
            {/* 이미지 박스 */}
            <label className="w-full h-60 cursor-pointer text-gray-600 flex items-center justify-center rounded-md relative">
              <div
                className={`flex flex-col justify-center items-center gap-1`}
              >
                {photoPreview === "" ? (
                  <svg
                    aria-label="이미지나 동영상과 같은 미디어를 나타내는 아이콘"
                    color="rgb(0, 0, 0)"
                    fill="rgb(0, 0, 0)"
                    height="77"
                    role="img"
                    viewBox="0 0 97.6 77.3"
                    width="96"
                  >
                    <path
                      d="M16.3 24h.3c2.8-.2 4.9-2.6 4.8-5.4-.2-2.8-2.6-4.9-5.4-4.8s-4.9 2.6-4.8 5.4c.1 2.7 2.4 4.8 5.1 4.8zm-2.4-7.2c.5-.6 1.3-1 2.1-1h.2c1.7 0 3.1 1.4 3.1 3.1 0 1.7-1.4 3.1-3.1 3.1-1.7 0-3.1-1.4-3.1-3.1 0-.8.3-1.5.8-2.1z"
                      fill="currentColor"
                    />
                    <path
                      d="M84.7 18.4 58 16.9l-.2-3c-.3-5.7-5.2-10.1-11-9.8L12.9 6c-5.7.3-10.1 5.3-9.8 11L5 51v.8c.7 5.2 5.1 9.1 10.3 9.1h.6l21.7-1.2v.6c-.3 5.7 4 10.7 9.8 11l34 2h.6c5.5 0 10.1-4.3 10.4-9.8l2-34c.4-5.8-4-10.7-9.7-11.1zM7.2 10.8C8.7 9.1 10.8 8.1 13 8l34-1.9c4.6-.3 8.6 3.3 8.9 7.9l.2 2.8-5.3-.3c-5.7-.3-10.7 4-11 9.8l-.6 9.5-9.5 10.7c-.2.3-.6.4-1 .5-.4 0-.7-.1-1-.4l-7.8-7c-1.4-1.3-3.5-1.1-4.8.3L7 49 5.2 17c-.2-2.3.6-4.5 2-6.2zm8.7 48c-4.3.2-8.1-2.8-8.8-7.1l9.4-10.5c.2-.3.6-.4 1-.5.4 0 .7.1 1 .4l7.8 7c.7.6 1.6.9 2.5.9.9 0 1.7-.5 2.3-1.1l7.8-8.8-1.1 18.6-21.9 1.1zm76.5-29.5-2 34c-.3 4.6-4.3 8.2-8.9 7.9l-34-2c-4.6-.3-8.2-4.3-7.9-8.9l2-34c.3-4.4 3.9-7.9 8.4-7.9h.5l34 2c4.7.3 8.2 4.3 7.9 8.9z"
                      fill="currentColor"
                    />
                    <path
                      d="M78.2 41.6 61.3 30.5c-2.1-1.4-4.9-.8-6.2 1.3-.4.7-.7 1.4-.7 2.2l-1.2 20.1c-.1 2.5 1.7 4.6 4.2 4.8h.3c.7 0 1.4-.2 2-.5l18-9c2.2-1.1 3.1-3.8 2-6-.4-.7-.9-1.3-1.5-1.8zm-1.4 6-18 9c-.4.2-.8.3-1.3.3-.4 0-.9-.2-1.2-.4-.7-.5-1.2-1.3-1.1-2.2l1.2-20.1c.1-.9.6-1.7 1.4-2.1.8-.4 1.7-.3 2.5.1L77 43.3c1.2.8 1.5 2.3.7 3.4-.2.4-.5.7-.9.9z"
                      fill="currentColor"
                    />
                  </svg>
                ) : (
                  <>
                    <Image
                      className="relative"
                      src={photoPreview.split(",")[imageIndex]}
                      alt="이미지를 불러올 수 없습니다:("
                      fill
                      quality={100}
                    />

                    {photoPreview.split(",").length > 1 && (
                      <>
                        <button
                          onClick={() => handlePreviewImageIndex("left")}
                          className="absolute flex justify-center items-center border  bg-black bg-opacity-80 w-8 h-8 text-white aspect-square rounded-full left-5"
                        >
                          <BsChevronLeft />
                        </button>

                        <button
                          onClick={() => handlePreviewImageIndex("right")}
                          className="absolute flex justify-center items-center bg-black bg-opacity-80 w-8 h-8 text-white aspect-square rounded-full right-5"
                        >
                          <BsChevronRight />
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
              <input
                {...register("photo")}
                className="hidden"
                accept="image/*"
                type="file"
                multiple
              />
            </label>
            <textarea
              {...register("text", {
                required: {
                  value: true,
                  message: "Please enter your text",
                },
              })}
              className="w-full h-20  resize-none outline-none p-2"
              placeholder="문구 입력..."
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
              onClick={onClose}
            >
              공유하기
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

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
    <div className="w-full min-h-screen flex flex-col pb-7">
      <CustomHead pageTitle={pageTitle} />
      {header && (
        <>
          <div
            className={`px-4 py-4 flex items-center border-b border-gray-250 sticky top-0 bg-white z-10`}
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
        </>
      )}

      {children}
      {bottomTabBar && <BottomTabBar />}
    </div>
  );
};

export default Layout;
