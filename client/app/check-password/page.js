"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { BiRightArrowAlt } from "react-icons/bi";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
// import { FaUserCircle } from "react-icons/fa";
import Avatar from "../Components/helpers/Avatar";
import { useDispatch } from "react-redux";
import { setToken } from "../redux/userSlice";

export default function Checkpassword() {
  const [data, setData] = useState({
    password: "",
    email: "", // Initialize with an empty string
  });

  const [name, setName] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const storedName = sessionStorage.getItem("name");
    const storedProfilePic = sessionStorage.getItem("profile_pic");
    const storedEmail = sessionStorage.getItem("email");

    if (storedName) setName(storedName);
    if (storedProfilePic) setProfilePic(storedProfilePic);

    if (storedEmail) {
      setData((prev) => ({ ...prev, email: storedEmail })); // Update email in data
    } else {
      console.warn("Email not found in sessionStorage");
    }
  }, []);

  const onHandleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!data.email) {
      toast.error("Email is missing. Please log in again.");
      return;
    }

    const URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/password`;

    try {
      const response = await axios.post(URL, data, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        console.log("xxxdata", response)
      }
      if (response.data.success) {
        dispatch(setToken(response.data.token))
        localStorage.setItem('token',response.data.token)
        setData({
          password: "",
          email: "",
        });
        toast.success(response.data.message);
        router.push("/");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "An error occurred. Please try again."
      );
    }

    console.log("data", data);
  };
  return (
    <>
      <div className="mt-5 grid justify-center">
        <div className="bg-white max-w-lg rounded mx-2 overflow-hidden p-4">
          <center>
            {" "}
            <div>
              {/* <FaUserCircle
                        size={70}
                    /> */}
              <Avatar
                imageUrl={profilePic}
                width={70}
                height={70}
                name={name}
              />
              <h2 className="font-semibold mb-4">{name}</h2>
            </div>
          </center>

          <h3>Welcome to Infinity Chat!</h3>

          <form className="grid gap-4 mt-3" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label htmlFor="password">Password</label>
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
            <center>
              <button className="bg-primary px-4 py-1 hover:bg-secondry text-white w-1/2 tracking-wide leading-relaxed rounded-md mt-2 font-bold">
                Lets Go
              </button>
            </center>
          </form>
          <p className="text-red-600 mt-3 ml-11 flex ">
            <Link
              className="text-blue-800 ml-2 flex font-bold"
              href="/forgot-password"
            >
              Forget Password?{" "}
              <BiRightArrowAlt className="mt-[0.3rem] font-bold" />
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
