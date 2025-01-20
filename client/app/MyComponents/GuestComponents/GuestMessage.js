"use client";

import Image from "next/image";
import Link from "next/link";
import { MdOutlineArrowBackIosNew, MdSend } from "react-icons/md";
import EmojiPickerComponet from "../MessagePageComponents/EmojiPicker";
import { useEffect, useRef, useState } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { getSocket } from "@/lib/socket";
import {
  setOnlineUser,
  setSocketConnection,
  setUser,
} from "@/app/redux/userSlice";
import LoadingStyle from "../Loader";
import { Providers } from "@/app/Provider";
import axios from "axios";
import { toast } from "sonner";
import Avatar from "@/app/Components/helpers/Avatar";
import { AiOutlineUser } from "react-icons/ai";
import GuestBar from "./GuestBar";

export default function GroupMessage() {
  const [allMessages, setAllMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "" });
  const [count, setCount] = useState(0);
  const [showUser, setShowUser] = useState(null);
  const currentMessage = useRef();
  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );
  const user = useSelector((state) => state?.user);
  const [dataUser, setDataUser] = useState({
    _id: "",
    name: "",
    online: false,
  });
  const dispatch = useDispatch();

  const fetchUserDetails = async () => {
    try {
      const URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/guest-details`;
      const response = await axios({
        url: URL,
        withCredentials: true,
      });
      dispatch(setUser(response.data.data));
      if (response.data.logout) {
        dispatch(logout());
        router.push("/");
      }
    } catch (error) {
      toast.error("Error");
    }
  };

  useEffect(() => {
    fetchUserDetails();
  });

  useEffect(() => {
    const socket = getSocket();
    dispatch(setSocketConnection(socket));
    socket.emit("join-group", process.env.NEXT_PUBLIC_GROUP_ID);
    socket.on("guest-user", async (data) => {
      setDataUser(data);
      dispatch(setUser(data));
    });
    socket.on("group-message", (data) => {
      setAllMessages((prevMessages) => [...prevMessages, data]);
    });
    console.log("data");
    socket.on("group-participants", (data) => {
      dispatch(setUser(data));
      dispatch(setOnlineUser(data));
      setCount(data.length);
    });

    return () => {
      socket.off("group-message");
      socket.off("group-participants");
    };
  }, [dispatch, socketConnection]);

  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [allMessages]);
  const handleSendMessage = (e) => {
    e.preventDefault();
    console.log("Sending message with:", {
      groupId: process.env.NEXT_PUBLIC_GROUP_ID,
      senderId: user?._id,
      senderName: user?.name,
      text: message.text,
    });
    if (message.text && socketConnection) {
      socketConnection.emit("send-group-message", {
        groupId: process.env.NEXT_PUBLIC_GROUP_ID,
        senderId: user._id,
        senderName: user.name,
        text: message.text,
      });
      setMessage({ text: "" });
    }
  };

  const handleOnChange = (e) => {
    const { value } = e.target;
    setMessage({ text: value });
  };

  const handleShowUser = (index) => {
    setShowUser((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <>
      <Providers>
        <section>
          <header className="sticky h-16 bg-[rgba(66,89,67,1)] grid grid-cols-[800px,2fr] items-center px-3">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="lg:hidden flex justify-center items-center"
              >
                <MdOutlineArrowBackIosNew size={16} />
              </Link>
              <div className="w-24 flex justify-center">
                <Image src="/logo.svg" width={60} height={60} alt="Logo" />
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-lg text-white">Group Chat</h3>
                <p className="text-sm text-gray-300">{count} participants</p>
              </div>
            </div>
          </header>
        </section>
        <section className="h-[calc(100vh-128px)] grid grid-cols-[1fr,220px] overflow-x-hidden overflow-y-scroll relative bg-slate-300 bg-opacity-40">
          <div className="flex relative flex-col " ref={currentMessage}>
            {allMessages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 bg-green-400 flex  gap-2 w-full border-b-[1px] border-b-green-600`}
              >
                <button onClick={() => handleShowUser(index)} className="cursor-pointer">
                  <Avatar name={msg.senderName} height={40} width={40} />
                </button>
                <div>
                  <div className="flex">
                    <AiOutlineUser size={15} />
                    <p className="text-xs font-semibold">{msg.senderName}</p>
                    {showUser === index && (
                  <div className="flex absolute ml-12 rounded-xl h-40 w-40 bg-white text-black flex-col justify-center items-center">
                    <Avatar name={user.name} height={30} width={30} />
                    <p>{msg.senderName}</p>
                    <p>{msg.gender}</p>
                    <p>{msg.age}</p>
                  </div>
                )}
                  </div>
                  <p>{msg.message}</p>
                </div>
                <p className="text-xs ml-auto">
                  {moment(msg.createdAt).format("hh:mm A")}
                </p>
              </div>
            ))}

            {loading && (
              <div className="w-full h-full sticky bottom-0 flex justify-center items-center">
                <LoadingStyle bg="bg-slate-300" />
              </div>
            )}
          </div>
          <div >
            <GuestBar />
          </div>
        </section>
        <section className="h-16 bg-white flex items-center px-1 border-t-[1px] border-t-slate-300">
          <div className="flex justify-center items-center mt-2 rounded-full hover:bg-primary hover:text-white h-10 w-10">
            <EmojiPickerComponet />
          </div>
          <form className="h-full w-full flex" onSubmit={handleSendMessage}>
            <input
              type="text"
              placeholder="Type your message..."
              className="py-1 px-4 outline-none w-full h-full"
              value={message.text}
              onChange={handleOnChange}
            />
            <button className="h-10 w-10 mt-3 flex justify-center items-center rounded-full hover:bg-primary hover:text-white">
              <MdSend size={25} />
            </button>
          </form>
        </section>
      </Providers>
    </>
  );
}
