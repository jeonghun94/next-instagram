interface LoadingLayoutProps {
  loading: boolean;
  children: React.ReactNode;
}

const LoadingLayout = ({ loading, children }: LoadingLayoutProps) => {
  return (
    <div className="relative ">
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-black opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#0095F6]"></div>
        </div>
      )}
      {children}
    </div>
  );
};

export default LoadingLayout;
