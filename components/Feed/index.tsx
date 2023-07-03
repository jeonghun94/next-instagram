import { BsChat, BsHeart, BsBookmark, BsThreeDots } from "react-icons/bs";
import { IoPaperPlaneOutline } from "react-icons/io5";

const Feed = () => {
  return (
    <div className="w-full px-4">
      <div className="h-10 mb-2">
        <div className="w-full h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10  border rounded-full ring-gray-300"></div>

            <div>
              <p className="text-sm font-semibold">
                juhn{" "}
                <span className="text-gray-500 text-sm font-normal ">
                  • 35분
                </span>
              </p>
              <p className="text-xs text-gray-500">Seoul, Korea</p>
            </div>
          </div>

          <button>
            <BsThreeDots />
          </button>
        </div>
      </div>
      <div className="h-96 border rounded-sm"></div>
      <div className="flex justify-between items-center px-2 py-3">
        <div className="flex gap-6 items-center ">
          <button>
            <BsHeart className="w-6 h-6" />
          </button>
          <button className="-mt-1">
            <BsChat className="w-6 h-6" />
          </button>
          <button className="-ml-1">
            <IoPaperPlaneOutline className="w-6 h-6" />
          </button>
        </div>
        <div>
          <BsBookmark className="w-6 h-6" />
        </div>
      </div>
      <div className="w-full px-2 ">
        <p className="text-sm font-semibold">
          jhun의{" "}
          <span className="text-gray-500 text-sm font-normal ">
            게시 물 작업중ㅎㅎㅎㅎ
          </span>
        </p>
        <p className="text-sm text-gray-500">더보기</p>
      </div>
      <hr className="my-6" />
    </div>
  );
};

export default Feed;
