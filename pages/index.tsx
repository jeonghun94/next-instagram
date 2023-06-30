import useSWR from "swr";
import useUser from "../lib/client/useUser";
import { Tweet, User } from "@prisma/client";
import Tweets from "../components/tweets";
import Layout from "../components/tweetLayout";
import Upload from "./upload";

export interface ITweets {
  ok?: boolean;
  tweets: TweetWithUser[];
}
interface TweetWithUser extends Tweet {
  user: User;
  _count: {
    replys: number;
    likes: number;
  };
}

const Home = () => {
  const { isLoading } = useUser();
  const { data } = useSWR<ITweets>("/api/tweet");

  return isLoading ? (
    <div className="min-h-screen w-full flex justify-center items-center">
      <h1>Loading</h1>
    </div>
  ) : (
    <Layout isHome pageTitle="Home" subTitle="Home">
      <Upload />
      {data && data.tweets?.length > 0 ? (
        <Tweets tweets={data.tweets} />
      ) : (
        <h1 className="text-center text-sm m-5">No Tweets.</h1>
      )}
    </Layout>
  );
};

export default Home;
