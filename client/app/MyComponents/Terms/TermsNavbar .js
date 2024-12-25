import Link from "next/link";
import Navbar from "../Navbar";

export default function TermsNavbar() {
  return (
    <>
    <div>
      <Navbar />
    </div>
      <div className="ml-48" >
        <div className="flex justify-around text-2xl font-roboto" >
          <div>
            <Link href="/">
              <p>Chat Guide</p>
            </Link>
          </div>{" "}
          <div>
            <Link href="/">
              <p>Forums</p>
            </Link>
          </div>{" "}
          <div>
            <Link href="/">
              <p>Safety</p>
            </Link>
          </div>{" "}
          <div>
            <Link href="/">
              <p>Emoticoins</p>
            </Link>
          </div>
        </div>
        <div className="ml-32 text-3xl font-roboto font-bold mt-16" >
            TERMS OF USE
        </div>
      </div>
    </>
  );
}
