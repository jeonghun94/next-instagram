import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useMutation from "@/lib/client/useMutation";
import Image from "next/image";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { IoCloseSharp } from "react-icons/io5";
import LoadingLayout from "@/components/Layout/LoadingLayout";
import { useRouter } from "next/router";

interface MutationResult {
  ok: boolean;
  feedId: number;
  error: string;
}

interface FormProps {
  text: string;
  photo?: FileList;
}

interface FeedUploadFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeedUploadForm = ({ isOpen, onClose }: FeedUploadFormProps) => {
  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormProps>();

  const photo = watch("photo");
  const router = useRouter();

  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [imageIndex, setImageIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [photos, setPhotos] = useState<number>(0);

  useEffect(() => {
    if (photo && photo.length > 0) {
      const files = Array.from(photo).map((file) => URL.createObjectURL(file));
      for (let i = 0; i < photo.length; i++) {
        files.push(URL.createObjectURL(photo[i]));
      }
      setPhotos(photo.length);
      setPhotoPreview(files.toString());

      console.log(photoPreview);
      console.log(typeof photoPreview.split(",").length, "dsds");
    }
  }, [photo]);

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

  const handleClose = () => {
    onClose();
    reset();
    setPhotoPreview("");
    setImageIndex(0);
    setPhotos(0);
  };

  const [feed, { data, loading: feedLoading }] =
    useMutation<MutationResult>("/api/feed");

  const onSubmit = async ({ text, photo }: FormProps) => {
    if (feedLoading) return;
    setLoading(true);
    const photoIds = [];

    if (photo && photo.length > 0) {
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
      }
    }

    feed({
      text,
      photoId: photoIds.join(","),
    });

    reset();
    setPhotoPreview("");
    setImageIndex(0);
    setPhotos(0);
  };

  useEffect(() => {
    if (data?.ok) {
      router.push(`/feed/${data.feedId}`);
      setLoading(false);
      onClose();
    }
    setLoading(false);
  }, [data]);

  return (
    <LoadingLayout loading={loading}>
      {isOpen && (
        <>
          <div
            className={`fixed top-0 left-0 w-full h-screen bg-[rgba(0,0,0,0.2)] z-30`}
            onClick={handleClose}
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white z-40 rounded-lg min-w-[350px] h-auto  pb-4 overflow-y-auto">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-5 gap-5  border-b">
                <div></div>
                <h1 className="text-center  col-span-3 py-2 ">
                  새 게시물 만들기
                </h1>
                <div className="self-center place-content-end">
                  <IoCloseSharp
                    onClick={handleClose}
                    className="cursor-pointer"
                  />
                </div>
              </div>
              <div className=" flex flex-col items-center ">
                <label className="w-full h-72 cursor-pointer text-gray-600 flex items-center justify-center rounded-md relative">
                  <div className="flex flex-col justify-center items-center gap-1">
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

                        {photos > 1 ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handlePreviewImageIndex("left")}
                              className="absolute flex justify-center items-center bg-black bg-opacity-80 w-8 h-8 text-white aspect-square rounded-full left-5"
                            >
                              <BsChevronLeft />
                            </button>

                            <button
                              type="button"
                              onClick={() => handlePreviewImageIndex("right")}
                              className="absolute flex justify-center items-center bg-black bg-opacity-80 w-8 h-8 text-white aspect-square rounded-full right-5"
                            >
                              <BsChevronRight />
                            </button>
                          </>
                        ) : null}
                      </>
                    )}
                  </div>

                  <input
                    {...register("photo", {
                      required: {
                        value: true,
                        message: "사진을 선택해주세요.",
                      },
                    })}
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
                      message: "내용을 입력해주세요.",
                    },
                  })}
                  className="w-full h-12  resize-none outline-none p-2 border-b m-3"
                  placeholder="내용 입력..."
                />
                {errors && (
                  <p className="text-red-500 text-sm">
                    {errors.text && errors.photo
                      ? "사진과 내용을 입력해주세요."
                      : errors.text
                      ? errors.text.message
                      : errors.photo?.message}
                  </p>
                )}

                <button className="bg-blue-500 text-white px-4 py-2 rounded my-4 ">
                  공유하기
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </LoadingLayout>
  );
};

export default FeedUploadForm;
