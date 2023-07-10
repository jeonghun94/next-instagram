import { FeedWithUser } from "@/types";
import useSWR from "swr";
import useUser from "@/lib/client/useUser";
import Layout from "@/components/HomeLayout";
import Feed from "@/components/Feed";
import Stories from "@/components/Stories/inedex";

interface FeedsProps {
  ok?: boolean;
  feeds: FeedWithUser[];
}

const Home = () => {
  const { isLoading } = useUser();
  const { data } = useSWR<FeedsProps>("/api/feed/following");
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
