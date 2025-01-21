"use client";

import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import NavLink from "./NavLink";
import { FaUserPlus } from "react-icons/fa6";
import Link from "next/link";
import { AiFillHome } from "react-icons/ai";
import Avatar from "../Components/helpers/Avatar";
import { TbLogout2 } from "react-icons/tb";
import { Providers } from "../Provider";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import SearchUser from "./SearchUser";
import EditUSer from "./EditUser";
import { FaHome } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";

export default function UserDataBar() {
  const [editUser, setEditUser] = useState(false);
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

  return (
    <>
      <Providers>
        <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-lg p-1 border-2 border-slate-500  z-10">
          <div className="w-full flex flex-col">
            <button
              title={user?.name}
              onClick={() => setEditUser(true)}
              className="flex gap-2 cursor-pointer mt-2 p-1"
            >
              <Avatar
                width={40}
                height={40}
                name={user?.name}
                imageUrl={user?.profile_pic}
                userId={user?._id}
              />
              <p className="font-bold flex justify-center items-center mt-1">
                {user?.name}
              </p>
            </button>

            <button
              title={user?.name}
              onClick={() => setEditUser(true)}
              className="flex gap-2 cursor-pointer p-1"
            >
              <p className="font-bold flex mt-1">
                <MdModeEdit size={25} /><p className="font-bold ml-2 mt-1" >Edit User</p>
              </p>
            </button>

            <button
              title="Logout"
              className="flex cursor-pointer ml-2 mt-2"
              onClick={handleLogout}
            >
              <TbLogout2 size={29} /><p className="font-bold ml-2 mt-1" >Logout</p>
            </button>

            <NavLink
              href="/"
              className="flex ml-4 mt-2 cursor-pointer"
              title="Chat"
            >
              <FaHome size={28} /><p className="font-bold ml-2 mt-1" >Home</p>
            </NavLink>


          </div>
        </div>
        {editUser && (
          <EditUSer onClose={() => setEditUser(false)} user={user} />
        )}
      </Providers>
    </>
  );
}
