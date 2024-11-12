import Image from "next/image";

export default function AuthLayout({ children }) {
    return (
      <>
      <center><Image src="/logo.svg" height={100} width={100} alt="search" /></center>
        {children}
      </>
    );
  }