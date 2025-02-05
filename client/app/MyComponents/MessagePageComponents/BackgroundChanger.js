"use client";
import Image from "next/image";
import { useState } from "react";
import { MdWallpaper } from "react-icons/md";

export default function BackgroundChanger({ setBackground }) {
  const handleBackgroundChange = (image) => {
    setBackground(image);
  };
  return (
    <>
      {" "}
      <div className="fixed z-20 right-1/3 top-1/3 w-fit h-fit">
        <div className="bg-white rounded-lg grid grid-cols-4 p-3 gap-2">
          {[
            "/ChatBg1.avif",
            "/ChatBg2.jpg",
            "/ChatBg3.jpg",
            "/ChatBg6.jpg",
            "/ChatBg7.jpg",
          ].map((bg, index) => (
            <button
              key={index}
              onClick={() => handleBackgroundChange(bg)}
              className="transform transition-transform duration-30 hover:scale-110"
            >
              <div className="h-24 w-24 border-2 border-black rounded-md overflow-hidden">
                <Image
                  src={bg}
                  alt="Background"
                  className="h-full w-full object-cover"
                  width={96}
                  height={96}
                />
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
