import Layout from "../components/HomeLayout";
import { FaFacebookMessenger } from "react-icons/fa";

import { BiMessageAdd } from "react-icons/bi";

const Feeds = () => {
  const handleSend = () => {
    return alert("서비스 준비중입니다.");
  };

  return (
    <Layout header={false}>
      <div className="w-full min-h-screen grid grid-cols-10 ">
        <div className="w-full h-full py-10 col-span-2 border-r flex flex-col items-center gap-5 overflow-y-auto max-h-screen">
          <button>
            <BiMessageAdd className="w-7 h-7" />
          </button>
          <div className="flex flex-col gap-5">
            {Array(12)
              .fill(0)
              .map((_, i) => (
                <div className="w-14 h-14 aspect-square rounded-full border"></div>
              ))}
          </div>
          <br />
        </div>
        <div className="w-full h-full col-span-8 flex flex-col justify-center items-center gap-3">
          <div className="-mt-12 border-[2px] border-black p-5 rounded-full">
            <FaFacebookMessenger className=" w-12 h-12" />
          </div>
          <h1 className="text-xl font-medium">내 메세지</h1>
          <h3 className="text-sm text-gray-500">
            친구나 그룹에 비공개 사진과 메시지를 보내보세요
          </h3>
          <button
            className="px-4 py-1.5 bg-[#0095F6] text-sm text-white font-semibold rounded-lg"
            onClick={handleSend}
          >
            메시지 보내기
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Feeds;
