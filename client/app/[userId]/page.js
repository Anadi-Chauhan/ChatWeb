"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { MdSend } from "react-icons/md";
import Link from "next/link";
import Image from "next/image";
import moment from "moment";
import { IoMdPersonAdd, IoMdVideocam } from "react-icons/io";
import { IoCheckmarkDone } from "react-icons/io5";
import { PiPhoneCallFill } from "react-icons/pi";
import { MdCallEnd } from "react-icons/md";
import Peer from "simple-peer";
import Avatar from "@/app/Components/helpers/Avatar";
import LoadingStyle from "../MyComponents/Loader";
import { getSocket } from "@/lib/socket";
import {
  logout,
  setOnlineUser,
  setSocketConnection,
  setUser,
} from "../redux/userSlice";
import axios from "axios";

import EmojiPickerComponet from "../MyComponents/MessagePageComponents/EmojiPicker";
import IVSender from "../MyComponents/MessagePageComponents/IVSender";
import VoiceMessage from "../MyComponents/VoiceMessage";
import NoChat from "../MyComponents/MessagePageComponents/NoChat";
import { toast } from "sonner";

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("ChatDB", 1);

    request.onupgradeneeded = (event) => {
      let db = event.target.result;
      if (!db.objectStoreNames.contains("messages")) {
        let store = db.createObjectStore("messages", { keyPath: "userID" });
        store.createIndex("userID", "userID", { unique: true });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject("Error opening IndexedDB");
  });
}

async function getMessages(userID) {
  let db = await openDB();
  let transaction = db.transaction("messages", "readonly");
  let store = transaction.objectStore("messages");

  return new Promise((resolve) => {
    let request = store.get(userID);
    request.onsuccess = () =>
      resolve(request.result ? request.result.messages : []);
    request.onerror = () => resolve([]);
  });
}
async function saveMessages(userID, messages) {
  let db = await openDB();
  return new Promise((resolve, reject) => {
    let transaction = db.transaction("messages", "readwrite");
    let store = transaction.objectStore("messages");

    let request = store.put({ userID, messages });

    request.onsuccess = () => resolve(true);
    request.onerror = (event) => reject(event.target.error);
  });
}


export function deleteDBOnLogout() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase("ChatDB");

    request.onsuccess = () => resolve("Database deleted successfully.");
    request.onerror = (event) => reject(`Error deleting database: ${event.target.error}`);
  });
}

