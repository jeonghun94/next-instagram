import useSWR from "swr";
import useUser from "../lib/client/useUser";
import { Tweet, User } from "@prisma/client";
import Tweets from "../components/tweets";
import Layout from "../components/HomeLayout";

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

  return isLoading ? (
    <div className="min-h-screen w-full flex justify-center items-center">
      <h1>Loading</h1>
    </div>
  ) : (
    <Layout isHome>
      <h1>hi</h1>
    </Layout>
  );
};

export default Home;
