"use client";

import Avatar from "@/app/Components/helpers/Avatar";
import { MdEmail, MdWork } from "react-icons/md";
import { TbCirclesRelation } from "react-icons/tb";
import { GiGraduateCap, GiStairsGoal } from "react-icons/gi";
import { IoLocationSharp } from "react-icons/io5";
import { RiImageFill } from "react-icons/ri";
import uploadFile from "@/app/Components/helpers/uploadFile";
import { useEffect, useState } from "react";
import { Providers } from "@/app/Provider";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";
import Navbar from "../MyComponents/Navbar";
import UserDataBar from "../MyComponents/UserSidebar";
import Link from "next/link";

export default function MyProfile() {
  const fetchUserDetails = async () => {
    try {
      const URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user-details`;
      const response = await axios({
        url: URL,
        withCredentials: true,
      });

      setIsData(response.data.data);
      if (response.data.logout) {
        dispatch(logout());
        router.push("/");
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };
  useEffect(() => {
    fetchUserDetails();
  });
  const [isdata, setIsData] = useState({
    bgImage: "",
    profile_pic: "",
    name: "",
    work: "",
    education: "",
    location: "",
    email: "",
    relation: "",
    goal: "",
    about: "",
  });
  const [uploading, setIsUploading] = useState(false);
  const [edit, setEdit] = useState(false);
  const dispatch = useDispatch();
  const handleBgChange = async (e) => {
    try {
      const file = e.target.files[0];
      const uploadBg = await uploadFile(file);
      console.log("BGIMAGE", uploadBg);
      setIsData((prev) => ({
        ...prev,
        bgImage: uploadBg?.url,
      }));
      console.log("BGIMAGE", uploadBg.url);
      console.log("BGIMAGE", isdata);
      toast.success("Photo uploaded successfully!");
    } catch (err) {
      toast.error("Failed to upload photo!");
    }
  };

  const handlePrChange = async (e) => {
    setIsUploading(true);
    const file = e.target.file[0];
    const uploadPr = uploadFile(file);
    setIsUploading(false);
    setIsData((prevs) => ({
      ...prevs,
      prImage: uploadPr?.url,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setIsData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = (e) => {
    e.preventDefault();
    setEdit(!edit);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update-user`;
      const response = await axios.post(URL, isdata, { withCredentials: true });
      if (response.data.success) {
        dispatch(setUser(response.data.data));
        console.log("Rewss", response.data.data);
        toast.success("Profile updated successfully!");
      } else {
        console.log(response.data.message);
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.log("Error");
      toast.error("Error");
    }
  };
  return (
    <>
      <Providers>
        <div>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-[180px,1250px,200px]">
              <div className="border-r-[1px] border-gray-300">
                <UserDataBar />{" "}
              </div>
              <div className="p-6 bg-gray-50">
                <div>
                  <div className="mt-4 rounded-t-lg rounded-b-md h-80 bg-white">
                    <div
                      className="h-60 rounded-t-lg bg-cover bg-center"
                      style={{ backgroundImage: `url(${isdata?.bgImage})` }}
                    >
                      <div>
                        <label
                          htmlFor="bgImage"
                          className="text-white flex gap-3 justify-end items-center p-3 cursor-pointer"
                        >
                          <div className="mt-[11.5rem] bg-gray-600 bg-opacity-75 flex gap-1 mr-4 justify-center px-4 py-2">
                            <RiImageFill size={20} />{" "}
                            <span className="font-roboto font-thin text-sm">
                              Edit Cover
                            </span>
                          </div>
                        </label>
                        <input
                          type="file"
                          id="bgImage"
                          name="bgImage"
                          className="hidden"
                          onChange={handleBgChange}
                        />
                      </div>
                    </div>
                    <div className="flex rounded-lg absolute top-[18.5rem] ml-44">
                      <input
                        className="text-2xl px-2 focus:outline-none w-fit rounded-lg bg-transparent text-black font-roboto font-thin"
                        value={isdata?.name}
                        type="text"
                        id="name"
                        name="name"
                        disabled={!edit}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="bg-white absolute flex justify-center items-center top-52 ml-8 rounded-full h-32 w-32">
                      <label htmlFor="prImage">
                        <Avatar
                          imageUrl={isdata?.profile_pic}
                          width={115}
                          height={115}
                        />
                      </label>
                      <input
                        type="file"
                        id="prImage"
                        name="prImage"
                        className="hidden"
                        onChange={handlePrChange}
                      />
                    </div>
                    <div className="flex justify-end mt-4 gap-4 m-8">
                      {/* <button className="rounded-lg bg-[#2572be] hover:scale-105 p-2 px-4 text-white">
                        FRIENDS 23
                      </button> */}
                      {edit ? (
                        <button
                          type="submit"
                          onClick={() => setEdit(!edit)}
                          className="bg-[#2572be] text-white px-4 py-1 rounded-lg hover:scale-105"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={handleEdit}
                          className="bg-[#2572be] text-white px-4 py-1 rounded-lg hover:scale-105"
                        >
                          Edit
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="rounded-lg mt-4 h-[17.5rem] bg-white">
                    <p className="text-xl font-roboto flex justify-between font-thin p-3">
                      Introducion
                    </p>
                    <div className="border-[1px] border-b-2 border-b-slate-100"></div>
                    <div className="text-lg grid grid-cols-2 gap-2 p-4 font-roboto font-thin">
                      <p className="flex gap-4 border-b-2 border-b-slate-100 p-4">
                        <MdWork size={25} className="text-slate-500" />
                        <input
                          type="text"
                          id="work"
                          name="work"
                          placeholder="Your Work Profession"
                          value={isdata?.work}
                          onChange={handleChange}
                          disabled={!edit}
                          className="cursor-pointer focus:outline-none w-full placeholder:text-slate-500 bg-white"
                        />
                      </p>
                      <p className="flex gap-4 border-b-2 border-b-slate-100 p-4">
                        <GiGraduateCap size={25} className="text-slate-500" />
                        <input
                          type="text"
                          id="education"
                          name="education"
                          placeholder="Your Educational Background"
                          value={isdata?.education}
                          onChange={handleChange}
                          disabled={!edit}
                          className="cursor-pointer focus:outline-none w-full placeholder:text-slate-500 bg-white"
                        />
                      </p>
                      <p className="flex gap-4 border-b-2 border-b-slate-100 p-4">
                        <IoLocationSharp size={25} className="text-slate-500" />
                        <input
                          type="text"
                          id="location"
                          name="location"
                          placeholder="Your Location"
                          value={isdata?.location}
                          onChange={handleChange}
                          disabled={!edit}
                          className="cursor-pointer focus:outline-none w-full placeholder:text-slate-500 bg-white"
                        />
                      </p>
                      <p className="flex gap-4 border-b-2 border-b-slate-100 p-4">
                        <MdEmail size={25} className="text-slate-500" />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          placeholder="The email I'd"
                          value={isdata?.email}
                          onChange={handleChange}
                          disabled={!edit}
                          className="cursor-pointer focus:outline-none w-full placeholder:text-slate-500 bg-white"
                        />
                      </p>
                      <p className="flex gap-4 p-4">
                        <TbCirclesRelation
                          size={25}
                          className="text-slate-500"
                        />
                        <input
                          type="text"
                          id="relation"
                          name="relation"
                          placeholder="Relationship Status"
                          value={isdata?.relation}
                          onChange={handleChange}
                          disabled={!edit}
                          className="cursor-pointer focus:outline-none w-full placeholder:text-slate-500 bg-white"
                        />
                      </p>
                      <p className="flex gap-4 p-4">
                        <GiStairsGoal size={25} className="text-slate-500" />
                        <input
                          type="text"
                          id="goal"
                          name="goal"
                          placeholder="Your Sole Goal"
                          value={isdata?.goal}
                          onChange={handleChange}
                          disabled={!edit}
                          className="cursor-pointer focus:outline-none w-full placeholder:text-slate-500 bg-white"
                        />
                      </p>
                    </div>
                  </div>
                </div>
                <div className="h-[11rem] w-[71.3vw] bg-white mt-8">
                  <div className="text-xl font-roboto font-thin p-3 flex justify-between">
                    <p>About</p>
                  </div>
                  <div className="border-[1px] border-slaborder-b-slate-100"></div>
                  <textarea
                    placeholder="Tell us something more about yourself"
                    className="text-lg text-slate-700 ml-2 p-2 h-[12vh] placeholder:text-slate-500 focus:outline-none  bg-white w-[70vw]"
                    type="text"
                    id="about"
                    name="about"
                    value={isdata?.about}
                    onChange={handleChange}
                    disabled={!edit}
                  ></textarea>
                </div>
              </div>
              <div className="border-l-[1px] border-gray-300">
                <div className="mt-10 ml-9">
                  <h2 className="text-2xl font-semibold text-slate-500">
                    We Value Your Feedback!
                  </h2>
                  <p className="text-slate-500 mt-4">
                    Help us improve! What iss your favorite feature in our chat
                    rooms?
                  </p>
                  <div className="mt-4 space-y-3">
                    <button className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                      Text Chat
                    </button>
                    <button className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                      Video Chat
                    </button>
                    <button className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                      Group Chatrooms
                    </button>
                    <button className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                      Private Chat
                    </button>
                  </div>
                  <p className="text-slate-500 mt-4 text-sm">
                    Your opinion matters! Thank you for sharing.
                  </p>
                </div>
                
                <div className="ml-8 mt-40 right-4 z-20">
                <p className="text-lg font-semibold">Your donation matters!</p>
                <p className="text-sm mt-2">Help us build and improve Infinity-Chat.org. Every contribution makes a difference.</p>
                  <Link
                    href="https://www.patreon.com/yourpage"
                    className="flex items-center ml-32 justify-center w-16 h-16 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600"
                    target="_blank"
                  >
                    <span className="text-xl">💖</span>
                  </Link>
                </div>
              </div>
            </div>
          </form>
        </div>
      </Providers>
    </>
  );
}
