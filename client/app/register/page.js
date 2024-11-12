"use client";

import React from "react";
import Link from "next/link";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { BiRightArrowAlt } from "react-icons/bi";
import uploadFile from "../Components/helpers/uploadFile";
import axios from "axios";
import { toast } from 'sonner'
import { useRouter} from "next/navigation";

export default function RegisterPage() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: "",
  });

  const [uploadPhoto, setUploadPhoto] = useState("");
  const router = useRouter()

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];

    const uploadPhoto = await uploadFile(file)
    setUploadPhoto(file);
    setData((prevs)=>{
      return{
        ...prevs,
        profile_pic : uploadPhoto?.url
      }
    })
  };

  const onHandleChange = (e) => {
    const { name, value } = e.target;

    setData((prevs) => {
      return {
        ...prevs,
        [name]: value,
      };
    });
  };

  const handleClearUploadPhoto = () => {
    setUploadPhoto(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/register`;
  
    try {
      const response = await axios.post(URL,data,{
          headers: {
              "Content-Type": "application/json"
          }
      });
      
      console.log("response", response);

      
      if (response.data.success) {
        
        sessionStorage.setItem('name', data.name);
        sessionStorage.setItem('profile_pic', data.profile_pic);
        sessionStorage.setItem('email', data.email);
        toast.success(response.data.message);
        setData({
          name: "",
          email: "",
          password: "",
          profile_pic: "",
        });
        router.push('/check-email');
      } else {
        toast.error('User not created. Please try again.');
      }
  
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  
    console.log('data', data);
  };
  return (
    <>
      <div className="mt-5 grid justify-center">
        <div className="bg-white max-w-sm rounded mx-2 overflow-hidden p-4">
          <h3>Welcome to Infinity Chat!</h3>

          <form className="grid gap-4 mt-3" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your name"
                className="bg-slate-50 px-2 py-1 focus:outline-primary overflow-hidden"
                value={data.name}
                onChange={onHandleChange}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                className="bg-slate-50 px-2 py-1 focus:outline-primary overflow-hidden"
                value={data.email}
                onChange={onHandleChange}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="password">Passworrd</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                className="bg-slate-50 px-2 py-1 focus:outline-primary overflow-hidden"
                value={data.password}
                onChange={onHandleChange}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="profile_pic">
                Profile Pic
                <div className="h-10 bg-slate-50 flex justify-center items-center border rounded hover:border-primary cursor-pointer">
                  <p className="text-sm max-w-sm overflow-hidden text-ellipsis line-clamp-1">
                    {uploadPhoto?.name
                      ? uploadPhoto?.name
                      : "Upload profile pic"}
                  </p>
                  {uploadPhoto?.name && (
                    <button
                      className="text-lg ml-2  hover:text-red-500"
                      onClick={handleClearUploadPhoto}
                    >
                      <IoClose />
                    </button>
                  )}
                </div>
              </label>
              <input
                type="file"
                id="profile_pic"
                name="profile_pic"
                className="bg-slate-50 px-2 py-1 focus:outline-primary overflow-hidden hidden"
                onChange={handleUploadPhoto}
              />
            </div>
            <center>
              <button className="bg-primary px-4 py-1 hover:bg-secondry text-white w-1/2 tracking-wide leading-relaxed rounded-md mt-2 font-bold">
                Register
              </button>
            </center>
          </form>
          <p className="text-red-600 mt-3 ml-11 flex ">
            Already have an account?{" "}
            <Link className="text-blue-800 ml-2 flex font-bold" href="/check-email">
              LogIn
              <BiRightArrowAlt className="mt-[0.3rem] font-bold" />
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}