import Layout from "../components/HomeLayout";
import { BiSearch } from "react-icons/bi";

const Feeds = () => {
  const Feed = () => {
    return <div className="w-full h-30 aspect-square border"></div>;
  };

  return (
    <Layout header={false}>
      <div className="w-full h-auto flex items-center px-3 py-5">
        <div className="bg-[#EFEFEF] p-3 rounded-tl-lg rounded-bl-lg">
          <BiSearch className="text-[#8E8E8E]" />
        </div>
        <input
          className="w-full py-2  border-0 rounded-tr-lg rounded-br-lg bg-[#EFEFEF] outline-none placeholder:text-[#8E8E8E]"
          type="text"
          placeholder="검색"
        />
      </div>

      <div className="grid grid-cols-3 ">
        {Array(30)
          .fill(0)
          .map((_, i) => (
            <Feed key={i} />
          ))}
      </div>
      <br />
      <br />
    </Layout>
  );
};

export default Feeds;
