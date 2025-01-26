"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import Avatar from "../Components/helpers/Avatar";
import { useSelector } from "react-redux";

export default function UserSideBaar({ onClose }) {
  const [quote, setQuote] = useState();

  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );
  const user = useSelector((state) => state?.user);

  async function getQuote() {
    try {
      const response = await fetch("https://dummyjson.com/quotes/random");
      const data = await response.json();
      console.log("quote", data);
      setQuote(data);
    } catch (error) {
      toast("Error");
    }
  }
  useEffect(() => {
    getQuote();
  }, []);

  return (
    <>
      <div>
        <div className=" w-fit h-fit fixed rounded-xl bg-slate-200 right-1/4 mt-60 max-w-96 z-10">
          <div className="p-4 rounded w-full max-w-sm flex gap-5">
            <Avatar
              imageUrl={user?.profile_pic}
              width={110}
              height={110}
              name={user?.name}
            />
            <h1 className="font-bold text-2xl flex justify-center items-center">{user.name}</h1>
          </div>
          <div className="p-2">
            <h2 className="font-medium text-lg">Today&apos;s Quote</h2>
            <div className="font-semibold" >
            <h3>{quote && quote.quote}</h3>
            <p className="ml-64  italic">"{quote && quote.author}"</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
