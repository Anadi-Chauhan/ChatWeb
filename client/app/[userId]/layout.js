"use client";

import { IoIosNotificationsOutline } from "react-icons/io";
import HomeComponent from "../MyComponents/HomeComponent";
import UserDataBar from "../MyComponents/userDataBar";
import { Providers } from "../Provider";
import Avatar from "../Components/helpers/Avatar";
import SearchUser from "../MyComponents/SearchUser";
import UserSideBaar from "../MyComponents/UserSidebar";
import { useState } from "react";

export default function Layout({ children }) {
  const [openUserData, setOpenUserData] = useState();
  return (
    <>
      <Providers>
        <div className="h-screen grid grid-cols-[200px,2fr] bg-gray-200">
          <div className="bg-white border-r-2 border-gray-200">
            <UserSideBaar />
          </div>
          <div className=" grid grid-rows-[6.5vh,92.7vh]">
            <div className="bg-white flex justify-between p-6 items-center">
              <div>
                <SearchUser />{" "}
              </div>
              <div className="flex justify-between items-center gap-6 p-4">
                <div className="relative" >
                  <IoIosNotificationsOutline size={25} className="cursor-pointer text-gray-600 hover:text-gray-800" />
                </div>
                <div className="relative" >
                  <button
                    onClick={() => setOpenUserData(true)}
                    onDoubleClick={() => setOpenUserData(false)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Avatar
                      width={25}
                      height={25}
                      name="Anadi"
                    />
                  </button>
                  {openUserData && (                    
                      <UserDataBar />
                  )}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-[300px,1fr] gap-4 justify-center items-center p-4 mb-3 overflow-hidden">
              <div className="h-full overflow-hidden rounded-lg">
                <HomeComponent />
              </div>
              <div className="h-full rounded-lg ">
                <div className="h-full overflow-hidden rounded-lg">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Providers>
    </>
  );
}
