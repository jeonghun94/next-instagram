import Tweets from "../tweets";
import useSWR from "swr";

const Likes = () => {
  const { data } = useSWR("/api/user/likes");

  const t: any = [];

  data?.likes.find((like: any) => {
    t.push(like.tweet);
  });

  return (
    <div>
      {data?.likes.length > 0 ? (
        <>
          <Tweets tweets={t} />
        </>
      ) : (
        <div className="flex flex-col gap-1 p-7">
          <h1 className="text-3xl font-bold">
            You don’t have any <br /> likes yet
          </h1>
          <h3 className="text-gray-500 text-sm font-semibold">
            Tap the heart on any Tweet to show it some love. <br /> When you do,
            it’ll show up here.
          </h3>
        </div>
      )}
    </div>
  );
};

export default Likes;
