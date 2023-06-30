import Tweets from "../tweets";
import useSWR from "swr";

const Replies = () => {
  const { data } = useSWR("/api/user/replies");
  const t: any = [];

  data?.replies.find((like: any) => {
    t.push(like.tweet);
  });
  return (
    <div>
      {data?.replies.length > 0 ? (
        <>
          <Tweets tweets={t} />
        </>
      ) : (
        <div className="flex flex-col gap-1 p-7">
          <h1 className="text-3xl font-bold">
            You don’t have any <br /> replies yet
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

export default Replies;
