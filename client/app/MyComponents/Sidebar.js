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

export default function SideBar() {
  const user = useSelector((state) => state?.user);
  const [editUser, setEditUser] = useState(false);
  const [openSearchUser, setOpenSearchUser] = useState(false);
  const [allUser, setAllUser] = useState([]);
  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );
  const dispatch = useDispatch()
  const router = useRouter()

  const handleLogout = ()=>{
    dispatch(logout())
    router.push("/check-email")
  }

  useEffect(() => {
    if (socketConnection && user._id) {
      console.log('i am connected')
      socketConnection.emit("sidebar", user?._id);
      console.log('i am ',user?._id)
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
      <div className="w-full h-screen grid grid-cols-[48px,1fr] ">
        <div className="bg-slate-200 rounded-tr-lg rounded-br-lg py-5 w-12 h-full text-slate-700 flex flex-col justify-between ">
          <div>
            <NavLink
              href="/"
              className="w-12 h-12 flex justify-center items-center mb-3 cursor-pointer hover:bg-slate-300 rounded"
              title="chat"
            >
              <IoChatbubbleEllipsesSharp size={28} />
            </NavLink>
            <div
              className="w-12 h-12 flex justify-center items-center mb-3 cursor-pointer hover:bg-slate-300 rounded"
              title="add user"
              onClick={() => setOpenSearchUser(true)}
            >
              <FaUserPlus size={28} />
            </div>
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
              className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-300 rounded"
              onClick={handleLogout}
            >
              <span className="mr-2">
                <TbLogout2 size={29} />
              </span>
            </button>
          </div>
        </div>
        <div className="w-full">
          <div className="h-16 flex items-center ">
            <h2 className="text-xl font-bold p-4 text-slate-800">Messages</h2>
          </div>
          <div className="bg-slate-200 p-[0.5px]"></div>
          <div className="h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-slate-10">
            {allUser.length === 0 && (
              <div className="mt-14">
                <div className="flex justify-center items-center my-3 text-slate-600">
                  <FiArrowUpLeft size={50} />
                </div>
                <p className="text-lg text-slate-500 text-center">
                  Explore users to start a conversation with.
                </p>
              </div>
            )}
            {allUser.map((conv, index) => {
              return (
                <Link href={"/" + conv?.userDetails?._id} key={conv?._id} className="flex items-center gap-2 py-3 px-2  border border-transparent border-b-slate-200 shadow-md rounded hover:bg-slate-100 hover:border-primary cursor-pointer">
                  <div>
                    <Avatar
                      imageUrl={conv?.userDetails?.profile_pic}
                      name={conv?.userDetails?.name}
                      height={40}
                      width={40}
                    />
                  </div>
                  <div>
                    <h3 className="text-ellipsis line-clamp-1 text-base font-semibold" >{conv?.userDetails?.name}</h3>
                    <div className="text-slate-500 text-xs flex items-center gap-1 " >
                      <div className="flex items-center gap-1">
                        {
                          conv?.lastMsg?.imageUrl && (
                            <div className="flex items-center gap-1">
                              <span><FaImage /></span>
                              {!conv?.lastMsg?.text && <span>Image</span>}
                            </div>
                          )
                        }
                        {
                          conv?.lastMsg?.videoUrl && (
                            <div className="flex items-center gap-1">
                              <span><FaVideo /></span>
                              {!conv?.lastMsg?.text && <span>Video</span> }
                            </div>
                          )
                        }
                      </div>
                      <p className="line-clamp-1" >
                        {conv?.lastMsg?.text}
                      </p>
                    </div>
                  </div>
                  {
                    Boolean(conv?.unseenMessage) &&
                    <p className="text-xs bg-primary rounded-full text-white font-semibold p-1 ml-auto w-5 h-5 flex items-center justify-center " >{conv?.unseenMessage}</p>
                  }
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
    </>
  );
}
