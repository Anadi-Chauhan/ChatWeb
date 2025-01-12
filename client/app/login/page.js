"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { setToken } from "../redux/userSlice";
import Navbar from "../MyComponents/Navbar";
import Link from "next/link";
import axios from "axios";
import { BiRightArrowAlt } from "react-icons/bi";

export default function LoginPage() {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [email, setEmail] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();

  const onHandleChange = (e) => {
    const { name, value } = e.target;
    setData((prevs) => ({
      ...prevs,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmail(data.email);
    e.stopPropagation();
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/login`,
        { email },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast(response.data.message || "Success");
        sessionStorage.setItem("email", email);
        dispatch(setToken(response.data.token));
        localStorage.setItem("token", response.data.token);
        router.push(`/${email}`);
        console.log("enter3");
      } else {
        toast.error("Failed to verify OTP.");
        console.log("Failed to verify OTP.");
      }
    } catch (error) {}
  };

  return (
    <>
      <div className="flex flex-col min-h-screen bg-black">
        {/* Background */}
        <div className="absolute w-full h-full bg-no-repeat bg-cover bg-center opacity-25 bg-[url('/11.webp')]"></div>

        {/* Navbar */}
        <div className="absolute top-4 right-4 sm:right-6">
          <Navbar />
        </div>

        {/* Main Content */}
        <div className="grid flex-grow items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="relative shadow-[rgba(132,197,135,0.1)] shadow-2xl bg-[rgba(66,89,67,1)] text-white rounded-lg p-6 sm:p-8 lg:p-10 w-full max-w-sm md:max-w-md">
            {/* Welcome Message */}
            <div className="mb-6">
              <h1 className="text-lg font-bold">Welcome To Infinity Chat...</h1>
            </div>

            {/* Login Message */}
            <div className="mb-6">
              <p className="text-sm uppercase tracking-wide mb-2">
                Welcome Back
              </p>
              <h2 className="text-2xl font-bold">Log In to your account.</h2>
              <p className="text-sm mt-2">
                Don&apos;t have an account?
                <Link
                  href="/register"
                  className="text-red-400 hover:underline flex items-center"
                >
                  Create your account here <BiRightArrowAlt size={20} />
                </Link>
              </p>
            </div>

            {/* Login Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
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
              <div className="flex justify-center">
                <button className="w-full sm:w-auto mt-3 px-4 py-2 text-sm bg-green-500 rounded-lg hover:bg-green-600 focus:ring focus:ring-green-600">
                  Login
                </button>
              </div>
            </form>

            {/* Footer Attribution */}
            <div className="absolute bottom-4 right-4 text-xs text-gray-200">
              ...AnadiChauhan
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="h-12 w-full bg-[rgba(6,23,6,1)] text-white">
          <div className="flex flex-wrap justify-around items-center h-full px-4 text-xs">
            <p>
              2024 ©{" "}
              <Link href="/" className="text-blue-500 hover:text-blue-300">
                Infinity-Chat.org - Free Chat Rooms
              </Link>
            </p>
            <p className="cursor-pointer hover:text-blue-500">
              Terms of Service
            </p>
            <p className="cursor-pointer hover:text-blue-500">Privacy Policy</p>
            <p className="cursor-pointer hover:text-blue-500">Contact us</p>
            <p className="cursor-pointer hover:text-blue-500">Language</p>
          </div>
        </div>
      </div>
    </>
  );
}
