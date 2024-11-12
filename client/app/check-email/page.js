'use client'

import Link from "next/link";
import React,{ useState } from "react";
import { BiRightArrowAlt } from "react-icons/bi";
import axios from "axios";
import toast from 'react-hot-toast';
import { useRouter} from "next/navigation";
import { FaUserCircle } from "react-icons/fa";


export default function CheckEmail() {
    const [data, setData] = useState({
        email: "",
      });

      const router = useRouter()
 
        
      const onHandleChange = (e) => {
        const { name, value } = e.target;
    
        setData((prevs) => {
          return {
            ...prevs,
            [name]: value,
          };
        });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/email`;
      
        try {
          const response = await axios.post(URL, data);      
          if (response.data.success) {
            setData({
              email: "",
            });
            toast.success(response.data.message);
            sessionStorage.setItem('email', data.email);            
            router.push('/check-password');
          } 
        } catch (error) {
          toast.error(error?.response?.data?.message);
        }
      
        console.log('data', data);
    }
    return (
        <>
          <div className="mt-5 grid justify-center">
            <div className="bg-white max-w-lg rounded mx-2 overflow-hidden p-4">

               <center> <div>
                    <FaUserCircle
                        size={70}
                    />
                </div></center>

              <h3>Welcome to Infinity Chat!</h3>
    
              <form className="grid gap-4 mt-3" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    className="bg-slate-50 px-2 py-1 focus:outline-primary overflow-hidden"
                    value={data.email}
                    onChange={onHandleChange}
                    required
                  />
                </div>
                <center>
                  <button className="bg-primary px-4 py-1 hover:bg-secondry text-white w-1/2 tracking-wide leading-relaxed rounded-md mt-2 font-bold">
                   Lets Go
                  </button>
                </center>
              </form>
              <p className="text-red-600 mt-3 ml-11 flex ">
                New User?{" "}
                <Link className="text-blue-800 ml-2 flex font-bold" href="/register">
                  Register
                  <BiRightArrowAlt className="mt-[0.3rem] font-bold" />
                </Link>
              </p>
            </div>
          </div>
        </>
      );
}