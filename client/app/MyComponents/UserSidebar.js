"use client";

import { TbLogout2 } from "react-icons/tb";
import { Providers } from "../Provider";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import EditUSer from "./EditUser";
import { FaHome, FaImage, FaPlay } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";
import GNavLink from "./GlobalNavlink";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Link from "next/link";
import MusicPlayer from "./MusicPlayer";
import BackgroundChanger from "./MessagePageComponents/BackgroundChanger";

export default function UserDataBar({setChangedBackground}) {
  const [editUser, setEditUser] = useState(false);
  const [openSpotify, setOpenSpotify] = useState(false);
  const [openBackground, setOpenBackground] = useState(false);
  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );
  const user = useSelector((state) => state?.user);

  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/logout`;
      const response = await axios({
        url: URL,
      });
      if (response) {
        dispatch(logout());
        console.log("vbvbvb", response);
        console.log("Logged out successfully");
        router.push("/register");
        sessionStorage.clear("email");
        sessionStorage.clear("name");
        sessionStorage.clear("profile_pic");
        localStorage.clear("token");
      }
    } catch (error) {
      toast("not working");
    }
  };

  const handleBackgroundChange = (e) => {
    setChangedBackground(e)
    setOpenBackground(!openBackground)
  }

  return (
    <>
      <Providers>
        <div className="mt-2  font-roboto font-light">
          <div className="w-full grid grid-rows-[5.65vh,70vh,10vh]">
            <div
              title={user?.name}
              className="flex border-b-2 border-gray-300 justify-center text-2xl"
            >
              <p className="mt-2">INFINTY CHAT</p>
            </div>
            <div className="flex items-center flex-col gap-8">
              <div className="mt-4 cursor-pointer  hover:text-primary">
                <GNavLink href="/" className="flex" title="Chat">
                  <FaHome size={25} />
                  <p className="ml-2 mt-1">Home</p>
                </GNavLink>
              </div>

              <div className="cursor-pointer mt-2  hover:text-primary">
                <button
                  onClick={() => setOpenSpotify(!openSpotify)}
                  className="flex gap-2"
                >
                  <FaPlay /> Play Music
                </button>
              </div>

              <div
                className={`gap-2 cursor-pointer p-1 hover:text-primary
                ${editUser ? "text-blue-400" : ""}`}
              >
                <button title={user?.name} onClick={() => setEditUser(true)}>
                  <p className="flex">
                    <MdModeEdit size={25} />
                    <span className="ml-2">Edit User</span>
                  </p>
                </button>
              </div>
              <div className="cursor-pointer hover:text-primary">
                <button title="Background" onClick={() => setOpenBackground(!openBackground)}>
                  <p className="flex gap-2"><FaImage size={20} />  Background</p>
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-8">
              <div className="flex justify-center items-center cursor-pointer mt-2 hover:text-primary">
                <button title="Logout" className="flex" onClick={handleLogout}>
                  <TbLogout2 size={25} />
                  <p className="ml-2 mt-1">Logout</p>
                </button>
              </div> 
              <div>
                <Link title="Support" href="/support">
                  <DotLottieReact
                    src="https://lottie.host/ecdba8d5-4f77-4b0c-acab-153e766d608a/5uxXC5ma8o.lottie"
                    loop
                    autoplay
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
        {editUser && (
          <EditUSer onClose={() => setEditUser(false)} user={user} />
        )}
        {openSpotify && (
          <div className="absolute w-fit h-fit z-20 right-1/3 top-1/3">
            <MusicPlayer />
          </div>
        )}
        {openBackground && (
          <BackgroundChanger setBackground={handleBackgroundChange} />
        )}
      </Providers>
    </>
  );
}
