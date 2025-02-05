"use client";

import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { BiRightArrowAlt } from "react-icons/bi";
import axios from "axios";
import { toast } from "sonner";
import { FiUpload } from "react-icons/fi";
import { useRouter } from "next/navigation";
import uploadFile from "@/app/Components/helpers/uploadFile";
import LoadingNewStyle from "../newLoader";
import LoadingStyle from "../Loader";
import Link from "next/link";

export default function RegisterationForm({setShowRegister}) {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: "",
  });

  const [uploadPhoto, setUploadPhoto] = useState("");
  const [uploading, setUploading] = useState(false);
  const [registering, setRegistering] = useState(false);

  const router = useRouter();

  const handleUploadPhoto = async (e) => {
    setUploading(true);
    const file = e.target.files[0];
    const uploadPhoto = await uploadFile(file);
    setUploadPhoto(file);
    setData((prevs) => ({
      ...prevs,
      profile_pic: uploadPhoto?.url,
    }));
    setUploading(false);
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
    setRegistering(true);

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
        setRegistering(true);
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
    router.push("/verify");
  };
  return (
    <>
      <div className="flex mr-16 items-center gap-10 min-h-screen  justify-center">
        <div className="text-white p-10 sm:p-8 lg:p-10 max-w-md w-full">
          <div className="relative z-10">
            <div>
              <p className="text-2xl font-roboto font-thin uppercase tracking-wide mb-2">
                Join for free
              </p>
              <h2 className="text-2xl font-bold">Create new account.</h2>
              <p className="text-sm mt-2 flex gap-1">
                Already a Member?
                <button
                  onClick={()=>setShowRegister(true)}
                  className="text-red-400 hover:underline flex items-center"
                >
                  Log in <BiRightArrowAlt size={20} />
                </button>
              </p>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name">Name *</label>
                <div className="flex gap-4 mt-2 flex-col sm:flex-row">
                  <input
                    type="text"
                    id="first-name"
                    name="name"
                    value={data.value}
                    onChange={onHandleChange}
                    placeholder="First name"
                    required
                    className="placeholder-slate-700 w-full sm:w-1/2 text-black bg-[#fffbfba8] text-sm border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-green-600"
                  />
                  <input
                    type="text"
                    id="name"
                    name="last-name"
                    value={data.value}
                    onChange={onHandleChange}
                    placeholder="Last name"
                    className="w-full sm:w-1/2 placeholder-slate-700 text-black bg-[#fffbfba8] text-sm border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-green-600"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email">Gmail *</label>
                <div className="mt-2">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Gmail"
                    value={data.email}
                    onChange={onHandleChange}
                    required
                    className="w-full placeholder-slate-700 text-black bg-[#fffbfba8] text-sm border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-green-600"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password">Password *</label>
                <div className="mt-2">
                  <input
                    type="password"
                    placeholder="Password"
                    id="password"
                    name="password"
                    value={data.password}
                    onChange={onHandleChange}
                    minLength={6}
                    maxLength={10}
                    required
                    className="w-full placeholder-slate-700 text-black bg-[#fffbfba8] text-sm border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-green-600"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="profile_pic">
                  Profile Pic
                  {!uploading ? (
                    <div className="flex items-center mt-2 bg-[#fffbfba8] text-sm border border-gray-700 rounded-lg px-4 py-2">
                      <p className="text-sm truncate text-slate-700">
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
                  ) : (
                    <div>
                      <LoadingNewStyle />
                    </div>
                  )}
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
                  {registering ? <LoadingStyle /> : <p>Create account</p>}
                </button>
              </div>
              <div>
                <p className="text-xs" >By signing up, you agree to our <Link href="/" className="text-blue-500 hover:text-blue-300" >terms</Link>, <Link href="/" className="text-blue-500 hover:text-blue-300" >acceptable use</Link>, and <Link href="/" className="text-blue-500 hover:text-blue-300" >privacy policy</Link>.</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
