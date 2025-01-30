export default function Loading() {
  return (
    <>
      <div className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-900 to-green-800 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-lime-500 to-pink-500 opacity-30 animate-pulse pointer-events-none"></div>
        <div className="relative flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-t-transparent border-green-500 rounded-full animate-spin"></div>
          <p className="text-lg sm:text-xl lg:text-2xl font-medium animate-pulse">
            Loading, please wait...
          </p>
        </div>
      </div>
    </>
  );
}
