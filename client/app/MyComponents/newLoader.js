export default function LoadingNewStyle({bg}) {
    return (
      <>
      <div className="bg-[#fffbfba8] rounded-lg py-3" >  
        <div className={`flex justify-center space-x-2 items-center ${bg}`}>
          <span className="sr-only">Loading...</span>
          <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.75s]"></div>
          <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.375s]"></div>
          <div className="h-2 w-2 bg-primary rounded-full animate-bounce"></div>
        </div>
        </div>
        </>
    );
  }