"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setToken } from "@/app/redux/userSlice";

export default function VerifyOtp() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const router = useRouter()
  const dispatch = useDispatch()

  // Load email from session storage
  useEffect(() => {
    const storedEmail = sessionStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      console.warn("Email not found in sessionStorage");
    }
  }, []);

  // Handle OTP input change
  const handleOtpChange = (value, index) => {
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value.slice(0, 1); // Ensure only one digit is allowed
      setOtp(newOtp);

      // Automatically focus the next input if a value is entered
      if (value && index < otp.length - 1) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  // Handle OTP submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalOtp = otp.join(""); // Combine all OTP digits into a string

    if (finalOtp.length !== 6) {
      cons0le.log("Please enter all 6 digits of the OTP.");
      return;
    }

    console.log(finalOtp);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/verify-otp`,
        { email, otp: finalOtp },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast(response.data.message || "Success");
        sessionStorage.setItem("email", email);
        dispatch(setToken(response.data.token));
        localStorage.setItem("token", response.data.token);
        router.push(`/${email}`)
      } else {
        toast.error("Failed to verify OTP.");
        console.log("Failed to verify OTP.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred.");
      console.log("An error occurred.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <p>
        Enter the <b>OTP</b> sent to your email "<b>{email}</b>".{" "}
        <b>To Verify!</b>
      </p>
      <div className="bg-[rgba(66,89,67,1)] text-white rounded-t-lg mt-2 shadow-lg px-10 py-4 w-full max-w-md min-w-[26rem] relative">
        <form className="grid gap-4 mt-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label htmlFor="otp">Enter OTP</label>
            <div className="flex items-center gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  id={`otp-${index}`}
                  maxLength={1}
                  placeholder="0"
                  value={digit}
                  className="w-11 bg-[#0a0a0aa8] text-md border border-green-900 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-green-400 text-center"
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  onKeyDown={(e) => {
                    // Handle backspace navigation
                    if (e.key === "Backspace" && !digit && index > 0) {
                      document.getElementById(`otp-${index - 1}`).focus();
                    }
                  }}
                  required
                />
              ))}
            </div>
          </div>
          <div>
            <div className="flex float-end mt-4 mr-5">
              <button
                type="submit"
                className="font-semibold px-4 py-2 text-sm bg-blue-500 rounded-lg hover:bg-blue-600 focus:ring focus:ring-blue-500"
              >
                Verify OTP
              </button>
            </div>
          </div>
        </form>
      </div>
      <div className="bg-green-900 w-[28rem] max-h-0.5 h-0.5 "></div>
    </div>
  );
}
