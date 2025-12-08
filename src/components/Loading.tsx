const Loading = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background space-x-2">
      <div className="h-4 w-4 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="h-4 w-4 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="h-4 w-4 bg-primary rounded-full animate-bounce"></div>
    </div>
  );
};

export default Loading;
