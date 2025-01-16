'use client'
import { useCallback, useEffect, useState } from "react";
import GuestUserSearchCard from "./GuestUserSearchCard";
import LoadingStyle from "../Loader";
import { toast } from "sonner";
import axios from "axios";

export default function GuestBar() {
    const [search,setSearch] = useState("")
    const [loading, setLoading] = useState(false);
    const [searchUser, setSearchUser] = useState([]);

    const handleSearchUser = useCallback(
        async (e) => {
          const URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/search-guest-user`;
          try {
            setLoading(true);
            const response = await axios.post(URL, {
              search: search,
            });
            setLoading(false);
    
            setSearchUser(response.data.data);
          } catch (error) {
            toast.error("Error");
          }
        },
        [search]
      );
      useEffect(() => {
        handleSearchUser();
      }, [search]);
  return (
    <>
      <div className="h-full bg-white min-w-60">
        <div>
          <h3 className="font-bold text-md p-2">Online Users</h3>
          <div className="ml-4 w-44">
            <input
              type="text"
              className="p-1 rounded-full w-full h-full outline-none px-4 bg-slate-200"
              placeholder="Search User"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
            />
          </div>
        </div>
            <div className="w-full mt-8 shadow-lg rounded-lg">
              <div className=" overflow-x-hidden overflow-y-scroll custom-scrollbar mt-2 w-full">
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
                    <GuestUserSearchCard key={user._id} user={user} />
                  ))}
              </div>
            </div>
          </div>
    </>
  );
}
 