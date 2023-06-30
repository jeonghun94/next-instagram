import useSWR from "swr";
import useUser from "../lib/client/useUser";
import Layout from "../components/tweetLayout";
import Tweets from "../components/tweets";
import { ITweets } from ".";
import Upload from "./upload";

const Home = () => {
  const { isLoading } = useUser();
  const { data } = useSWR<ITweets>("/api/user/following");

  return isLoading ? (
    <div className="min-h-screen w-full flex justify-center items-center">
      <h1>Loading</h1>
    </div>
  ) : (
    <Layout isHome pageTitle="Follwing" subTitle="Follwing">
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
