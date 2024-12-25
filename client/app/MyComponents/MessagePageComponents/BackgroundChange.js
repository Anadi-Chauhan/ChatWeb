'use client'
import Image from "next/image";
import { useState } from "react";
import { MdWallpaper } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";

export default function BackgroundChanger({setBackground}){

    const [openBackground, setOpenBackground] = useState(false);

    const handleOpenBackground = (e) => {
        e.preventDefault();
        setOpenBackground((prev) => !prev);
      };

      const handleCloseBackground = () => {
        setOpenBackground(false);
      };

      const handleBackgroundChange = (image) => {
        setBackground(image);
        setOpenBackground(false);
      };
    return (
        <>
            <section  className="h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll relative bg-slate-950 bg-opacity-40">
            {openBackground && (
              <div className="fixed inset-40 top-0 bg-opacity-25 w-full h-full flex justify-center items-center">
                <div
                  className="w-fit mb-[33rem]  realtive cursor-pointer "
                  onClick={handleCloseBackground}
                >
                  <RxCross2
                    size={30}
                    className="text-white hover:text-red-600"
                  />
                </div>
                <div className="bg-white grid grid-cols-4 p-3 gap-2">
                  {[
                    "/bg-1.jpg",
                    "/bg-2.jpg",
                    "/bg-3.jpg",
                    "/bg-4.jpg",
                    "/bg-5.jpg",
                    "/bg-6.jpg",
                    "/bg-7.jpg",
                    "/bg-8.jpg",
                    "/bg-9.jpg",
                    "/bg-10.jpg",
                    "/bg-11.jpg",
                    "/bg-12.jpg",
                    "/bg-13.jpg",
                    "/bg-14.jpg",
                    "/bg-15.jpg",
                    "/bg-16.jpg",
                    "/bg-17.jpg",
                    "/bg-18.jpg",
                    "/bg-19.jpg",
                    "/bg-20.jpg",
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
            )}
            </section>
            <div>
            <button onClick={handleOpenBackground}>
                <MdWallpaper size={25} />
              </button>
            </div>
        </>
    )
}