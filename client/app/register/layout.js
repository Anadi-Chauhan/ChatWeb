import Image from "next/image";

export default function AuthLayout({ children }) {
    return (
      <>
      <div className="flex justify-center items-center h-21 shadow-md bg-white" >
        <Image src="/logo.svg" height={100} width={100} alt="search" />
      </div>
        {children}
      </>
    );
  }