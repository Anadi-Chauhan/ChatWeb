"use client";

import Navbar from "./MyComponents/Navbar";
import { FaUserPlus } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import FallingLeaves from "./leaf/page";
import { AnimatePresence, motion } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useEffect, useState } from "react";
import { BiDownArrow, BiUpArrow } from "react-icons/bi";
import RegisterationForm from "./MyComponents/HomeComponents/RegistrationForm";
import LoginForm from "./MyComponents/HomeComponents/LoginForm";

export default function Home() {
  const text = `Welcome to our free chat website. Our chat community gives you the opportunity to make new friends, meet cool people, and share great memories and moments with other people from all over the world. We have a friendly environment that is fully moderated to ensure your safety. You can register your username or log in as a guest user in global chat. Please make sure you follow all the rules of the chat rooms or you will not be able to participate.`;
  const [showRegister, setShowRegister] = useState(true);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const words = text.split(" ");
  useEffect(() => {
    const scrollableDiv = document.querySelector(".scrollable-content");
    const handleScroll = () => {
      if (scrollableDiv.scrollTop > 500) {
        setShowScrollIndicator(false);
      } else {
        setShowScrollIndicator(true);
      }
    };

    if (scrollableDiv) {
      scrollableDiv.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollableDiv) {
        scrollableDiv.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const handleGoToTop = () => {
    const scrollableDiv = document.querySelector(".scrollable-content");
    scrollableDiv.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const handleGoToRegister = () => {
    const scrollableDiv = document.querySelector(".scrollable-content");
    scrollableDiv.scrollTo({
      top: scrollableDiv.scrollHeight,
      behavior: "smooth",
    });
  };
  return (
    <div className="w-full h-screen flex flex-col bg-black overflow-auto">
      <div id="wrap" className="absolute inset-0 pointer-events-none z-0">
        <FallingLeaves />
      </div>
      <div className="absolute inset-0 bg-[url('/HomeMainBg.jpg')] bg-cover bg-center opacity-30"></div>
      <div className="relative z-10 flex-1 flex flex-col overflow-x-hidden overflow-y-scroll scrollable-content scroll-smooth scrollbar-none">
        <div className="fixed right-0 z-10">
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
          className="relative flex justify-center items-center mt-24"
        >
          <Image
            src="/logo.svg"
            width={55}
            height={55}
            alt="Logo"
            className="absolute opacity-50 top-14 left-2"
          />
          <AnimatePresence mode="wait">
            {showRegister ? (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <RegisterationForm setShowRegister={setShowRegister} />
              </motion.div>
            ) : (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <LoginForm setShowRegister={setShowRegister} />
              </motion.div>
            )}
          </AnimatePresence>
          <div className="relative flex lg:flex sm:hidden justify-start items-center">
            <DotLottieReact
              src="https://lottie.host/a6b75648-bdd3-41b8-aa01-eb3efa523286/M6e7fX9kg1.lottie"
              loop
              autoplay
              style={{ width: "500px", height: "500px" }}
            />
          </div>
        </motion.div>
        <motion.div
          className="fixed grid justify-center items-center min-w-48 bottom-20 right-5 font-roboto font-thin text-lg bg-opacity-60 bg-[#5c6548] text-white px-4 py-2 rounded-md"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
        >
          <AnimatePresence mode="wait">
            {showScrollIndicator ? (
              <motion.button
                key="register"
                onClick={handleGoToRegister}
                className="flex gap-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                Register & Login <BiDownArrow className="mt-1" />
              </motion.button>
            ) : (
              <motion.button
                key="top"
                onClick={handleGoToTop}
                className="flex gap-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                Go to Top <BiUpArrow className="mt-1" />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
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
