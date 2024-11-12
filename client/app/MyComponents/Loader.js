export default function Loading({bg}) {
  return (
    <>
      <div className={`flex space-x-2 justify-center items-center ${bg}`}>
        <span className="sr-only">Loading...</span>
        <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.75s]"></div>
        <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.375s]"></div>
        <div className="h-2 w-2 bg-primary rounded-full animate-bounce"></div>
      </div>
      </>
  );
}
