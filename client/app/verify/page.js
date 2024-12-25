"use client";

import { useEffect, useState } from "react";
import Avatar from "../Components/helpers/Avatar";
import VerifyOtp from "../MyComponents/Verification/VerifyOtp";
import Image from "next/image";

export default function Verify() {
  const [name, setName] = useState("null");
  const [profilePic, setProfilePic] = useState("null");

  useEffect(() => {
    const storedName = sessionStorage.getItem("name");
    const storedProfilePic = sessionStorage.getItem("profile_pic");
    if (storedName) setName(storedName);
    if (storedProfilePic) setProfilePic(storedProfilePic);
  }, []);

  return (
    <>
      <>
        <div className="flex justify-between mx-10">
          <Image src="/logo.svg" width={100} height={100} alt="Logo" />
          <div className="flex mt-4 gap-3">
            <p className="mt-1">{name}</p>
            <Avatar name={name} imageUrl={profilePic} height={30} width={30} />
          </div>
        </div>
        <div className="flex flex-col justify-center items-center">
          <div className="mt-2">
            <div className="flex flex-col justify-center items-center">
              <Avatar
                name={name}
                imageUrl={profilePic}
                height={60}
                width={60}
              />
              <p>
                Hey <b>{name}</b>,Welcome to our website
              </p>
            </div>
          </div>
          <div className="mt-1">
            <VerifyOtp />
          </div>
        </div>
      </>
    </>
  );
}
