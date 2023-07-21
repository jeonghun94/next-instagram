interface LoadingLayoutProps {
  children: React.ReactNode;
  loading: boolean;
}

const LoadingLayout = ({ children, loading }: LoadingLayoutProps) => {
  return (
    <div className="relative ">
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black opacity-50 z-50">
          <div className="animate-spin w-12 h-12 rounded-full border-t-4 border-[#0095F6]"></div>
        </div>
      )}
      {children}
    </div>
  );
};

export default LoadingLayout;
