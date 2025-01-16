"use client";

import Navbar from "./MyComponents/Navbar";
import { FaUserPlus } from "react-icons/fa";
import Spline from "@splinetool/react-spline";
import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full h-screen bg-black overflow-auto">
      <div className="absolute inset-0 bg-[url('/HomeMainBg.jpg')] bg-cover bg-center opacity-30"></div>
      <div className="relative z-10 flex flex-col">
        <div className="ml-auto" >
        <Navbar />
        </div>
        <div className="relative flex flex-col justify-center items-center mt-20 px-6 sm:mt-28 lg:mt-32">
          <div className="flex justify-center items-center mb-6">
            <Image
              src="logo.svg"
              alt="logo"
              className="w-24 sm:w-32 lg:w-40"
              height={50}
              width={50}
            />
          </div>
          <p className="text-center text-base sm:text-lg lg:text-2xl text-slate-400 flex gap-2 items-center">
            Find People to send messages{" "}
            <FaUserPlus className="text-white" size={25} />
          </p>
          <p className="text-white text-sm sm:text-base lg:text-lg text-center mt-4 max-w-3xl">
            Welcome to our free teen chat. Our teen chat community gives you the
            opportunity to make new friends, meet cool people, and share great
            memories and moments with other teenagers from all over the world.
            We have a friendly environment that is fully moderated to ensure
            your safety. You can register your username or log in as a guest
            user below. Please make sure you follow all the rules of the chat
            rooms or you will not be able to participate.
          </p>
        </div>
      </div>
    </div>
  );
}
