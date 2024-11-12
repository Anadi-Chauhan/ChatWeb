"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, setOnlineUser, setSocketConnection, setUser } from "./redux/userSlice";
import { getSocket } from "@/lib/socket";

export default function Home() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();

  console.log("Redux user:", user);

  const fetchUserDetails = async () => {
    try {
      const URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user-details`;
      const response = await axios({
        url: URL,
        withCredentials: true,
      });

      dispatch(setUser(response.data.data));

      if (response.data.logout) {
        dispatch(logout());
        router.push("/check-email");
      }

      console.log("Current user details", response);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  // Socket connection
  useEffect(() => {
    const socket = getSocket(); // Get the singleton socket instance

    socket.on("onlineUser", (data) => {
        console.log("Online users:", data);
        dispatch(setOnlineUser(data));
    });

    dispatch(setSocketConnection(socket));

    return () => {
        socket.off("onlineUser");
    };
}, []);

  return (
    <main>
      <div className="lg:flex justify-center items-center flex-col gap-1 mt-56 hidden">
        <div>
          <img src="logo.svg" width={250} alt="logo" />
        </div>
        <p className="text-2xl mt-1/2 text-slate-600">Select User to send message</p>
      </div>
    </main>
  );
}
