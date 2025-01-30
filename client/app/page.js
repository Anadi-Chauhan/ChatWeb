"use client";

import Navbar from "./MyComponents/Navbar";
import { FaUserPlus } from "react-icons/fa";
import Spline from "@splinetool/react-spline";
import Image from "next/image";
import Link from "next/link";
import FallingLeaves from "./leaf/page";
import { useEffect } from "react";
import RegisterPage from "./register/page";
import { motion } from "framer-motion";
import LoginPage from "./login/page";

export default function Home() {
  const text = `Welcome to our free chat website. Our chat community gives you the opportunity to make new friends, meet cool people, and share great memories and moments with other people from all over the world. We have a friendly environment that is fully moderated to ensure your safety. You can register your username or log in as a guest user in global chat. Please make sure you follow all the rules of the chat rooms or you will not be able to participate.`;

  // useEffect(() => {
  //   const audio = new Audio('./HomeSound.mp3')
  //   audio.loop = true;
  //   audio.volume = 0.04
  //   audio.play()
  // },[])

  const words = text.split(" ");
  return (
    <div className="w-full h-screen flex flex-col bg-black overflow-auto">
      <div id="wrap" className="absolute inset-0 pointer-events-none z-0">
        <FallingLeaves />
      </div>
      {/* Background Image */}
      <div className="absolute inset-0 bg-[url('/HomeMainBg.jpg')] bg-cover bg-center opacity-30"></div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col overflow-x-hidden overflow-y-scroll scroll-smooth scrollbar-none">
        <div className="fixed right-0">
          <Navbar />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false, amount: 0.3 }}
          className="relative flex flex-col justify-center items-center mt-20 px-6 sm:mt-28 lg:mt-32"
        >
          <div className="flex justify-center mr-20 items-center mb-12 hover:scale-125 transition duration-700">
            <Image
              src="logo.svg"
              alt="logo"
              className="w-24 sm:w-32 lg:w-40"
              height={50}
              width={50}
            />
          </div>
          <p className="text-center text-base mt-32 sm:text-lg lg:text-4xl text-slate-400 perspective-[1000px] flex gap-2 items-center">
            Find People to send messages
            <FaUserPlus
              className="text-white hover:scale-110 transition ease-in-out duration-400"
              size={28}
            />
          </p>
          <p className="text-white ml-10 flex flex-wrap gap-[6px] font-roboto text-xs sm:text-base lg:text-lg text-center mt-4 max-w-6xl">
            {words.map((word, index) => {
              return (
                <span
                  key={index}
                  className="hover:scale-[1.15] transition-transform duration-300"
                >
                  {word}
                </span>
              );
            })}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false, amount: 0.3 }}
          className="relative mt-24"
        >
          <RegisterPage />
          {/* <LoginPage /> */}
        </motion.div>
      </div>

      {/* Footer */}
      <div className="h-12 w-full z-10 bg-opacity-15 bg-green-900 text-white">
        <div className="flex flex-wrap justify-around items-center h-full px-4 text-xs">
          <p>
            2024 ©{" "}
            <Link href="/" className="text-blue-500 hover:text-blue-300">
              Infinity-Chat.org - Free Chat Rooms
            </Link>
          </p>
          <p className="cursor-pointer hover:text-blue-500">Terms of Service</p>
          <p className="cursor-pointer hover:text-blue-500">Privacy Policy</p>
          <p className="cursor-pointer hover:text-blue-500">Contact us</p>
          <p className="cursor-pointer hover:text-blue-500">Language</p>
        </div>
      </div>
    </div>
  );
}
