import useUser from "@/lib/client/useUser";
import Layout from "@/components/HomeLayout";
import Stories from "@/components/Stories/inedex";
import Feed from "@/components/Feed";
import useSWR from "swr";
import { FeedWithUser } from "@/types";

interface Feeds {
  ok?: boolean;
  feeds: FeedWithUser[];
}

const Home = () => {
  const { isLoading } = useUser();
  const { data } = useSWR<Feeds>("/api/feed/following");
  console.log(data);
  return isLoading ? (
    <div className="min-h-screen w-full flex justify-center items-center">
      <h1>Loading</h1>
    </div>
  ) : (
    <Layout isHome>
      <Stories />

      {data?.feeds.map((feed) => (
        <Feed key={feed.id} feed={feed} />
      ))}
    </Layout>
  );
};

export default Home;
