"use client";

import { useState, useRef } from "react";
import Avatar from "../Components/helpers/Avatar";
import uploadFile from "../Components/helpers/uploadFile";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";
import { toast } from "sonner";

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
      <div className="fixed z-10 right-1/3 mt-20 ">
        <div className="bg-gray-300 p-4 py-8 m-1 rounded w-full max-w-sm">
          <h2 className="font-semibold">Profile Details</h2>
          <p className="text-sm">Edit Details</p>

          <form className="mt-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                value={data.name}
                onChange={handleChange}
                className="py-1 w-full px-2 focus:outline-primary"
              />
            </div>
            <div>
              <div>Photo</div>
              <div className="my-1 flex gap-5">
                <Avatar
                  width={40}
                  height={40}
                  name={data?.name}
                  imageUrl={data?.profile_pic}
                />
                <label htmlFor="profile_pic" className="mt-2">
                  <button
                    className="font-semibold"
                    onClick={handleOpenUpload}
                  >
                    Change Photo
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
