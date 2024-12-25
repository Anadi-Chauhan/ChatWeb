"use client";

import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { BiRightArrowAlt } from "react-icons/bi";
import uploadFile from "../Components/helpers/uploadFile";
import axios from "axios";
import { toast } from "sonner";
import { FiUpload } from "react-icons/fi";
import Link from "next/link";
import Navbar from "../MyComponents/Navbar";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: "",
  });

  const [uploadPhoto, setUploadPhoto] = useState("");
  const router=useRouter()

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    const uploadPhoto = await uploadFile(file);
    setUploadPhoto(file);
    setData((prevs) => ({
      ...prevs,
      profile_pic: uploadPhoto?.url,
    }));
  };

  const onHandleChange = (e) => {
    const { name, value } = e.target;
    setData((prevs) => ({
      ...prevs,
      [name]: value,
    }));
  };

  const handleClearUploadPhoto = () => {
    setUploadPhoto(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/register`;

    try {
      const response = await axios.post(URL, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        sessionStorage.setItem("name", data.name);
        sessionStorage.setItem("profile_pic", data.profile_pic);
        sessionStorage.setItem("email", data.email);
        toast.success(response.data.message);
        setData({
          name: "",
          email: "",
          password: "",
          profile_pic: "",
        });
      } else {
        toast.error("User not created. Please try again.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
    router.push("/verify")
  };

  return (
    <>
      <div className="flex flex-col min-h-screen bg-black">
        <div className="absolute w-full h-full bg-no-repeat bg-cover bg-center opacity-25 bg-[url('/11.webp')]"></div>
        <div className="absolute top-4 right-4 sm:right-6">
         <Navbar />
        </div>
        <div className="grid flex-grow items-center  justify-center">
              <div className="relative shadow-[rgba(132,197,135,0.1)]  shadow-2xl bg-[rgba(66,89,67,1)] text-white rounded-l p-6 sm:p-8 lg:p-10 max-w-md w-full">
                <div className="mb-6">
                  <h1 className="text-lg font-bold">
                    Welcome To Infinity Chat...
                  </h1>
                </div>
                <div className="mb-6">
                  <p className="text-sm uppercase tracking-wide mb-2">
                    Join for free
                  </p>
                  <h2 className="text-2xl font-bold">Create new account.</h2>
                  <p className="text-sm mt-2 flex gap-1">
                    Already a Member?
                    <button
                      onClick={() => setShowEmail(true)}
                      className="text-red-400 hover:underline flex items-center"
                    >
                      Log in <BiRightArrowAlt size={20} />
                    </button>
                  </p>
                </div>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="name">Name</label>
                    <div className="flex gap-4 mt-2 flex-col sm:flex-row">
                      <input
                        type="text"
                        id="first-name"
                        name="name"
                        value={data.value}
                        onChange={onHandleChange}
                        placeholder="First name"
                        required
                        className="placeholder-slate-500 w-full sm:w-1/2 text-black bg-[#fffbfba8] text-sm border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-green-600"
                      />
                      <input
                        type="text"
                        id="name"
                        name="last-name"
                        value={data.value}
                        onChange={onHandleChange}
                        placeholder="Last name"
                        className="w-full sm:w-1/2 placeholder-slate-500 text-black bg-[#fffbfba8] text-sm border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-green-600"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email">Email</label>
                    <div className="mt-2">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Email"
                        value={data.email}
                        onChange={onHandleChange}
                        required
                        className="w-full placeholder-slate-500 text-black bg-[#fffbfba8] text-sm border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-green-600"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="password">Password</label>
                    <div className="mt-2">
                      <input
                        type="password"
                        placeholder="Password"
                        id="password"
                        name="password"
                        value={data.password}
                        onChange={onHandleChange}
                        required
                        className="w-full placeholder-slate-500 text-black bg-[#fffbfba8] text-sm border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-green-600"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="profile_pic">
                      Profile Pic
                      <div className="flex items-center mt-2 placeholder-slate-500 text-black bg-[#fffbfba8] text-sm border border-gray-700 rounded-lg px-4 py-2">
                        <p className="text-sm truncate text-slate-500">
                          {uploadPhoto?.name
                            ? uploadPhoto?.name
                            : "Upload profile pic"}
                        </p>
                        {uploadPhoto?.name && (
                          <button
                            className="text-lg ml-2 hover:text-red-500"
                            onClick={handleClearUploadPhoto}
                          >
                            <IoClose />
                          </button>
                        )}
                        <div className="ml-auto flex text-slate-700 items-center">
                          <FiUpload size={19} />
                        </div>
                      </div>
                    </label>
                    <input
                      type="file"
                      id="profile_pic"
                      name="profile_pic"
                      className="hidden"
                      onChange={handleUploadPhoto}
                    />
                  </div>
                  <div>
                    <button className="w-full mt-3 px-4 py-2 text-sm bg-green-500 rounded-lg hover:bg-green-600 focus:ring focus:ring-green-600">
                      Create account
                    </button>
                  </div>
                </form>
                <div className="absolute bottom-4 right-4">
                  <p className="text-xs text-gray-200">...AnadiChauhan</p>
                </div>
              </div>
        </div>
        <div className="h-6 w-full relative bg-[rgba(6,23,6,1)] text-white">
          <div className=" my-1 text-xs flex justify-around w-[80%] ml-28 items-center" >
        <p>2024 © <Link href='/' className="text-blue-500 hover:text-blue-300 " >  Infinity-Chat.org - Free Chat Rooms</Link></p>
        <p className="cursor-pointer hover:text-blue-500" >Terms of Service</p>
        <p className="cursor-pointer hover:text-blue-500" > Privacy Policy</p>
        <p className="cursor-pointer hover:text-blue-500" >Contact us</p>
        <p className="cursor-pointer hover:text-blue-500" > Language</p>
        </div>
        </div>
      </div>
    </>
  );
}


