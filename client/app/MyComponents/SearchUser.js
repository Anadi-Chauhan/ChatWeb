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
  }, [search,handleSearchUser]);

  console.log("searchUser", searchUser);

  return (
    <>
  <div className="flex justify-center items-center h-8 sm:w-1/2 md:w-2/3 lg:w-96 w-96 bg-gray-100 rounded-3xl">
  <div className="h-12 w-14 flex text-gray-700 justify-center items-center">
    <CiSearch size={23} />
  </div>
  <input
    type="text"
    placeholder="Search for new friends to chat..."
    className="w-full outline-none p-1 h-full bg-gray-100 placeholder-gray-700 rounded-3xl z-20 px-2"
    onChange={(e) => setSearch(e.target.value)}
    value={search}
    onFocus={() => setOpenModel(true)}
  />
  <p className="mr-3 text-gray-700">/F</p>
</div>

{openModel && (
  <div className="fixed inset-0 bg-opacity-0 z-10 flex justify-center items-center">
    <button onClick={() => setOpenModel(false)} className="absolute top-4 right-4 text-red-600">
      <ImCross size={25} />
    </button>
    <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto mt-8 bg-white shadow-lg rounded-lg">
      <div className="h-[70vh] overflow-x-hidden overflow-y-scroll scrollbar-none mt-2 w-full p-4">
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
            <UserSearchCard key={user._id} user={user} onClose={onClose} />
          ))}
      </div>
    </div>
  </div>
)}

    </>
  );
}
