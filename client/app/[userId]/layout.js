"use client";

import { IoIosNotificationsOutline } from "react-icons/io";
import HomeComponent from "../MyComponents/HomeComponent";
import UserDataBar from "../MyComponents/userDataBar";
import { Providers } from "../Provider";
import Avatar from "../Components/helpers/Avatar";
import SearchUser from "../MyComponents/SearchUser";
import UserSideBaar from "../MyComponents/UserSidebar";
import { use, useState } from "react";
import { useParams } from "react-router-dom";

export default function Layout({ children }) {
  const [showMessage,setShowMessage] = useState(false)
  const params = useParams()
  const [openUserData, setOpenUserData] = useState();
  const isValidHex = (str) => /^[a-fA-F0-9]{24}$/.test(str);{
    if (isValidHex(params.userId)) {
      setShowMessage(true)
    }
  }
  return (
    <>
      <Providers>
        <div className="h-screen grid grid-cols-1 md:grid-cols-[200px,1fr] bg-gray-200">
          {/* Sidebar - Hidden on small and medium screens */}
          <div className="bg-white border-r-2 border-gray-200 hidden md:block">
            <UserSideBaar />
          </div>
          {/* Main Content */}
          <div className="grid grid-rows-[6.5vh,92.7vh]">
            {/* Header */}
            <div className="bg-white flex justify-between p-1 lg:p-6 md:p-6  items-center">
              <div className="ml-2" >
                <SearchUser />
              </div>
              <div className="flex mr-10 justify-between items-center gap-6 p-1 lg:p-4 sm:p-2">
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

            {/* Content Area */}
            <div className="grid grid-cols-1 md:grid-cols-[300px,1fr] gap-4 justify-center items-center p-4 mb-3 overflow-hidden">
              {/* Home Component */}
              <div className={`h-full overflow-hidden rounded-lg
                ${showMessage ? "hidden max-[390px]:hidden" : "block max-[390px]:block" }`}>
                <HomeComponent />
              </div>
              {/* Children */}
              <div className={`h-full overflow-hidden rounded-lg flex max-[390px]:hidden 
                ${showMessage ? "hidden max-[390px]:block" : "block max-[390px]:hidden" }`}>
                {children}
              </div>
            </div>
          </div>
        </div>
      </Providers>
    </>
  );
}
