"use client";

import { useState } from "react";
import Navbar from "../MyComponents/Navbar";
import { IoMdCall } from "react-icons/io";
import { HiOutlineMail } from "react-icons/hi";
import Link from "next/link";  // Add Link import for footer links

export default function Support() {
  const [data, setData] = useState({
    name: "",
    email: "",
    text: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("data", e.target);
    setData({
      name: "",
      email: "",
      text: "",
    });
  };

  return (
    <>
      <div className="bg-[#000000] text-white flex flex-col h-screen overflow-hidden">
        {/* Background image */}
        <div className="absolute w-full h-full bg-no-repeat bg-cover bg-center opacity-20 bg-[url('/HomeMainBg.jpg')]"></div>

        {/* Navbar */}
        <div className="absolute w-full z-10 py-5">
          <Navbar />
        </div>

        {/* Main content */}
        <div className="flex gap-10 mt-32 justify-center items-center">
          {/* Support information */}
          <div className="flex-1 font-roboto font-thin text-xl space-y-1 md:max-w-lg">
            <p>Our Support Team will contact you as soon as possible.</p>
            <p>Generally, we reply within 24hrs.</p>
            <p>If you do not get a reply, feel free to contact us at:</p>
            <div className="flex gap-2 mt-4 items-center">
              <IoMdCall size={25} /> <span>+91-7991813797</span>
            </div>
            <div className="flex gap-2 mt-4 items-center">
              <HiOutlineMail size={25} /> <span>exploring.tryingnew@gmail.com</span>
            </div>
          </div>

          {/* Support form */}
          <div className="flex-1 shadow-[rgba(132,197,135,0.1)] shadow-2xl bg-[rgba(66,89,67,1)] text-white rounded-lg h-fit p-6 sm:p-8 lg:p-10 max-w-md w-full">
            <h1 className="text-2xl font-bold mb-6">Support Form</h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name">Name</label>
                <input
                  placeholder="Enter name"
                  name="name"
                  type="text"
                  id="name"
                  value={data.name}
                  onChange={handleChange}
                  required
                  className="w-full relative placeholder-slate-500 text-black bg-[#fffbfba8] text-sm border border-gray-700 rounded-lg px-4 py-2 focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email">Email</label>
                <input
                  placeholder="Enter email"
                  name="email"
                  type="email"
                  id="email"
                  value={data.email}
                  onChange={handleChange}
                  required
                  className="w-full relative placeholder-slate-500 text-black bg-[#fffbfba8] text-sm border border-gray-700 rounded-lg px-4 py-2 focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="text">Problem</label>
                <textarea
                  rows={10}
                  cols={40}
                  id="text"
                  name="text"
                  value={data.text}
                  onChange={handleChange}
                  placeholder="Describe your problem here"
                  className="w-full relative placeholder-slate-500 text-black bg-[#fffbfba8] text-sm border border-gray-700 rounded-lg px-4 py-2 focus:outline-none"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full relative mt-4 px-4 py-2 text-sm rounded-lg bg-green-500 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="h-12 w-full z-10 bg-opacity-15 bg-green-900 text-white mt-auto">
          <div className="flex flex-wrap justify-around items-center h-full px-4 text-xs">
            <p>
              2024 ©{" "}
              <Link href="/" className="text-blue-500 hover:text-blue-300">
                Infinity-Chat.org - Free Chat Rooms
              </Link>
            </p>
            <Link
              href="/terms"
              className="cursor-pointer hover:text-blue-500"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className="cursor-pointer hover:text-blue-500"
            >
              Privacy Policy
            </Link>
            <Link
              href="/support"
              className="cursor-pointer hover:text-blue-500"
            >
              Contact us
            </Link>
            <Link
              href="/support"
              className="cursor-pointer hover:text-blue-500"
            >
              Language
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
