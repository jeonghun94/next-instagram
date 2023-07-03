const UserStory = () => {
  return (
    <div className="w-full flex flex-col items-center gap-2 mr-5 ml-2">
      <div className="w-14 h-14 border rounded-full ring-1 ring-offset-1 ring-gray-300 "></div>
      <p className="text-sm">juhn</p>
    </div>
  );
};

const Stories = () => {
  return (
    <div className="w-full flex py-7 overflow-x-auto">
      {Array(10)
        .fill(0)
        .map((_, i) => (
          <UserStory key={i} />
        ))}
    </div>
  );
};

export default Stories;
