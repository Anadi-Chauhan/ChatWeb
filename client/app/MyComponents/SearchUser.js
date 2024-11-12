"use client";

import { useEffect, useState } from "react";
import { RiUserSearchLine } from "react-icons/ri";
import Loading from "./Loader";
import UserSearchCard from "./UserSearchCard";
import toast from "react-hot-toast";
import axios from "axios";
import { ImCross } from "react-icons/im";

export default function SearchUser({onClose}) {
  const [searchUser, setSearchUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search,setSearch] = useState("")

    const handleSearchUser = async (e)=> {
        const URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/search-user`;
        try {
            setLoading(true)
            const response = await axios.post(URL,{
                search : search
            })
            setLoading(false)
        
            setSearchUser(response.data.data)
            
        } catch (error) {
            toast.error(error?.response?.data?.message)
        }
    }
    useEffect(()=>{
        handleSearchUser()
    },[search])

    console.log("searchUser",searchUser)

  return (
    <>
    
      <div className="fixed bg-gray-700 bg-opacity-40 top-0 bottom-0 right-0 left-0 z-10 ">
      <button onClick={onClose}  className="text-red-600 float-end p-4" ><ImCross size={25} /></button>
        <div className="w-full max-w-lg mx-auto mt-8">
          <div className="bg-white rounded h-12 overflow-hidden flex">
            <input
              type="text"
              placeholder="Search user by name,email....."
              className="w-full outline-none p-1 h-full px-4"
              onChange={(e)=>setSearch(e.target.value)}
              value={search}
            />
            <div className="h-12 w-12 flex justify-center items-center">
              <RiUserSearchLine size={25} />
            </div>
          </div>
          <div className="bg-white mt-2 w-full p-4">
            {searchUser.length === 0 && !loading && (
              <p className="text-center text-slate-500">No User Found!</p>
            )}

            {loading && (
              <div className="text-center">
                <Loading />
              </div>
            )}
            {
                searchUser.length !== 0 && !loading && (
                    searchUser.map((user,index)=>(
                        <UserSearchCard key={user._id} user={user} onClose={onClose} />
                    ))
                )
            }
          </div>
        </div>
      </div>
    </>
  );
}
