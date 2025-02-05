"use client";

import { useState, useRef } from "react";
import Avatar from "../Components/helpers/Avatar";
import uploadFile from "../Components/helpers/uploadFile";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";
import { toast } from "sonner";
import { MdOutlineDriveFolderUpload } from "react-icons/md";

export default function EditUser({ onClose, user }) {
  const [data, setData] = useState({
    name: user?.name || "",
    profile_pic: user?.profile_pic || "",
  });

  const uploadPhotoRef = useRef();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOpenUpload = (e) => {
    e.preventDefault();
    e.stopPropagation();
    uploadPhotoRef.current.click();
  };

  const handleUpload = async (e) => {
    try {
      const file = e.target.files[0];
      const uploadPhoto = await uploadFile(file);
      setData((prev) => ({
        ...prev,
        profile_pic: uploadPhoto?.url || prev.profile_pic,
      }));
      toast.success("Photo uploaded successfully!");
    } catch (err) {
      toast.error("Failed to upload photo!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update-user`;
      const response = await axios.post(URL, data, { withCredentials: true });

      if (response.data.success) {
        dispatch(setUser(response.data.data));
        toast.success("Profile updated successfully!");
        onClose();
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile!");
    }
  };

  return (
    <>
      <div className="fixed z-10 right-1/3 top-1/3 ">
        <div className="bg-white p-4 py-8 m-1 rounded w-full max-w-md">
          <h2 className="font-light font-roboto text-xl">Edit Profile Details</h2>
          <form className="mt-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="font-medium text-[17px]">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                value={data.name}
                onChange={handleChange}
                className="py-1 w-full px-2 mt-2 focus:outline-blue-300 rounded-md border-2 border-gray-500"
              />
            </div>
            <div className="mt-5" >
              <div className="font-medium text-[17px]" >Photo</div>
              <div className="mt-2 flex gap-5">
                <Avatar
                  width={40}
                  height={40}
                  name={data?.name}
                  imageUrl={data?.profile_pic}
                />
                <label htmlFor="profile_pic" className="mt-2">
                  <button
                    className="font-semibold flex gap-2 hover:text-blue-300"
                    onClick={handleOpenUpload}
                  >
                    Change Photo <MdOutlineDriveFolderUpload size={25} />
                  </button>
                  <input
                    type="file"
                    id="profile_pic"
                    className="hidden"
                    onChange={handleUpload}
                    ref={uploadPhotoRef}
                  />
                </label>
              </div>
            </div>
            <div className="flex gap-3 ml-auto w-fit mt-3">
              <button
                onClick={onClose}
                className="border-primary text-primary border px-4 py-1 rounded hover:bg-primary hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="border-primary bg-primary text-white border px-4 py-1 rounded hover:bg-secondry"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
