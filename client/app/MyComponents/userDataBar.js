"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import Avatar from "../Components/helpers/Avatar";
import { useSelector } from "react-redux";
import { BsPuzzle } from "react-icons/bs";

export default function UserSideBaar({ onClose }) {
  const [quote, setQuote] = useState();

  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );
  const user = useSelector((state) => state?.user);

  useEffect(() => {
    const cachedQuote = sessionStorage.getItem("quote");
    setQuote(JSON.parse(cachedQuote));
    const fetchQuote = async () => {
      try {
        const response = await fetch("https://dummyjson.com/quotes/random");
        const data = await response.json();
        setQuote(data);
        sessionStorage.setItem("quote", JSON.stringify(data));
      } catch (error) {
        toast("Error fetching quote");
      }
    };

    if (!cachedQuote) {
      fetchQuote();
    }
  }, []);

  return (
    <>
      <div className="fixed right-1/4 top-60 w-fit h-fit bg-gray-100 shadow-lg rounded-xl z-10">
        <div className="p-5 flex gap-5 items-center">
          <Avatar
            imageUrl={user?.profile_pic}
            width={100}
            height={100}
            name={user?.name}
          />
          <h1 className="font-bold text-2xl">{user?.name}</h1>
        </div>
        <div className="p-5">
        <button className="flex items-center gap-2 px-6 py-2 text-lg font-medium border-2 border-blue-500 text-blue-800 rounded-lg transition-all duration-300 hover:bg-blue-500 hover:text-white active:scale-95">
          <span>Complete Your Profile</span>
          <BsPuzzle size={25} />
        </button>
          <h2 className="font-medium text-lg mt-5">Today&apos;s Quote</h2>
          <div className="mt-2">
            <h3 className="font-semibold">{quote?.quote}</h3>
            <p className="text-right italic text-sm">{quote?.author}</p>
          </div>
        </div>
      </div>
    </>
  );
}
