"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BiDotsVertical } from "react-icons/bi";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { MdSend } from "react-icons/md";
import Link from "next/link";
import Image from "next/image";
import moment from "moment";
import { IoMdVideocam } from "react-icons/io";
import { IoCall } from "react-icons/io5";
import { PiPhoneCallFill } from "react-icons/pi";
import { MdCallEnd } from "react-icons/md";
import { IoMdMicOff } from "react-icons/io";
import { HiMiniSpeakerWave } from "react-icons/hi2";
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
import BackgroundChanger from "../MyComponents/MessagePageComponents/BackgroundChange";
import IVSender from "../MyComponents/MessagePageComponents/IVSender";

export default function MessagePage() {
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

  const [background, setBackground] = useState("./bg-11.jpg");
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [allMessage, setAllMessage] = useState([]);
  const currentMessage = useRef();
  const [calling, setCalling] = useState(false);
  const [called, setCalled] = useState(false);
  const [callAccepted, setCallAccepted] = useState(false);
  const [stream, setStream] = useState(false);
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
  const [showComponenet, setShowComponent] = useState(false);

  const fetchUserDetails = async () => {
    try {
      console.log('entry')
      const URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user-details`;
      const response = await axios({
        url: URL,
        withCredentials: true,
      });
      console.log('entry2')
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
  },[]);

  // Socket connection
  useEffect(() => {
    const socket = getSocket(); // Get the singleton socket instance
    console.log('kdjsidvbdsjbj')

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

  const handleEmojiMessage = (emoji) => {
    setMessage((prev) => ({ text: prev.text + emoji })); // Append the emoji
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
    e.preventDefault();
    if (message.text || message.imageUrl || message.videoUrl) {
      if (socketConnection) {
        socketConnection.emit("new-message", {
          sender: user?._id,
          reciever: params.userId,
          text: message.text,
          imageUrl: message.imageUrl,
          videoUrl: message.videoUrl,
          msgByUserId: user?._id,
          recievedByUserId: params.userId,
        });
        setMessage({
          text: "",
          imageUrl: "",
          videoUrl: "",
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
    console.log("myVideo", myVideo.current);
    console.log("Setting stream to video:", stream);
    if (stream && myVideo) {
      console.log("Setting stream to video:", stream);
      myVideo.current.srcObject = stream; // Set the stream to the local video element
      remoteVideo.current.srcObject = stream; // Set the stream to the local video element
      remoteVideo.current.autoPlay = true; // Set the stream to the local video element
      myVideo.current.autoplay = true;
    } else {
      console.error("Stream is invalid or null");
    }
    setShow(true);
  };

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
  }, [call]);

  const handleCallUser = () => {
    // setupMedia();
    setCalling(true);
    // socketConnection.emit("call-user", params.userId);
    enableMedia();
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });
    if (socketConnection) {
      socketConnection.emit("getCalledId", params.userId);
      socketConnection.emit("getCallerId", user._id);
      socketConnection.on("callerSocketID", (data) => {
        console.log("calleddata", data);
        calledId = data;
        console.log("calledID", calledId);
      });
      socketConnection.on("calledSocketID", (data) => {
        console.log("callerdata", data);
        callerId = data;
        console.log("callerID", callerId);
      });

      peer.on("signal", (data) => {
        console.log("Signal data:", data);
        socketConnection.emit("call-user", {
          userToCall: callerId,
          signal: data,
          from: calledId,
        });
        console.log("calledID", calledId);
        console.log("callerID", callerId);
      });
      peer.on("stream", (stream) => {
        console.log("Signaled data:", stream);
        myVideo.current.srcObject = stream; // Assign the remote stream to the remote video element
        remoteVideo.current.srcObject = stream; // Assign the remote stream to the remote video element
      });
      socketConnection.on("call-accepted", (signal) => {
        console.log("peerSignal", signal);
        setCallAccepted(true);
        peer.signal(signal);
      });
      connectionRef.current = peer;
    }
  };

  const handleAnswerCall = () => {
    enableMedia();
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    console.log("Peer object created:", peer);

    peer.on("signal", (data) => {
      console.log("cccccc", data);
      socketConnection.emit("answer-call", { signal: data, to: call.socketId });
    });
    peer.on("stream", (remoteStream) => {
      console.log("Remote stream (receiver):", remoteStream);
      if (remoteVideo.current) {
        remoteVideo.current.srcObject = remoteStream; // Assign the remote stream to the remote video element
        myVideo.current.srcObject = remoteStream; // Assign the remote stream to the remote video element
      }
    });
    peer.signal(call.signal);
    connectionRef.current = peer;
  };

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("message-page", params.userId);
      socketConnection.on("message-user", (data) => {
        setDataUser(data);
      });

      socketConnection.on("message", (data) => {
        console.log("XXXX", data);
        const latestMessageSender = data[data.length - 1]?.msgByUserId;
      if(params.userId === latestMessageSender){

        console.log("YYYYY", latestMessageSender);
        setAllMessage(data);
      }
      });
    }
    const isValidHex = (str) => /^[a-fA-F0-9]{24}$/.test(str);
    if (isValidHex(params.userId)) {
      setShowComponent(true);
    }
  }, [socketConnection, params.userId, user]);

  return (
    <>
      {showComponenet ? (
        <div
          style={{ backgroundImage: `url(${background})` }}
          className="w-full h-screen bg-no-repeat bg-cover bg-center overflow-hidden"
        >
          <header className="sticky top-0 border-b-2 border-b-[rgba(66,89,67,1)] h-16 bg-white grid grid-cols-[950px,2fr,2fr,1fr] items-center px-3">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className=" lg:hidden flex justify-center items-center"
              >
                <MdOutlineArrowBackIosNew size={16} />
              </Link>
              <div className="flex mt-2">
                <Avatar
                  width={50}
                  height={50}
                  imageUrl={dataUser?.profile_pic}
                  name={dataUser?.name}
                  userId={dataUser?._id}
                />
              </div>
              <div>
                <h3 className="font-semibold text-lg my-0 mt-1">
                  {dataUser?.name}
                </h3>
                <p className="-my-2 text-sm">
                  {dataUser.online ? (
                    <span className="text-green-700">Online</span>
                  ) : (
                    <span className="text-slate-500">Offline</span>
                  )}
                </p>
              </div>
            </div>
            <div>
              <button>
                <IoCall onClick={handleCallUser} size={25} />
              </button>
            </div>
            <div>
              <button>
                <IoMdVideocam size={25} />
              </button>
            </div>
            <div>
              <button className="cursor-pointer hover:text-primary">
                <BiDotsVertical size={25} />
              </button>
            </div>
          </header>
          <section className="h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll relative bg-slate-950 bg-opacity-40">
            <div className="flex flex-col gap-2 py-2 mx-2" ref={currentMessage}>
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
                    <div className="w-full">
                      {msg?.imageUrl && (
                        <Image
                          src={msg?.imageUrl}
                          width={300}
                          height={300}
                          alt="no Image"
                          className="w-[300px] h-[300px] object-scale-down"
                        />
                      )}
                      {msg?.videoUrl && (
                        <video
                          src={msg?.videoUrl}
                          controls
                          muted
                          alt="no Video"
                          className="w-[300px] h-[300px] object-scale-down"
                        />
                      )}
                    </div>
                    <p className="px-2">{msg.text}</p>
                    <p className="text-xs ml-auto w-fit">
                      {moment(msg.createdAt).format("hh:mm")}
                    </p>
                  </div>
                );
              })}
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
                    src={message.videoUrl}
                    className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
                    autoPlay
                    controls
                    alt="Upload Video"
                  />
                </div>
              </div>
            )}
            {loading && (
              <div className="w-full h-full  sticky bottom-0 flex justify-center items-center">
                <LoadingStyle bg="bg-slate-300" />
              </div>
            )}
            <video height="200px" width="300px" ref={myVideo} autoPlay />
            <video height="300px" width="300px" ref={remoteVideo} autoPlay />
            {calling && (
              <div className="h-full w-full sticky bottom-0 overflow-hidden flex justify-center items-center p-4 text-white">
                <div className="w-fit min-w-96 top-0 right-0 rounded-md opacity-90 bg-teal-900 p-6">
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
                  <video height="200px" width="200px" ref={myVideo} autoPlay />
                  <video
                    height="300px"
                    width="300px"
                    ref={remoteVideo}
                    autoplay
                  />
                  <div className="flex mt-52 gap-3 justify-between">
                    <div className="bg-slate-200 rounded-full text-black">
                      <button className="p-2">
                        <HiMiniSpeakerWave size={30} />
                      </button>
                    </div>
                    <div className="bg-slate-200 rounded-full text-black">
                      <button className="p-2">
                        <IoMdMicOff size={30} />
                      </button>
                    </div>
                    <div className="bg-red-500 p-[6px]  flex rounded-md">
                      <button className="flex items-center text-white gap-2 ">
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
                <div className="w-fit min-w-96 top-0 right-0 opacity-90 rounded-md bg-teal-900 p-6">
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
                  <video height="200px" width="200px" ref={myVideo} autoPlay />
                  <video
                    height="300px"
                    width="300px"
                    ref={remoteVideo}
                    autoPlay
                  />
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
                      <button className="flex items-center text-white gap-2 ">
                        Decline
                        <MdCallEnd />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {!callAccepted && show ? (
              <audio src="./audio/ringing.mp3" autoPlay loop></audio>
            ) : null}
            {!callAccepted && called ? (
              <audio src="./audio/ringtone.mp3" autoPlay loop></audio>
            ) : null}
          </section>

          <section className="h-16 bg-white flex items-center px-1 ">
            <div className=" relative">
              <IVSender setLoading={setLoading} setMessage={setMessage} />
            </div>
            <div className="flex justify-center items-center rounded-full hover:bg-primary hover:text-white h-10 w-10">
              <BackgroundChanger setBackground={setBackground} />
            </div>
            <div className="flex justify-center items-center rounded-full hover:bg-primary hover:text-white h-10 w-10">
              <EmojiPickerComponet onEmojiSelect={handleEmojiMessage} />
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
        </div>
      ) : (
        <div className="flex justify-center items-center">Hi</div>
      )}
    </>
  );
}
