"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { BiRightArrowAlt } from "react-icons/bi";
import { toast } from "sonner";
import GuestMessage from "./GuestMessage";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setToken } from "@/app/redux/userSlice";

export default function GuestForm() {
  const [data, setData] = useState({
    name: "",
    age: "",
    gender: "",
  });
  const [captcha, setCaptcha] = useState(false);
  const [verified, setVerified] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch()

  const handleClick = () => {
    setCaptcha(true);

    toast("Human Verified Succesfully");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevs) => ({
      ...prevs,
      [name]: value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/guest-user`;

    try {
      const response = await axios.post(URL, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        console.log('enter')
        sessionStorage.setItem("name", data.name);
        
        // dispatch(setToken(response.data.token));
        // localStorage.setItem("token", response.data.token);
        // console.log('token',token)
        setData({
          name: "",
          age: "",
          gender: "",
        });
        setVerified(true);
        toast(response.data.message || "Guest Account Created Successsfully");
      } else {
        toast("Failed to verify OTP.");
      }
    } catch (error) {
      toast(error?.response?.data?.message || "An error occurred.");
    }
    console.log("User Data", data);
  };

  return (
    <>
      {!verified && (
        <div className="grid flex-grow items-center  justify-center">
          <div className="relative shadow-[rgba(132,197,135,0.1)]  shadow-2xl bg-[rgba(66,89,67,1)] text-white rounded-l p-6 sm:p-8 lg:p-10 max-w-md w-full">
            <div className="mb-6">
              <h1 className="text-lg font-bold">Welcome To Infinity Chat...</h1>
            </div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold">LogIn as Guest</h2>
              <p className="text-sm uppercase tracking-wide mt-2">
                Changed your mind?
              </p>
              <p className="text-sm mt-2 flex gap-1">
                Wanna Join Us
                <button
                  className="text-red-400 hover:underline flex items-center font-bold"
                  onClick={() => {
                    router.push("/register");
                  }}
                >
                  Register <BiRightArrowAlt size={20} />
                </button>
              </p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mt-2">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  onChange={handleChange}
                  value={data.name}
                  placeholder="Enter Name"
                  required
                  className="w-full placeholder-slate-500 text-black bg-[#fffbfba8] text-sm border border-gray-700 rounded-lg px-4 py-2 focus:outline-none "
                />
              </div>
              <div className="flex gap-3">
                <div className="mt-2 flex-col flex">
                  <label htmlFor="name">Gender</label>
                  <input
                    type="text"
                    id="gender"
                    name="gender"
                    placeholder="Gender"
                    onChange={handleChange}
                    value={data.gender}
                    required
                    className="w-fit placeholder-slate-500 text-black bg-[#fffbfba8] text-sm border border-gray-700 rounded-lg px-4 py-2 focus:outline-none "
                  />
                </div>
                <div className="mt-2 flex flex-col">
                  <label htmlFor="name">Age</label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    placeholder="Age"
                    onChange={handleChange}
                    value={data.age}
                    required
                    className="w-fit placeholder-slate-500 text-black bg-[#fffbfba8] text-sm border border-gray-700 rounded-lg px-4 py-2 focus:outline-none "
                  />
                </div>
              </div>
              <ReCAPTCHA
                sitekey={process.env.NEXT_PUBLIC_SITE_KEY}
                onChange={handleClick}
                className="mt-2 flex justify-center"
              />
              <div className="mt-2">
                <button
                  disabled={!captcha}
                  className="w-full mt-3 px-4 py-2 text-sm disabled:cursor-not-allowed  rounded-lg bg-green-500"
                >
                  Create account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {verified && (
          <GuestMessage />
      )}
    </>
  );
}

//focus:outline-none focus:ring focus:ring-green-600