export default function MessagePage({ background }) {
  const params = useParams();
  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );
  const user = useSelector((state) => state?.user);
  const [dataUser, setDataUser] = useState({
    _id: "",
    name: "",
    email: "",
    profile_pic: "",
    online: false,
  });
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: "",
    audioUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [allMessage, setAllMessage] = useState([]);
  const [messaging, setMessaging] = useState(false);
  const currentMessage = useRef();
  const [calling, setCalling] = useState(false);
  const [called, setCalled] = useState(false);
  const [callAccepted, setCallAccepted] = useState(false);
  const [stream, setStream] = useState();
  const [show, setShow] = useState(false);
  const callData = {
    socketId: "",
    signal: "",
  };
  const [call, setCall] = useState(callData);
  let calledId = null;
  let callerId = null;
  const myVideo = useRef(null);
  const remoteVideo = useRef(null);
  const connectionRef = useRef();
  const dispatch = useDispatch();
  const router = useRouter();
  const audioRef = useRef(null);
  const [showComponenet, setShowComponent] = useState(false);
  const [isSeen, setIsSeen] = useState({});

  const fetchUserDetails = async () => {
    try {
      console.log("entry");
      const URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user-details`;
      const response = await axios({
        url: URL,
        withCredentials: true,
      });
      console.log("entry2");
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

  const handleEmojiMessage = (emoji) => {
    setMessage((prev) => ({ text: prev.text + emoji }));
  };

  const handleClearUploadPhoto = () => {
    setMessage((prevs) => {
      return {
        ...prevs,
        imageUrl: "",
      };
    });
  };

  const handleClearUploadVideo = () => {
    setMessage((prevs) => {
      return {
        ...prevs,
        videoUrl: "",
      };
    });
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setMessage((prev) => {
      return {
        ...prev,
        text: value,
      };
    });
  };

  const handleSendMessage = (e) => {
    // e.preventDefault();
    setMessaging(true);
    if (
      message.text ||
      message.imageUrl ||
      message.videoUrl ||
      message.audioUrl
    ) {
      if (socketConnection) {
        socketConnection.emit("new-message", {
          sender: user?._id,
          reciever: params.userId,
          text: message.text,
          imageUrl: message.imageUrl,
          videoUrl: message.videoUrl,
          audioUrl: message.audioUrl,
          msgByUserId: user?._id,
          recievedByUserId: params.userId,
          sender_name: user.name,
          reciever_name: params.userId.name,
          sender_profile_pic: user.profile_pic,
          reciever_profile_pic: params.userId.profile_pic,
        });
        console.log("message", message);
        setMessage({
          text: "",
          imageUrl: "",
          videoUrl: "",
          audioUrl: "",
        });
      }
    }
  };

  const setupMedia = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        console.log("Stream obtained successfully:", stream);
        setStream(stream);
        console.log("setted stream", stream);
      });
  };

  const enableMedia = () => {
    if (stream && myVideo) {
      myVideo.current.srcObject = stream;
      myVideo.current.autoplay = true;
    } else {
      console.error("Stream is invalid or null");
    }
    setShow(true);
  };

  const handleCallUser = () => {
    enableMedia();
    setCalling(true);

    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });
    if (socketConnection) {
      socketConnection.emit("getCalledId", params.userId);
      socketConnection.emit("getCallerId", user._id);
      socketConnection.on("callerSocketID", (data) => {
        calledId = data;
      });
      socketConnection.on("calledSocketID", (data) => {
        callerId = data;
      });

      peer.on("signal", (data) => {
        socketConnection.emit("call-user", {
          userToCall: callerId,
          signal: data,
          from: calledId,
        });
      });
      peer.on("stream", (stream) => {
        remoteVideo.current.srcObject = stream;
        remoteVideo.current.autoPlay = true;
      });
      socketConnection.on("call-accepted", (signal) => {
        setCallAccepted(true);
        peer.signal(signal);
      });
      connectionRef.current = peer;
    }
  };

  const handleAnswerCall = () => {
    setCallAccepted(true);
    enableMedia();
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socketConnection.emit("answer-call", { signal: data, to: call.socketId });
    });
    peer.on("stream", (remoteStream) => {
      if (remoteVideo.current) {
        remoteVideo.current.srcObject = remoteStream;
        remoteVideo.current.autoPlay = true;
      }
    });
    peer.signal(call.signal);
    connectionRef.current = peer;
  };

  const handleEndCall = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    if (socketConnection) {
      socketConnection.emit("end-call", { userToDisconnect: callerId });
    }
    if (connectionRef.current) {
      connectionRef.current.destroy();
      connectionRef.current = null;
    }

    setCalling(false);
    setCallAccepted(false);
    setShow(false);

    if (myVideo.current) {
      myVideo.current.srcObject = null;
    }
    if (remoteVideo.current) {
      remoteVideo.current.srcObject = null;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      // audioRef.current.currentTime = 0;
    }
  };

  const handleSendFriendRequest = () => {
    if (socketConnection) {
      socketConnection.emit("reqSender",{
        sender: user?._id,
        reciever: params.userId
      })
      toast("SENt")
    }
  }

  useEffect(() => {
    fetchUserDetails();
  });

  useEffect(() => {
    const socket = getSocket();
    console.log("kdjsidvbdsjbj");

    socket.on("onlineUser", (data) => {
      console.log("Online users:", data);
      dispatch(setOnlineUser(data));
    });

    dispatch(setSocketConnection(socket));

    return () => {
      socket.off("onlineUser");
    };
  }, [dispatch]);

  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [allMessage]);

  useEffect(() => {
    const fetchMessages = async () => {
      const cachedMessages = await getMessages(params.userId);
      setAllMessage(cachedMessages || []);

      const updatedSeenStatus = {};
      cachedMessages.forEach((msg) => {
        updatedSeenStatus[msg._id] = msg.seen;
      });
      setIsSeen(updatedSeenStatus);
    };

    fetchMessages();

    if (socketConnection) {
      socketConnection.emit("message-page", params.userId);
      socketConnection.on("message-user", (data) => {
        setDataUser(data);
      });

      socketConnection.on("message", async (data) => {
        setMessaging(false);
        setAllMessage(data);
        await saveMessages(params.userId, data);
        const updatedSeenStatus = {};
        data.forEach((msg) => {
          updatedSeenStatus[msg._id] = msg.seen;
        });
        setIsSeen(updatedSeenStatus);
      });

      socketConnection.on("new-message", async (data) => {
        const messageUser = data[data.length - 1];

        if (
          params.userId === messageUser.msgByUserId &&
          user._id === messageUser.recieverUserId
        ) {
          setAllMessage((prev) => [...prev, messageUser]);
          await saveMessages(params.userId, [messageUser]);
          setIsSeen((prev) => ({
            ...prev,
            [messageUser._id]: messageUser.seen,
          }));
        }
      });
    }
    const isValidHex = (str) => /^[a-fA-F0-9]{24}$/.test(str);
    if (isValidHex(params.userId)) {
      socketConnection?.emit("seen", params.userId);
      setShowComponent(true);
    }
    return () => {
      socketConnection?.off("message-user");
      socketConnection?.off("message");
      socketConnection?.off("new-message");
    };
  }, [socketConnection, params.userId, user]);

  useEffect(() => {
    setupMedia();
    socketConnection?.on("call-user", (data) => {
      setCall({
        ...call,
        socketId: data.from,
        signal: data.signal,
      });
    });

    socketConnection?.on("called-user", () => {
      setCalled(true);
    });
    socketConnection?.on("end-call", () => {
      handleEndCall(); // Trigger end call cleanup
    });
  }, [call]);

  useEffect(() => {
    if (!callAccepted && show) {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
    }
  }, [callAccepted, show]);

  return (
    <>
      {showComponenet ? (
        <div className="w-full bg-no-repeat bg-contain bg-center overflow-hidden">
          <header className="sticky top-0 h-16 bg-white grid grid-cols-[1fr,auto,auto,auto] items-center px-2 sm:px-4 md:px-6">
            <div className="flex items-center gap-2 sm:gap-4">
              <Link
                href="/"
                className=" lg:hidden flex justify-center items-center"
              >
                <MdOutlineArrowBackIosNew size={16} />
              </Link>
              <div className="flex items-center">
                <Avatar
                  width={50}
                  height={50}
                  imageUrl={dataUser?.profile_pic}
                  name={dataUser?.name}
                  userId={dataUser?._id}
                />
              </div>
              <div>
                <h3 className="font-semibold text-sm sm:text-base md:text-lg my-0 mt-1">
                  {dataUser?.name}
                </h3>
                <p className="text-xs sm:text-sm">
                  {dataUser.online ? (
                    <span className="text-green-700">Online</span>
                  ) : (
                    <span className="text-slate-500">Offline</span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex mr-10" title="Video Call">
              <button className="hidden sm:block">
                <IoMdVideocam onClick={handleCallUser} size={25} />
              </button>
              {/* <button onClick={handleSendFriendRequest} className="cursor-pointer hover:text-primary">
              <IoMdPersonAdd size={20} />
              </button> */}
            </div>
          </header>
          <section className="lg:h-[calc(88vh)] sm:h-[calc(100vh-128px)] p-2 sm:p-3 overflow-hidden relative bg-white ">
            <div className="h-[84.5vh] overflow-hidden rounded-lg bg-black  p-4 relative">
              <div
                style={{ backgroundImage: `url(${background})` }}
                className="bg-center bg-cover absolute inset-0 opacity-50 pointer-events-none"
              ></div>
              <div className="absolute">
                <video height="300px" width="300px" ref={myVideo} autoPlay />
              </div>
              <div className="relative h-[72.5vh] flex flex-col overflow-scroll scrollbar-none ">
                {allMessage.map((msg, index) => {
                  const isSameUserAsPrevious =
                    index > 0 &&
                    allMessage[index - 1]?.msgByUserId === msg.msgByUserId;
                  const isLatestMessage = index === allMessage.length - 1;
                  return (
                    <div
                      key={msg._id}
                      ref={isLatestMessage ? currentMessage : null}
                      className={`p-1 py-2 z-10 rounded w-fit min-w-14 ${
                        user._id === msg.msgByUserId ? "ml-auto" : ""
                      }`}
                    >
                      <div
                        className={`relative w-fit max-w-md p-2 border bubble shadow-md ${
                          user._id === msg.msgByUserId
                            ? "bg-[#bebeff] mr-10 right"
                            : "bg-[#acf9ff] ml-9 left"
                        }`}
                      >
                        <span className="text-sm text-gray-800 font-semibold">
                          {msg.sender_name}
                        </span>
                        <div className="mb-1 flex gap-3">
                          {msg.text && (
                            <p className="text-lg font-roboto">{msg.text}</p>
                          )}
                          {msg.imageUrl && (
                            <Image
                              src={msg?.imageUrl}
                              width={300}
                              height={300}
                              alt="no Image"
                              className="w-[300px] mt-4 h-[300px] object-scale-down"
                            />
                          )}
                          {msg.videoUrl && (
                            <video
                              src={
                                msg?.videoUrl ===
                                `data:video/webm;base64,${msg.videoUrl}`
                                  ? msg?.videoUrl ===
                                    `data:video/webm;base64,${msg.videoUrl}`
                                  : msg.videoUrl
                              }
                              controls
                              muted
                              alt="no Video"
                              className="w-[300px] h-[300px] object-scale-down"
                            />
                          )}
                          {msg.audioUrl && (
                            <div className="w-9">
                              <audio
                                controls
                                src={`data:audio/webm;base64,${msg?.audioUrl}`}
                                type="audio/webm"
                                style={{ width: "150px", height: "40px" }}
                                className="mt-2"
                              />
                            </div>
                          )}
                        </div>
                        <span className="text-xs flex gap-2 mt-4 text-black ml-auto">
                          {moment(msg.createdAt).format(" Do MMMM, YYYY")},
                          {moment(msg.createdAt).format("hh:mm A")}
                          <IoCheckmarkDone
                            size={16}
                            className={`ml-auto ${
                              !isSeen[msg._id] ? "text-black" : "text-red-400"
                            }`}
                          />
                        </span>
                      </div>
                      {!isSameUserAsPrevious &&
                        (user._id === msg.msgByUserId ? (
                          <div className="float-end relative bottom-6">
                            <Avatar
                              width={30}
                              height={30}
                              imageUrl={
                                msg.sender_profile_pic ||
                                msg.reciever_profile_pic
                              }
                              name={msg.sender_name || msg.reciever_name}
                              userId={msg?._id}
                            />
                          </div>
                        ) : (
                          <div className="relative float-start bottom-6 ">
                            <Avatar
                              width={30}
                              height={30}
                              imageUrl={
                                msg.sender_profile_pic ||
                                msg.reciever_profile_pic
                              }
                              name={msg.sender_name || msg.reciever_name}
                              userId={msg?._id}
                            />
                          </div>
                        ))}
                      {messaging && isLatestMessage && (
                        <div className="flex justify-center items-center mt-4">
                          <p
                            className={` px-4 -mb-1 py-1 w-fit text-sm rounded-2xl min-w-14 ${
                              user._id === msg.msgByUserId
                                ? "bg-green-500 mr-10"
                                : "bg-white ml-7"
                            }`}
                          >
                            <LoadingStyle />
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}

                <section className="fixed h-12 z-20 flex items-center bottom-7 gap-4 px-1 w-full   ">
                  <div className="flex justify-center items-center bg-white rounded-lg lg:w-[68.5rem] sm:w-[60rem] md:w-[62.5rem] lg:h-full sm:h-12 lg:mb-0 sm:mb-20">
                    <div className="relative lg:flex sm:hidden items-center justify-center">
                      <IVSender
                        setLoading={setLoading}
                        setMessage={setMessage}
                      />
                      <div className=" mt-4 ml-2 h-10 w-10">
                        <EmojiPickerComponet
                          onEmojiSelect={handleEmojiMessage}
                        />
                      </div>
                    </div>
                    <div className="mt-2 h-10 w-10">
                      <VoiceMessage setMessage={setMessage} />
                    </div>
                    <form className="h-full w-full flex justify-center items-center">
                      <input
                        type="text"
                        placeholder="Type your message..."
                        className="py-1 px-4 outline-none w-full h-full"
                        value={message.text}
                        onChange={handleOnChange}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                    </form>
                    <button
                      onClick={handleSendMessage}
                      className="relative h-12 w-16 z-20  rounded-lg flex justify-center items-center bg-green-400 hover:text-white lg:bottom-0 lg:right-0 sm:bottom-10 md:bottom-10 sm:right-8 md:right-8"
                    >
                      <MdSend size={25} />
                    </button>
                  </div>
                </section>
              </div>
            </div>
            {message.imageUrl && (
              <div className="w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hiddenx">
                <div
                  className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600"
                  onClick={handleClearUploadPhoto}
                >
                  <RxCross2 size={30} />
                </div>
                <div className="bg-white p-3 ">
                  <Image
                    src={message.imageUrl}
                    width={300}
                    height={300}
                    className="aspect-square max-w-sm m-2 object-scale-down"
                    alt="Upload Image"
                  />
                </div>
              </div>
            )}
            {message.videoUrl && (
              <div className="w-full h-full  sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
                <div
                  className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600"
                  onClick={handleClearUploadVideo}
                >
                  <RxCross2 size={30} />
                </div>
                <div className="bg-white p-3 ">
                  <video
                    src={
                      message.videoUrl ===
                      `data:video/webm;base64,${message.videoUrl}`
                        ? `data:video/webm;base64,${message.videoUrl}`
                        : message.videoUrl
                    }
                    className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
                    autoPlay
                    controls
                    alt="Upload Video"
                  />
                </div>
              </div>
            )}
            {message.audioUrl && (
              <div className="w-full h-full  sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
                <div
                  className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600"
                  onClick={handleClearUploadVideo}
                >
                  <RxCross2 size={30} />
                </div>
                <div className="bg-white p-3 ">
                  <audio
                    src={`data:audio/webm;base64,${message.audioUrl}`}
                    controls
                  />
                </div>
              </div>
            )}
            {loading && (
              <div className="w-full h-full  sticky bottom-0 flex justify-center items-center">
                <LoadingStyle bg="bg-slate-300" />
              </div>
            )}
            <div className="hidden">
              <video height="300px" width="300px" ref={remoteVideo} autoPlay />
            </div>

            {calling && (
              <div className="h-full w-full  sticky bottom-0 overflow-hidden flex justify-center items-center p-4 text-white">
                <div className="w-fit min-w-96 top-0 right-0 opacity-90 rounded-md bg-green-800 p-6">
                  <div>
                    <h1 className="font-semibold flex justify-center text-6xl my-0 mt-1">
                      {dataUser?.name}
                    </h1>
                    <div className="flex justify-center mt-4 font-bold gap-2 text-xl">
                      <p>
                        <PiPhoneCallFill size={25} />
                      </p>
                      Called...
                    </div>
                  </div>
                  <div className="flex mt-6 justify-center">
                    <Avatar
                      width={100}
                      height={100}
                      imageUrl={dataUser?.profile_pic}
                      name={dataUser?.name}
                    />
                  </div>
                  <div className="flex justify-center items-center mt-5">
                    <div
                      className={`w-60 h-60 border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg`}
                    >
                      <video
                        className="w-full h-full object-cover"
                        ref={remoteVideo}
                        autoPlay
                      />
                    </div>
                  </div>
                  <div className="flex mt-10 justify-between mx-12">
                    <div className="bg-red-500 p-[6px]  flex rounded-md">
                      <button
                        onClick={handleAnswerCall}
                        className="flex items-center text-white gap-2 "
                      >
                        Accept
                        <PiPhoneCallFill />
                      </button>
                    </div>
                    <div className="bg-red-500 p-[6px]  flex rounded-md">
                      <button
                        onClick={handleEndCall}
                        className="flex items-center text-white gap-2 "
                      >
                        Decline
                        <MdCallEnd />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {called && (
              <div className="h-full w-full  sticky bottom-0 overflow-hidden flex justify-center items-center p-4 text-white">
                <div className="w-fit min-w-96 top-0 right-0 opacity-90 rounded-md bg-green-800 p-6">
                  <div>
                    <h1 className="font-semibold flex justify-center text-6xl my-0 mt-1">
                      {dataUser?.name}
                    </h1>
                    <div className="flex justify-center mt-4 font-bold gap-2 text-xl">
                      <p>
                        <PiPhoneCallFill size={25} />
                      </p>
                      Calling...
                    </div>
                  </div>
                  <div className="flex mt-6 justify-center">
                    <Avatar
                      width={100}
                      height={100}
                      imageUrl={dataUser?.profile_pic}
                      name={dataUser?.name}
                    />
                  </div>
                  <div className="flex justify-center items-center gap-5 mt-5">
                    <div className="w-40 h-40 border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg">
                      <video
                        className="w-full h-full object-cover"
                        ref={myVideo}
                        autoPlay
                        // muted
                      />
                    </div>
                    <div
                      className={`w-60 h-60 border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg`}
                    >
                      <video
                        className="w-full h-full object-cover"
                        ref={remoteVideo}
                        autoPlay
                      />
                    </div>
                  </div>
                  <div className="flex mt-10 justify-between mx-12">
                    <div className="bg-red-500 p-[6px]  flex rounded-md">
                      <button
                        onClick={handleAnswerCall}
                        className="flex items-center text-white gap-2 "
                      >
                        Accept
                        <PiPhoneCallFill />
                      </button>
                    </div>
                    <div className="bg-red-500 p-[6px]  flex rounded-md">
                      <button
                        onClick={handleEndCall}
                        className="flex items-center text-white gap-2 "
                      >
                        Decline
                        <MdCallEnd />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <audio
              ref={audioRef}
              id="ringtone"
              src="./audio/ringing.mp3"
              loop
            ></audio>
            {!callAccepted && called ? (
              <audio src="./audio/ringtone.mp3" autoPlay loop></audio>
            ) : null}
          </section>
        </div>
      ) : (
        <NoChat />
      )}
    </>
  );
}
