"use client";

import { FaUserPlus } from "react-icons/fa";
import Avatar from "../Components/helpers/Avatar";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { FiArrowUpLeft } from "react-icons/fi";
import { FaVideo } from "react-icons/fa6";
import { FaImage } from "react-icons/fa6";
import Link from "next/link";
import { Providers } from "../Provider";
import moment from "moment";
import { CiSearch } from "react-icons/ci";

export default function SideBar() {
  const [allUser, setAllUser] = useState([]);
  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );
  const user = useSelector((state) => state?.user);

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("sidebar", user?._id);
      socketConnection?.on("conversation", (data) => {
        console.log("conversation", data);
        const conversationUserData = data.map((conversationUser, index) => {
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
      });
    }
  }, [socketConnection, user]);

  return (
    <>
      <Providers>
        <div className="w-full h-screen">
          <div className="w-full">
            <div className="h-16 items-center bg-white ">
              <div className="text-2xl font-bold font-roboto p-4  text-black">
                Message
                <p className="text-sm mt-1 font-roboto font-normal text-slate-500">
                  {moment().format("dddd")},{moment().format(" Do MMMM, YYYY")}
                </p>
              </div>
            </div>
            <div className=" bg-white h-[calc(94.5vh-65px)] py-4 px-2 overflow-x-hidden overflow-y-auto scrollbar-none">
              <div className="flex justify-center items-center mt-4 ml-4 h-8 w-64 bg-gray-100 rounded-3xl">
                <div className="h-12 w-12 flex justify-center items-center ">
                  <CiSearch size={23} />
                </div>
                <input
                  type="text"
                  placeholder="Search now..."
                  className="w-full outline-none p-1 h-full bg-gray-100 rounded-3xl z-20 px-4 "
                  // onChange={(e) => setSearch(e.target.value)}
                  // value={search}
                  // onFocus={() => setOpenModel(true)}
                />
                <p className="mr-3 text-gray-600">/F</p>
              </div>
              {allUser.length === 0 && (
                <div className="mt-14">
                  <div className="flex justify-center items-center my-3 text-slate-600">
                    <FiArrowUpLeft size={50} />
                  </div>
                  <div className="text-lg text-slate-500 text-center">
                    Explore users to start a conversation with.
                    <p className="flex gap-2 justify-center mt-2 text-slate-500">
                      Use <FaUserPlus size={25} className="text-slate-600" /> to
                      add users
                    </p>
                  </div>
                </div>
              )}
              {allUser.map((conv, index) => {
                const createdAt = conv?.lastMsg?.createdAt;
                const messageDate = moment(createdAt);
                return (
                  <Link
                    href={"/" + conv?.userDetails?._id}
                    key={conv?._id}
                    className="flex items-center mt-[6px] gap-3 py-3 px-2 rounded hover:bg-slate-100 hover:border-primary cursor-pointer"
                  >
                    <div>
                      <Avatar
                        imageUrl={conv?.userDetails?.profile_pic}
                        name={conv?.userDetails?.name}
                        height={40}
                        width={40}
                      />
                    </div>
                    <div>
                      <div className="flex">
                        <div className="text-ellipsis w-40 text-sm flex font-semibold line-clamp-1" >{conv?.userDetails?.name}</div>
                        <div className="text-xs">
                        {messageDate.isSame(moment(), 'day') ? messageDate.format('hh:mm A') : messageDate.format('DD/MM/YY') }
                        </div>
                      </div>
                      <div className="text-slate-500 text-xs flex items-center gap-1 ">
                        <div className="flex items-center gap-1">
                          {conv?.lastMsg?.imageUrl && (
                            <div className="flex items-center gap-1">
                              <span>
                                <FaImage />
                              </span>
                              {!conv?.lastMsg?.text && <span>Image</span>}
                            </div>
                          )}
                          {conv?.lastMsg?.videoUrl && (
                            <div className="flex items-center gap-1">
                              <span>
                                <FaVideo />
                              </span>
                              {!conv?.lastMsg?.text && <span>Video</span>}
                            </div>
                          )}
                        </div>
                        <p className="line-clamp-1">{conv?.lastMsg?.text}</p>
                      </div>
                    </div>
                    {Boolean(conv?.unseenMessage) && (
                      <p className="text-xs bg-primary rounded-full text-white font-semibold p-1 ml-auto w-5 h-5 flex items-center justify-center ">
                        {conv?.unseenMessage}
                      </p>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </Providers>
    </>
  );
}
