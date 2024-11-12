"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { BiDotsVertical } from "react-icons/bi";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { AiFillFileAdd } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";
import { FaVideo } from "react-icons/fa6";
import { FaImage } from "react-icons/fa6";
import Avatar from "../Components/helpers/Avatar";
import { MdSend } from "react-icons/md";
import Link from "next/link";
import uploadFile from "../Components/helpers/uploadFile";
import Image from "next/image";
import Loading from "../MyComponents/Loader";
import { MdWallpaper } from "react-icons/md";
import moment from "moment";

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

  const [openUpload, setOpenUpload] = useState(false);
  const [openBackground, setOpenBackground] = useState(false);
  const [background, setBackground] = useState("./background1.jpg");
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [allMessage, setAllMessage] = useState([])
  const currentMessage = useRef()

  useEffect(()=>{
    if(currentMessage.current){
      currentMessage.current.scrollIntoView({behavior : 'smooth', block : 'end'})
    }
  },[allMessage])

  const handleUpload = (e) => {
    e.preventDefault();
    setOpenUpload((prev) => !prev);
  };

  const handleOpenBackground = (e) => {
    e.preventDefault();
    setOpenBackground((prev) => !prev);
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];

    setLoading(true);

    const uploadPhoto = await uploadFile(file);

    setLoading(false);
    setOpenUpload(false);
    setMessage((prevs) => {
      return {
        ...prevs,
        imageUrl: uploadPhoto?.url,
      };
    });
  };

  const handleClearUploadPhoto = () => {
    setMessage((prevs) => {
      return {
        ...prevs,
        imageUrl: "",
      };
    });
  };
   const handleCloseBackground = () => {
    setOpenBackground(false)
  };

  const handleUploadVideo = async (e) => {
    const file = e.target.files[0];

    setLoading(true);

    const uploadPhoto = await uploadFile(file);

    setLoading(false);
    setOpenUpload(false);
    setMessage((prevs) => {
      return {
        ...prevs,
        videoUrl: uploadPhoto?.url,
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

  const handleBackgroundChange = (image) => {
    setBackground(image);
    setOpenBackground(false);
  };

  const handleOnChange = (e)=>{
    const {name, value} = e.target
    setMessage(prev =>{
      return {
        ...prev,
        text : value
      }
    })
  }

  const handleSendMessage = (e)=>{
    e.preventDefault()
    if (message.text || message.imageUrl || message.videoUrl) {
      if(socketConnection){
        socketConnection.emit('new-message',{
          sender : user?._id,
          reciever : params.userId,
          text : message.text,
          imageUrl : message.imageUrl,
          videoUrl : message.videoUrl,
          msgByUserId : user?._id
        })
        setMessage({
          text: "",
          imageUrl: "",
          videoUrl: "",
        })
      }
    }
  
  }

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("message-page", params.userId);
      socketConnection.emit("seen", params.userId);
      socketConnection.on("message-user", (data) => {
        setDataUser(data);
      });

      socketConnection.on('message',(data)=>{
        console.log("XXXX",data)
        setAllMessage(data)
        // if (params?.userId === data?.userId) {
        //   setAllMessage(data)
        // }
      })
    }
  }, [socketConnection, params?.userId, user]);

  
  return (
    <>
      <div
        style={{ backgroundImage: `url(${background})` }}
        className="w-full h-screen bg-no-repeat bg-cover bg-center"
      >
        <header className="sticky top-0 h-16 bg-white flex justify-between items-center px-3">
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
            <button className="cursor-pointer hover:text-primary">
              <BiDotsVertical size={25} />
            </button>
          </div>
        </header>

        <section className="h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll relative bg-slate-200 bg-opacity-10">
          <div className="flex flex-col gap-2 py-2 mx-2" ref={currentMessage} >
            {
              allMessage.map((msg,index)=>{
                return(
                  <div  className={`p-1 py-2 rounded w-fit ${user._id === msg.msgByUserId ? "ml-auto bg-teal-200" : "bg-yellow-100"}`} >
                    <div className="w-full" >
                    {
                      msg?.imageUrl && (
                          <Image 
                            src={msg?.imageUrl}
                            width={300}
                            height={300}
                            alt="no Image"
                            className="w-[300px] h-[300px] object-scale-down"
                          />
                        )
                      }
                      {
                      msg?. videoUrl && (
                          <video 
                            src={msg?.videoUrl}
                            controls
                            muted
                            alt="no Video"
                            className="w-[300px] h-[300px] object-scale-down"
                          />
                        )
                      }
                    </div>
                    <p className="px-2" >{msg.text}</p>
                    <p className="text-xs ml-auto w-fit" >{moment(msg.createdAt).format('hh:mm')}</p>
                  </div>
                )
              })
            }
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
              <Loading bg="bg-slate-300" />
            </div>
          )}
          {openBackground && (
            <div className="bg-slate-200  sticky bottom-0 bg-opacity-25 w-full h-full flex justify-center items-center">
              <div
                className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600"
                onClick={handleCloseBackground}
              >
                <RxCross2 size={30} />
              </div>
              <div className="bg-white m-2 grid grid-cols-2 gap-10">
                {[
                  "/background2.jpg",
                  "/background3.jpg",
                  "/background4.webp",
                  "/background5.jpeg",
                ].map((bg, index) => (
                  <button
                    key={index}
                    onClick={() => handleBackgroundChange(bg)}
                  >
                    <div className="border-2 border-black">
                      <Image
                        src={bg}
                        alt="Background"
                        width={150}
                        height={150}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="h-16 bg-white flex items-center px-1 ">
          <div className=" relative">
            <button
              onClick={handleUpload}
              className=" flex justify-center items-center w-10 h-10 rounded-full hover:bg-primary hover:text-white"
            >
              <AiFillFileAdd size={23} />
            </button>

            {openUpload && (
              <div className="bg-white shadow rounded absolute bottom-11 w-36 p-2">
                <form>
                  <label
                    htmlFor="uploadImage"
                    className="flex items-center p-2 px-3 gap-3  hover:bg-slate-200 cursor-pointer"
                  >
                    <div className="text-primary">
                      <FaImage size={18} />
                    </div>
                    <p>Image</p>
                  </label>
                  <label
                    htmlFor="uploadVideo"
                    className="flex items-center p-2 px-3 gap-3  hover:bg-slate-200 cursor-pointer"
                  >
                    <div className="text-purple-700">
                      <FaVideo size={18} />
                    </div>
                    <p>Video</p>
                  </label>

                  <input
                    type="file"
                    id="uploadImage"
                    onChange={handleUploadImage}
                    className="hidden"
                  />
                  <input
                    type="file"
                    id="uploadVideo"
                    onChange={handleUploadVideo}
                    className="hidden"
                  />
                </form>
              </div>
            )}
          </div>
          <div className="flex justify-center items-center rounded-full hover:bg-primary hover:text-white h-10 w-10">
            <button onClick={handleOpenBackground}>
              <MdWallpaper size={25} />
            </button>
          </div>
          <form className="h-full w-full flex justify-center items-center" onSubmit={handleSendMessage} >
            <input
              type="text"
              placeholder="Type your message..."
              className="py-1 px-4 outline-none w-full h-full"
              value={message.text}
              onChange={handleOnChange}
            />
            <button className=" h-10 w-10 flex justify-center items-center rounded-full hover:bg-primary hover:text-white" >
              <MdSend size={25}  />
            </button>
          </form>
         
        </section>
      </div>
    </>
  );
}
