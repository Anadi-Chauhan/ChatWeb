"use client";

import { FaUserPlus } from "react-icons/fa";
import Avatar from "../Components/helpers/Avatar";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { FiArrowUpLeft } from "react-icons/fi";
import { FaVideo, FaImage } from "react-icons/fa6";
import Link from "next/link";
import { Providers } from "../Provider";
import moment from "moment";
import { CiSearch } from "react-icons/ci";
import { SeparatorHorizontal } from "lucide-react";
import NavLink from "./NavLink";

export default function SideBar() {
  const [allUser, setAllUser] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );
  const user = useSelector((state) => state?.user);

  useEffect(() => {
    const cachedConversations =
      JSON.parse(localStorage.getItem("conversations")) || [];
    setAllUser(cachedConversations);
    if (socketConnection) {
      socketConnection.emit("sidebar", user?._id);
      socketConnection?.on("conversation", (data) => {
        console.log("conversation", data);
        const conversationUserData = data.map((conversationUser) => {
          if (
            conversationUser?.sender?._id === conversationUser?.reciever?._id
          ) {
            return {
              ...conversationUser,
              userDetails: conversationUser?.sender,
            };
          } else if (conversationUser?.reciever?._id !== user?._id) {
            return {
              ...conversationUser,
              userDetails: conversationUser?.reciever,
            };
          } else {
            return {
              ...conversationUser,
              userDetails: conversationUser?.sender,
            };
          }
        });
        setAllUser(conversationUserData);
        localStorage.setItem(
          "conversations",
          JSON.stringify(conversationUserData)
        );
      });
    }
  }, [socketConnection, user]);

  useEffect(() => {
    setFilteredUsers(allUser);
  }, [allUser]);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredUsers(allUser);
    } else {
      const results = allUser.filter((user) =>
        user?.userDetails?.name?.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredUsers(results);
    }
  }, [search, allUser]);

  return (
    <>
      <Providers>
        <div className="w-full h-screen bg-gray-50">
          <div className="w-full">
            <div className="h-16 bg-white flex flex-col justify-center items-start px-4">
              <div className="text-xl sm:text-2xl ont-bold font-roboto mt-4 text-black">
                Message
                <p className="text-xs sm:text-sm font-roboto font-normal text-slate-500">
                  {moment().format("dddd")},{moment().format(" Do MMMM, YYYY")}
                </p>
              </div>
            </div>

            <div className="bg-white h-[calc(100vh-4rem)] px-2 py-4 overflow-y-auto scrollbar-none">
              {/* Search Bar */}
              <div className="flex justify-center items-center mt-4 mx-1 sm:mx-4 h-5 sm:h-12 bg-gray-100 rounded-2xl">
                <div className="ml-3 w-8 flex justify-center items-center">
                  <CiSearch size={20} className="sm:text-lg" />
                </div>
                <input
                  type="text"
                  placeholder="Search now..."
                  className="flex-1 outline-none bg-gray-100 rounded-3xl px-2 text-sm sm:text-base"
                  onChange={(e) => setSearch(e.target.value)} // Triggers `useEffect`
                  value={search}
                />
                <p className="mr-5 text-xs sm:text-sm text-gray-600">/F</p>
              </div>

              {/* No Users Message */}
              {allUser.length === 0 && (
                <div className="mt-12 sm:mt-14">
                  <div className="flex justify-center items-center my-3 text-slate-600">
                    <FiArrowUpLeft size={40} className="sm:text-5xl" />
                  </div>
                  <div className="text-sm sm:text-lg text-slate-500 text-center">
                    Explore users to start a conversation with.
                    <p className="flex gap-2 justify-center mt-2 text-slate-500">
                      Use{" "}
                      <FaUserPlus
                        size={20}
                        className="sm:text-2xl text-slate-600"
                      />{" "}
                      to add users
                    </p>
                  </div>
                </div>
              )}

              {/* User Conversations */}
              {filteredUsers.map((conv) => {
                const createdAt = conv?.lastMsg?.createdAt;
                const messageDate = moment(createdAt);

                return (
                  <NavLink
                    href={"/" + conv?.userDetails?._id}
                    key={conv?._id}
                    className="flex items-center mt-3 sm:mt-[6px] gap-2 sm:gap-3 py-3 px-2 rounded hover:bg-slate-100 border-b-2 border-b-gray-200 cursor-pointer"
                  >
                    <Avatar
                      imageUrl={conv?.userDetails?.profile_pic}
                      name={conv?.userDetails?.name}
                      height={35}
                      width={35}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between text-sm sm:text-base">
                        <span className="font-semibold truncate">
                          {conv?.userDetails?.name}
                        </span>
                        <span className="text-xs sm:text-sm text-gray-500">
                          {messageDate.isSame(moment(), "day")
                            ? messageDate.format("hh:mm A")
                            : messageDate.format("DD/MM/YY")}
                        </span>
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500 flex items-center gap-1 truncate">
                        {conv?.lastMsg?.imageUrl && (
                          <span className="flex items-center gap-1">
                            <FaImage />
                            {!conv?.lastMsg?.text && <span>Image</span>}
                          </span>
                        )}
                        {conv?.lastMsg?.videoUrl && (
                          <span className="flex items-center gap-1">
                            <FaVideo />
                            {!conv?.lastMsg?.text && <span>Video</span>}
                          </span>
                        )}
                        <span>{conv?.lastMsg?.text}</span>
                      </div>
                    </div>
                    {Boolean(conv?.unseenMessage) && (
                      <p className="text-xs sm:text-sm bg-primary rounded-full text-white font-semibold px-2 py-1">
                        {conv?.unseenMessage}
                      </p>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        </div>
      </Providers>
    </>
  );
}
