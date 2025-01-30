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
      <div className="flex flex-col min-h-screen">
        <div className="grid flex-grow items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="relative text-white p-6 sm:p-8 lg:p-10 w-full max-w-sm md:max-w-md">
            <div className="mb-6">
              <p className="text-xl font-light font-roboto uppercase tracking-wide mb-2">
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
                <button className="w-full sm:w-auto mt-3 lg:min-w-28 px-4 py-2 text-sm bg-green-500 rounded-lg hover:bg-green-600 focus:ring focus:ring-green-600">
                  Login
                </button>
              </div>
            </form>
            <div className="absolute bottom-4 right-4 text-xs text-gray-200">
              ...AnadiChauhan
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
