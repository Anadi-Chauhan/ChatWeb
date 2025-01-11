'use client'

import axios from "axios"
import Image from "next/image";
import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { toast } from "sonner"

export default function UserSideBaar(){

    const socketConnection = useSelector(
        (state) => state?.user?.socketConnection
      );
      const user = useSelector((state) => state?.user);


    return (
        <>
            <div>
                <div className="w-full flex justify-center items-center h-full" >
                    <Image 
                        src='./logo.svg'
                        width={100}
                        height={200}
                        alt="Logo"
                    />
                </div>
                {/* <p>{user?.name}</p> */}
            </div>
        </>
    )
}