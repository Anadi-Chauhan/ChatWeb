"use client";

import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa";
import { TbLogout2 } from "react-icons/tb";
import NavLink from "./NavLink";
import Avatar from "../Components/helpers/Avatar";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import EditUSer from "./EditUser";
import { FiArrowUpLeft } from "react-icons/fi";
import { FaVideo } from "react-icons/fa6";
import { FaImage } from "react-icons/fa6";
import SearchUser from "./SearchUser";
import Link from "next/link";
import { logout } from "../redux/userSlice";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Providers } from "../Provider";
import { AiFillHome } from "react-icons/ai";
import { toast } from "sonner";

export default function SideBar() {
  const [editUser, setEditUser] = useState(false);
  const [openSearchUser, setOpenSearchUser] = useState(false);
  const [allUser, setAllUser] = useState([]);
  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );
  const user = useSelector((state) => state?.user);
  const dispatch = useDispatch();
  const router = useRouter();

  console.log('sssss',user?.socketConnection)
  console.log("nnnnn", user);

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
      toast('not working')
    }
  };

  useEffect(() => {
    if (socketConnection) {
      console.log("i am connected");
      socketConnection.emit("sidebar", user?._id);
      console.log("i am ", user?._id);
      socketConnection.on("conversation", (data) => {
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
        <div className="w-full h-screen grid grid-cols-[48px,1fr] ">
          <div className="bg-[rgba(66,89,67,1)]  py-5 w-12 h-full text-white flex flex-col justify-between ">
            <div>
              <NavLink
                href="/"
                className="w-12 h-12 flex justify-center items-center mb-3 cursor-pointer hover:bg-[#263827] rounded"
                title="chat"
              >
                <IoChatbubbleEllipsesSharp size={28} />
              </NavLink>
              <div
                className="w-12 h-12 flex justify-center items-center mb-3 cursor-pointer hover:bg-[#263827] rounded"
                title="Add User"
                onClick={() => setOpenSearchUser(true)}
              >
                <FaUserPlus size={28} />
              </div>
              <Link
                href="/room"
                className="w-12 h-12 flex justify-center items-center mb-3 cursor-pointer hover:bg-[#263827] rounded"
                title="Room List"
                onClick={() => setOpenSearchUser(true)}
              >
                <AiFillHome size={26} className="mr-1" />
              </Link>
            </div>
            <div className="flex flex-col items-center">
              <button
                className="mx-auto"
                title={user?.name}
                onClick={() => setEditUser(true)}
              >
                <Avatar
                  width={40}
                  height={40}
                  name={user?.name}
                  imageUrl={user?.profile_pic}
                  userId={user?._id}
                />
              </button>
              <button
                title="logout"
                className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-[#263827] rounded"
                onClick={handleLogout}
              >
                <span className="mr-2">
                  <TbLogout2 size={29} />
                </span>
              </button>
            </div>
          </div>
          <div className="w-full border-r-2 border-r-[rgba(66,89,67,1)]">
            <div className="h-16 flex items-center bg-[#c3cfc4] ">
              <h2 className="text-2xl font-bold font-roboto p-4  text-black">
                Messages
              </h2>
            </div>
            <div className="bg-slate-200 p-[0.5px]"></div>
            <div className=" bg-white h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-slate-10">
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
                return (
                  <Link
                    href={"/" + conv?.userDetails?._id}
                    key={conv?._id}
                    className="flex items-center gap-2 py-3 px-2  border border-transparent border-b-slate-200 shadow-md rounded hover:bg-slate-100 hover:border-primary cursor-pointer"
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
                      <h3 className="text-ellipsis line-clamp-1 text-base font-semibold">
                        {conv?.userDetails?.name}
                      </h3>
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
          {editUser && (
            <EditUSer onClose={() => setEditUser(false)} user={user} />
          )}
          {openSearchUser && (
            <SearchUser onClose={() => setOpenSearchUser(false)} />
          )}
        </div>
      </Providers>
    </>
  );
}
