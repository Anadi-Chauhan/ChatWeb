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
import { RiEditLine, RiSeparator } from "react-icons/ri";

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
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg p-1 border-2 border-gray-900 z-10">
          <div className="w-full flex flex-col">
            {/* User Avatar */}
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
              <p className="font-bold flex justify-center items-center mt-3">
                {user?.name}
              </p>
            </button>

            <RiSeparator size={50} />

            {/* Chat Icon */}
            <NavLink
              href="/"
              className="flex justify-center items-center mb-2 cursor-pointer"
              title="Chat"
            >
              <IoChatbubbleEllipsesSharp size={28} />
            </NavLink>

            {/* Logout Button */}
            <button
              title="Logout"
              className="flex justify-center items-center cursor-pointer"
              onClick={handleLogout}
            >
              <TbLogout2 size={29} />
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

{
  /* <Link
                href="/room"
                className="flex justify-center items-center mb-3 cursor-pointer"
                title="Room List"
                onClick={() => setOpenSearchUser(true)}
              >
                <AiFillHome size={26} className="mr-1" />
              </Link> */
}
// {openSearchUser && (
//   <SearchUser onClose={() => setOpenSearchUser(false)} />
// )}
