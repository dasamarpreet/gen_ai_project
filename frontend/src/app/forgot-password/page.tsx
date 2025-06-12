"use client";

import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import SessionRedirect from "@/components/SessionRedirect";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { useRouter } from "next/navigation";


export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${BACKEND_URL}/auth/forgot-password`, {
        email,
      });
      toast.success("Password reset link sent to your email.");
      setTimeout(()=>{
        router.push("/login");
      }, 2500);
    } catch (err: any) {
        const msg = err.response?.data?.detail || "Failed to send reset email. Try again.";
        toast.error(msg);
    } finally {
        setLoading(false);
    }
  };

  return (
    <SessionRedirect redirectIfAuthenticated={true}>
        <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-gray-100 to-gray-300 px-4 py-20">
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8"
        >
            <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
            Forgot Password
            </h1>

            <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
            Email Address
            </label>
            <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900"
            placeholder="you@example.com"
            required
            />

            <button
            type="submit"
            className="w-full bg-gray-700 text-white font-semibold py-2 rounded-lg hover:bg-gray-600 transition cursor-pointer"
            >
                {loading ?  <ClipLoader color="#0dcaf0" size={20} /> : "Send Reset Link"}
            </button>

            <p className="text-center text-gray-700 font-medium mt-4 flex justify-center items-center gap-1">
                <Link href="/login" className="text-blue-600 hover:underline flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to login
                </Link>
            </p>

        </form>
        </div>
    </SessionRedirect>
  );
}
