import Link from "next/link";
import Navbar from "../Navbar";

export default function TermsNavbar() {
  return (
    <>
    <div>
      <Navbar />
    </div>
      {/* <div className="ml-48 mt-10" >
        <div className="flex justify-around text-2xl font-roboto" >
          <div>
            <Link href="/">
              <p className="px-6 py-3 text-white rounded-lg hover:bg-[#636957] hover:bg-opacity-35 transition duration-300" >Chat Guide</p>
            </Link>
          </div>{" "}
          <div>
            <Link href="/">
              <p className="px-6 py-3 text-white rounded-lg hover:bg-[#636957] hover:bg-opacity-35 transition duration-300">Forums</p>
            </Link>
          </div>{" "}
          <div>
            <Link href="/">
              <p className="px-6 py-3 text-white rounded-lg hover:bg-[#636957] hover:bg-opacity-35 transition duration-300">Safety</p>
            </Link>
          </div>{" "}
          <div>
            <Link href="/">
              <p className="px-6 py-3 text-white rounded-lg hover:bg-[#636957] hover:bg-opacity-35 transition duration-300">Emoticoins</p>
            </Link>
          </div>
        </div> */}
        <div className="text-3xl font-roboto font-bold mt-6 flex justify-center items-center mr-20" >
            TERMS OF USE
        </div>
      {/* </div> */}
    </>
  );
}
