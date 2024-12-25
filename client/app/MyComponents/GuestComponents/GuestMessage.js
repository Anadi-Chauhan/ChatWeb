"use client";

import Avatar from "@/app/Components/helpers/Avatar";
import Image from "next/image";
import Link from "next/link";
import { BiDotsVertical } from "react-icons/bi";
import { MdOutlineArrowBackIosNew, MdSend } from "react-icons/md";
import GNavLink from "../GlobalNavlink";
import IVSender from "../MessagePageComponents/IVSender";
import BackgroundChanger from "../MessagePageComponents/BackgroundChange";
import EmojiPickerComponet from "../MessagePageComponents/EmojiPicker";
import { useEffect, useRef, useState } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { getSocket } from "@/lib/socket";
import { logout, setOnlineUser, setSocketConnection, setUser } from "@/app/redux/userSlice";
import LoadingStyle from "../Loader";
import { useRouter } from "next/navigation";

export default function GuestMessage() {



  const [allMessage, setAllMessage] = useState([]);
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
  const [message, setMessage] = useState({
    text: "",
  });
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const socket = getSocket();
    socket.on("onlineUser", (data) => {
      console.log("USerData", data);
      dispatch(setOnlineUser(data));
    });
    dispatch(setSocketConnection(socket));

    return () => {
      socket.off("onlineUser");
    };
  }, []);

  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [allMessage]);

  useEffect(()=>{
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({
        behavior: "smooth",
        block: "end"
      });
    }
  },[allMessage])

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.text) {
      if (socketConnection) {
        socketConnection.emit("new-message", {
          sender: user?._id,
          reciever: process.env.NEXT_PUBLIC_GLOBAL_RECIEVER,
          text: message.text,
          msgByUserId: user?._id,
          recievedByUserId: process.env.NEXT_PUBLIC_GLOBAL_RECIEVER,
        });
        setMessage({
          text: "",
        });
      }
    }
  };
  const fetchUserDetails = async () => {
    try {
      const URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user-details`;
      const response = await axios({
        url: URL,
        withCredentials: true,
      });

      console.log("MNP", response.data.data);

      dispatch(setUser(response.data.data));

      if (response.data.logout) {
        dispatch(logout());
        router.push("/");
      }

      console.log("Current user details", response);
      console.log("Redux user:", user);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setMessage((prev) => {
      return {
        ...prev,
        text: value,
      };
    });
  };

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("message-page", process.env.NEXT_PUBLIC_GLOBAL_RECIEVER);
      socketConnection.on("message-user", (data) => {
        setDataUser(data);
      });

      socketConnection.on("message", (data) => {
        console.log("XXXX", data);
        const latestMessageSender = data[data.length - 1]?.msgByUserId;
        console.log("YYYYY", latestMessageSender);
        setAllMessage(data);
      });
    }
    // const isValidHex = (str) => /^[a-fA-F0-9]{24}$/.test(str);
    // if (isValidHex(params.userId)) {
      // setShowComponent(true);
    // }
  }, [socketConnection, user]);

  return (
    <>
      {/* Message Header */}
      <section>
        <header className="sticky h-16 bg-[rgba(66,89,67,1)] grid grid-cols-[800px,2fr] items-center px-3">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className=" lg:hidden flex justify-center items-center"
            >
              <MdOutlineArrowBackIosNew size={16} />
            </Link>
            <div className="w-24 flex justify-center">
              <Image src="/logo.svg" width={60} height={60} />
            </div>
            <div className="flex items-center justify-center ml-4">
              <Avatar width={30} height={30} />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-white my-0 mt-1">
                Anadi
              </h3>
            </div>
          </div>
          <div>
            <div className="h-10 text-sm font-roboto font-semibold p-2 ">
              <div>
                <ul className="text-gray-200 flex gap-10 justify-end mr-10 ">
                  <li className="hover:text-white hover:underline">
                    <GNavLink href="/room">Guest Room</GNavLink>
                  </li>
                  <li className="hover:text-white hover:underline">
                    <GNavLink href="/register">Logout</GNavLink>
                  </li>
                  <li className="hover:text-white hover:underline">
                    <GNavLink href="/support">Support</GNavLink>
                  </li>
                  <li className="hover:text-white hover:underline flex justify-center items-center">
                    <GNavLink href="/support">
                      <BiDotsVertical size={20} />
                    </GNavLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </header>
      </section>
      {/* Message Body */}
      <section className="h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll relative bg-slate-950 bg-opacity-40">
        <div className="flex h-full flex-col py-2 mx-2" ref={currentMessage}>
          {allMessage.map((msg, index) => {
            return (
              <div
                key={msg._id}
                className={`p-1 py-2 rounded w-fit ${
                  user._id === msg.msgByUserId
                    ? "ml-auto bg-teal-200"
                    : "bg-yellow-100"
                }`}
              >
                <p className="px-2">{msg.text}</p>
                <p className="text-xs ml-auto w-fit">
                  {moment(msg.createdAt).format("hh:mm")}
                </p>
              </div>
            );
          })}
          {loading && (
              <div className="w-full h-full  sticky bottom-0 flex justify-center items-center">
                <LoadingStyle bg="bg-slate-300" />
              </div>
            )}
        </div>
      </section>
      {/* Message Footer */}
      <section className="h-16 bg-white flex items-center px-1 ">
        <div className="relative mb-1">
          <IVSender />
        </div>
        <div className="flex justify-center items-center rounded-full hover:bg-primary hover:text-white h-10 w-10">
          <BackgroundChanger />
        </div>
        <div className="flex justify-center items-center rounded-full hover:bg-primary hover:text-white h-10 w-10">
          <EmojiPickerComponet />
        </div>
        <form
          className="h-full w-full flex justify-center items-center"
            onSubmit={handleSendMessage}
        >
          <input
            type="text"
            placeholder="Type your message..."
            className="py-1 px-4 outline-none w-full h-full"
            value={message.text}
            onChange={handleOnChange}
          />
          <button className=" h-10 w-10 flex justify-center items-center rounded-full hover:bg-primary hover:text-white">
            <MdSend size={25} />
          </button>
        </form>
      </section>
    </>
  );
}
