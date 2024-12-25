"use client";

import Navbar from "./MyComponents/Navbar";
import { FaUserPlus } from "react-icons/fa";
import { MdMessage } from "react-icons/md";
import Spline from "@splinetool/react-spline";
import Image from "next/image";

export default function Home() {
 
  return (
    <div className="w-full h-screen bg-black"> 
      <div className="w-full opacity-30 h-screen absolute bg-[url('/HomeMainBg.jpg')] bg-cover bg-center"></div>
      <div className="relative">
        <div className="z-10" >
            <Navbar />
        </div>
        <div className="relative"></div>
        <div className="relative flex flex-col justify-center items-center mt-28">
          {/* <Spline
        scene="https://prod.spline.design/NvkaBUmbKmsjqAAt/scene.splinecode" 
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 11,
        }}
      />  */}
          <div className="relative z-10">
            <div className="flex justify-center items-center" >
              <Image src="logo.svg" alt="logo" className="w-32 lg:w-[250px]" height={50} width={50}/>
            </div>
            <p className="text-lg flex gap-3 justify-center items-center lg:text-2xl text-slate-400">
              Find People to send message <FaUserPlus className="
              text-white" size={25} />
              with this icon
            </p>
            <p className="text-white ml-20 text-md mt-4 lg:w-[80vw]">
              Welcome to our free teen chat. Our teen chat community gives you
              the opportunity to make new friends, meet cool people, and share
              great memories and moments with other teenagers from all over the
              world. We have a friendly environment that is fully moderated to
              ensure your safety. You can register your username or log in as a
              guest user below. Please make sure you follow all the rules of the
              chat rooms or you will not be able to participate.Welcome to our
              free teen chat. Our teen chat community gives you the opportunity
              to make new friends, meet cool people, and share great memories
              and moments with other teenagers from all over the world. We have
              a friendly environment that is fully moderated to ensure your
              safety. You can register your username or log in as a guest user
              below. Please make sure you follow all the rules of the chat rooms
              or you will not be able to participate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
//{`flex flex-col justify-center items-center gap-4 ${!user ? "mt-16 lg:mt-36" : "p-20"} items-center lg:items-start`}
