"use client";


import { TbLogout2 } from "react-icons/tb";
import { Providers } from "../Provider";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import EditUSer from "./EditUser";
import { FaHome } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";
import GNavLink from "./GlobalNavlink";

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
        <div className="mt-2  font-roboto font-light">
          <div className="w-full flex flex-col">
            <div
              title={user?.name}
              className="flex justify-center text-2xl border-b-2 border-b-gray-200 p-2 pb-[13px]"
            >
              INFINTY CHAT
            </div>

            <GNavLink
              href="/"
              className="flex mt-4  justify-center items-center cursor-pointer hover:text-primary"
              title="Chat"
            >
              <FaHome size={25}  className="text-gray-600" /><p className="ml-2 mt-1" >Home</p>
            </GNavLink>

            <button
              title={user?.name}
              onClick={() => setEditUser(true)}
              className={`flex gap-2  justify-center items-center cursor-pointer p-1 hover:text-primary
                ${editUser ? "text-blue-400" : ""}`}

            >
              <p className="flex mt-1">
                <MdModeEdit size={25} className="text-gray-600" /><p className="ml-2 mt-1" >Edit User</p>
              </p>
            </button>

            <button
              title="Logout"
              className="flex justify-center items-center cursor-pointer mt-2 hover:text-primary"
              onClick={handleLogout}
            >
              <TbLogout2 size={25}  className="text-gray-600" /><p className="ml-2  mt-1 " >Logout</p>
            </button>
          </div>
        </div>
        {editUser && (
          <EditUSer onClose={() => setEditUser(false)} user={user} />
        )}
      </Providers>
    </>
  );
}