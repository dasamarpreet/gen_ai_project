"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";


export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams?.get("token");
  const [message, setMessage] = useState("Verifying your email...");
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    if (!token) {
      setMessage("Invalid verification link.");
      return;
    }

    axios
      .get(`${BACKEND_URL}/auth/verify-email?token=${token}`)
      .then((res) => {
        setMessage("✅ Email verified successfully. You can now login.");
      })
      .catch((err) => {
        setMessage("❌ Verification link is invalid or has expired.");
      });
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Email Verification</h1>
        <p className="text-gray-700">{message}</p>
        {message === "✅ Email verified successfully. You can now login." && 
            <p className="text-blue-700 font-bold"><a href="/login">Click here to Login!</a></p>
        }
      </div>
    </div>
  );
}
