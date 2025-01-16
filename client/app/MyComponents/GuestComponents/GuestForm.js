"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { BiRightArrowAlt } from "react-icons/bi";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setToken } from "@/app/redux/userSlice";
import Navbar from "../Navbar";
import { Providers } from "@/app/Provider";

export default function GuestForm() {
  const [data, setData] = useState({
    name: "",
    age: "",
    gender: "",
  });
  const [captcha, setCaptcha] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  // Handle ReCAPTCHA verification
  const handleCaptcha = (token) => {
    if (token) {
      setCaptcha(true);
      toast.success("Human Verified Successfully");
    } else {
      setCaptcha(false);
      toast.error("Please verify that you're not a robot.");
    }
  };

  // Handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!captcha) {
      return toast.error("Please complete the CAPTCHA verification.");
    }

    const URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/guest-user`;



    try {
      const response = await axios.post(URL, data, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (response.data.success) {
        sessionStorage.setItem("name", data.name);

        console.log("Token",response.data.token)

        // Set token in Redux and localStorage
        dispatch(setToken(response.data.token));
        localStorage.setItem("token", response.data.token);

        // Reset form state and show success message
        setData({
          name: "",
          age: "",
          gender: "",
        });
        toast.success(
          response.data.message || "Guest account created successfully!"
        );
        router.push("/guestchat");
      } else {
        toast.error(response.data.message || "Failed to create guest account.");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  return (
    <>
      <Providers>
        <div className="flex flex-col min-h-screen bg-black">
          <div className="absolute w-full h-full bg-no-repeat bg-cover bg-center opacity-25 bg-[url('/11.webp')]"></div>
          <div className="absolute top-4 right-4 sm:right-6">
            <Navbar />
          </div>
          <div className="grid flex-grow items-center justify-center">
            <div className="relative shadow-[rgba(132,197,135,0.1)] shadow-2xl bg-[rgba(66,89,67,1)] text-white rounded-lg p-6 sm:p-8 lg:p-10 max-w-md w-full">
              <h1 className="text-lg font-bold mb-6">
                Welcome To Infinity Chat...
              </h1>
              <h2 className="text-2xl font-bold mb-2">Log In as Guest</h2>
              <p className="text-sm uppercase tracking-wide mb-6">
                Changed your mind?
              </p>
              <p className="text-sm flex gap-1 mb-6">
                Wanna Join Us
                <button
                  className="text-red-400 hover:underline flex items-center font-bold"
                  onClick={() => router.push("/register")}
                >
                  Register <BiRightArrowAlt size={20} />
                </button>
              </p>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={data.name}
                    onChange={handleChange}
                    placeholder="Enter Name"
                    required
                    className="w-full placeholder-slate-500 text-black bg-[#fffbfba8] text-sm border border-gray-700 rounded-lg px-4 py-2 focus:outline-none"
                  />
                </div>
                <div className="flex gap-4 mb-4">
                  <div>
                    <label htmlFor="gender" className="block mb-1">
                      Gender
                    </label>
                    <input
                      type="text"
                      id="gender"
                      name="gender"
                      value={data.gender}
                      onChange={handleChange}
                      placeholder="Gender"
                      required
                      className="w-full placeholder-slate-500 text-black bg-[#fffbfba8] text-sm border border-gray-700 rounded-lg px-4 py-2 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="age" className="block mb-1">
                      Age
                    </label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      value={data.age}
                      onChange={handleChange}
                      placeholder="Age"
                      required
                      className="w-full placeholder-slate-500 text-black bg-[#fffbfba8] text-sm border border-gray-700 rounded-lg px-4 py-2 focus:outline-none"
                    />
                  </div>
                </div>
                <ReCAPTCHA
                  sitekey={process.env.NEXT_PUBLIC_SITE_KEY}
                  onChange={handleCaptcha}
                  className="mt-2 flex justify-center"
                />
                <button
                  type="submit"
                  disabled={!captcha}
                  className="w-full mt-4 px-4 py-2 text-sm rounded-lg bg-green-500 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  Create Account
                </button>
              </form>
            </div>
          </div>
        </div>
      </Providers>
    </>
  );
}
