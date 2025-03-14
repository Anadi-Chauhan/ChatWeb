import { FaHandPointRight } from "react-icons/fa";
import Link from "next/link";
import TermsNavbar from "./TermsNavbar ";

export default function UserTerms() {
  return (
    <>
      <div className="bg-[#000000] text-white flex flex-col h-screen overflow-hidden">
        <div className="absolute w-full h-full bg-no-repeat bg-cover bg-center opacity-20 bg-[url('/HomeMainBg.jpg')]"></div>
        
        <div className="w-full z-10 py-5">
          <TermsNavbar />
        </div>
        <div className="absolute mt-32 px-6 py-2 md:px-12 lg:px-24 z-10">
          <div className="w-[90%] mx-auto mt-4">
            <p>
              <Link className="text-blue-500 cursor-pointer" href="/">
                Infinity-chat.org
              </Link> provides website features and services when you visit our website, use our chat rooms, use our applications for mobile, or use software provided by our company in connection with any of the services. Do not use teen-chat.org if you do not agree to the Terms of Use described below. Your use of our website means you agree to these Terms of Use.
            </p>

            <p className="mt-4 text-xl font-roboto">
              Our company provides the chat services subject to the following conditions:
            </p>

            <h2 className="text-2xl font-semibold font-roboto mt-4">Age Requirements:</h2>
            <div className="flex items-start gap-3 mt-2">
              <FaHandPointRight size={30} />
              <p className="font-roboto">
                You must be at least 13 years old to use our website. You must not be older than 19 years of age. Any users found to be older than 19 years of age will be banned and/or reported to the authorities.
              </p>
            </div>

            <h2 className="text-2xl font-semibold font-roboto mt-4">Internet Connections:</h2>
            <div className="flex items-start gap-3 mt-2">
              <FaHandPointRight size={40} />
              <p className="font-roboto mt-2">
                Our website can be used in any country in the world provided you are able to connect. Some countries such as Iran or Pakistan have been known to block this website for whatever reason. We do not allow the use of VPNs as they cause more trouble than not.
              </p>
            </div>

            <h2 className="text-2xl font-semibold font-roboto mt-4">User Generated Content:</h2>
            <div className="flex items-start gap-3 mt-2">
              <FaHandPointRight size={80} />
              <p className="font-roboto mt-6">
                Some areas of the website allow user-generated content (UGC). We strictly forbid any content that has any mature (adult) nature to it. This also obviously applies to anyone posting illegal underage or child material. You will risk receiving a permanent ban and referral to law enforcement if you post content or material that can be classified as such including profile and background photos. We will make sure you are prosecuted to the fullest extent of the law and assist law enforcement agencies in any way to identify you.
              </p>
            </div>

            <h2 className="text-2xl font-semibold font-roboto mt-4">Personal Information:</h2>
            <div className="flex items-start gap-3 mt-2">
              <FaHandPointRight size={22} />
              <p className="font-roboto">
                You are solely responsible for protecting your own account passwords and other account information you have provided to us including forum registration.
              </p>
            </div>

            <h2 className="text-2xl font-semibold font-roboto mt-4">Image Requirements:</h2>
            <div className="flex items-start gap-3 mt-2">
              <FaHandPointRight size={35} />
              <p className="font-roboto">
                All images uploaded for profile pictures or regular images (for VIP users) must not violate our strict non-nudity policy. The same applies to background covers used in your profile. We forbid all copyrighted material for use and all illegal material.
              </p>
            </div>
          </div>
        </div>
        <div className="h-12 w-full z-10 bg-opacity-15 bg-green-900 text-white mt-auto">
          <div className="flex flex-wrap justify-around items-center h-full px-4 text-xs">
            <p>
              2024 ©{" "}
              <Link href="/" className="text-blue-500 hover:text-blue-300">
                Infinity-Chat.org - Free Chat Rooms
              </Link>
            </p>
            <Link
              href="/terms"
              className="cursor-pointer hover:text-blue-500"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className="cursor-pointer hover:text-blue-500"
            >
              Privacy Policy
            </Link>
            <Link
              href="/support"
              className="cursor-pointer hover:text-blue-500"
            >
              Contact us
            </Link>
            <Link
              href="/support"
              className="cursor-pointer hover:text-blue-500"
            >
              Language
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
