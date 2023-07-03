import useUser from "@/lib/client/useUser";
import Layout from "@/components/HomeLayout";
import Stories from "@/components/Stories/inedex";
import Feed from "@/components/Feed";

const Home = () => {
  const { isLoading } = useUser();
  return isLoading ? (
    <div className="min-h-screen w-full flex justify-center items-center">
      <h1>Loading</h1>
    </div>
  ) : (
    <Layout isHome>
      <Stories />
      <Feed />
      <Feed />
    </Layout>
  );
};

export default Home;
