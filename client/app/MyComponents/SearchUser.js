"use client";

import { useCallback, useEffect, useState } from "react";
import { RiUserSearchLine } from "react-icons/ri";
import UserSearchCard from "./UserSearchCard";
import toast from "react-hot-toast";
import axios from "axios";
import { ImCross } from "react-icons/im";
import LoadingStyle from "./Loader";
import { CiSearch } from "react-icons/ci";

export default function SearchUser({ onClose }) {
  const [searchUser, setSearchUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [openModel, setOpenModel] = useState(false);

  const handleSearchUser = useCallback(
    async (e) => {
      const URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/search-user`;
      try {
        setLoading(true);
        const response = await axios.post(URL, {
          search: search,
        });
        setLoading(false);

        setSearchUser(response.data.data);
      } catch (error) {
        toast.error(error?.response?.data?.message);
      }
    },
    [search]
  );
  useEffect(() => {
    handleSearchUser();
  }, [search]);

  console.log("searchUser", searchUser);

  return (
    <>
      <div className="flex justify-center items-center h-8 w-72 bg-gray-100 rounded-3xl">
        <div className="h-12 w-12 flex justify-center items-center ">
          <CiSearch size={23} />
        </div>
        <input
          type="text"
          placeholder="Search now..."
          className="w-full outline-none p-1 h-full bg-gray-100 rounded-3xl z-20 px-4 "
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          onFocus={() => setOpenModel(true)}
        />
        <p className="mr-3 text-gray-600">/F</p>
      </div>
      {openModel && (
        <div className="fixed bg-opacity-0 top-0 bottom-0 right-0 z-10 ">
          <button onClick={() => setOpenModel(false)} className="text-red-600 float-end p-4">
            <ImCross size={25} />
          </button>
          <div className="w-full max-w-lg mx-auto mt-8">
            <div className="h-[70vh] overflow-x-hidden overflow-y-scroll custom-scrollbar mt-2 w-full p-4">
              {searchUser.length === 0 && !loading && (
                <p className="text-center text-slate-500">No User Found!</p>
              )}

              {loading && (
                <div className="text-center">
                  <LoadingStyle />
                </div>
              )}
              {searchUser.length !== 0 &&
                !loading &&
                searchUser.map((user, index) => (
                  <UserSearchCard
                    key={user._id}
                    user={user}
                    onClose={onClose}
                  />
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
