"use client";

import { IoIosNotificationsOutline } from "react-icons/io";
import UserDataBar from "../MyComponents/userDataBar";
import { Providers } from "../Provider";
import Avatar from "../Components/helpers/Avatar";
import SearchUser from "../MyComponents/SearchUser";
import UserSideBaar from "../MyComponents/UserSidebar";
import { useState } from "react";
import Image from "next/image";
import { useParams } from "react-router-dom";
import SideBar from "../MyComponents/Sidebar";
import MusicPlayer from "../MyComponents/MusicPlayer";
import { FaPlay } from "react-icons/fa6";

export default function Layout({ children }) {
  const [showMessage, setShowMessage] = useState(false);
  const params = useParams();
  const [openUserData, setOpenUserData] = useState();
  const [openSpotify, setOpenSpotify] = useState(false);
  const isValidHex = (str) => /^[a-fA-F0-9]{24}$/.test(str);
  {
    if (isValidHex(params.userId)) {
      setShowMessage(true);
    }
  }
  return (
    <>
      <Providers>
        <div className="h-screen grid grid-cols-1 md:grid-cols-[200px,1fr] bg-gray-200">
          <div className="bg-white border-r-2 border-gray-200 hidden md:block">
            <UserSideBaar />
            <div className="flex mt-10 ml-3" >
              <p className="flex justify-center items-center font-semibold" >Play Music</p>
              <button
                onClick={() => setOpenSpotify(!openSpotify)}
                style={{
                  marginLeft: "10px",
                  backgroundColor: "black",
                  color: "#fff",
                  padding: "10px 10px",
                  border: "none",
                  borderRadius: "35px",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
                className="relative"
              >
                {" "}
                <FaPlay />
              </button>
            </div>
          </div>
          <div className="grid grid-rows-[6.5vh,93.6vh]">
            <div className="bg-white border-b-2 border-gray-300 flex justify-stretch p-1 lg:p-6 md:p-6  items-center">
              <Image src="./logo.svg" width={60} height={60} alt="Logo" />
              <div className="ml-12">
                <SearchUser />
              </div>
              <div className="flex mr-10 justify-between ml-auto items-center gap-6 p-1 lg:p-4 sm:p-2">
                {/* Notification Bell */}
                <div className="relative hidden sm:block">
                  {" "}
                  {/* Hidden on smaller screens */}
                  <IoIosNotificationsOutline
                    size={25}
                    className="cursor-pointer text-gray-600 hover:text-gray-800"
                  />
                </div>
                <div className="relative ">
                  <button
                    onClick={() => setOpenUserData(!openUserData)}
                    className=" cursor-pointer"
                  >
                    <Avatar width={25} height={25} name="Anadi" />
                  </button>
                  {openUserData && <UserDataBar />}
                </div>
              </div>
            </div>
            <div className="relative grid grid-cols-1 md:grid-cols-[300px,1fr] justify-center items-center overflow-hidden">
              <div className="absolute w-fit h-fit z-20 right-1/3">
                <MusicPlayer openSpotify={openSpotify} />
              </div>
              <div
                className={`h-full overflow-hidden
                ${
                  showMessage
                    ? "hidden max-[390px]:hidden"
                    : "block max-[390px]:block"
                }`}
              >
                <SideBar />
              </div>
              <div
                className={`h-full overflow-hidden flex max-[390px]:hidden 
                ${
                  showMessage
                    ? "hidden max-[390px]:block"
                    : "block max-[390px]:hidden"
                }`}
              >
                {children}
              </div>
            </div>
          </div>
        </div>
      </Providers>
    </>
  );
}
