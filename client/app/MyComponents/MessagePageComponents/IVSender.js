'use client'

import uploadFile from "@/app/Components/helpers/uploadFile";
import { useState } from "react";
import { AiFillFileAdd } from "react-icons/ai";
import { FaImage, FaVideo } from "react-icons/fa";

export default function IVSender({setLoading,setMessage}){

    const [openUpload, setOpenUpload] = useState(false);
    

    const handleUpload = (e) => {
        e.preventDefault();
        setOpenUpload((prev) => !prev);
      };

      const handleUploadImage = async (e) => {
        const file = e.target.files[0];
    
        setLoading(true);
    
        const uploadPhoto = await uploadFile(file);
    
        setLoading(false);
        setOpenUpload(false);
        setMessage((prevs) => {
          return {
            ...prevs,
            imageUrl: uploadPhoto?.url,
          };
        });
      };

      const handleUploadVideo = async (e) => {
        const file = e.target.files[0];
    
        setLoading(true);
    
        const uploadPhoto = await uploadFile(file);
    
        setLoading(false);
        setOpenUpload(false);
        setMessage((prevs) => {
          return {
            ...prevs,
            videoUrl: uploadPhoto?.url,
          };
        });
      };
    return(
        <>
            <div>
            <button
                onClick={handleUpload}
                className=" flex justify-center items-center w-10 h-10 rounded-full hover:bg-primary hover:text-white"
              >
                <AiFillFileAdd size={23} />
              </button>

              {openUpload && (
                <div className="bg-white shadow rounded absolute bottom-11 w-36 p-2">
                  <form>
                    <label
                      htmlFor="uploadImage"
                      className="flex items-center p-2 px-3 gap-3  hover:bg-slate-200 cursor-pointer"
                    >
                      <div className="text-primary">
                        <FaImage size={18} />
                      </div>
                      <p>Image</p>
                    </label>
                    <label
                      htmlFor="uploadVideo"
                      className="flex items-center p-2 px-3 gap-3  hover:bg-slate-200 cursor-pointer"
                    >
                      <div className="text-purple-700">
                        <FaVideo size={18} />
                      </div>
                      <p>Video</p>
                    </label>

                    <input
                      type="file"
                      id="uploadImage"
                      onChange={handleUploadImage}
                      className="hidden"
                    />
                    <input
                      type="file"
                      id="uploadVideo"
                      onChange={handleUploadVideo}
                      className="hidden"
                    />
                  </form>
                </div>
              )}
            </div>
        </>
    )
}