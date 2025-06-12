"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token");
  const email = searchParams?.get("email");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !email) {
      toast.error("Invalid or expired link.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${BACKEND_URL}/auth/reset-password`, {
        token,
        email,
        new_password: newPassword,
      });

      toast.success("Password reset successful. You can now log in.");
      setTimeout(() => router.push("/login"), 2500);
    } catch (err: any) {
        const msg = err.response?.data?.detail || "Reset failed. Try again.";
        toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-gray-100 to-gray-300 px-4 py-20">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8"
      >
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Reset Password
        </h1>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <input
            type="email"
            value={email || ""}
            disabled
            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 text-gray-900"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900"
            placeholder="Enter new password"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-1">
            Confirm New Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900"
            placeholder="Confirm new password"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gray-700 text-white font-semibold py-2 rounded-lg hover:bg-gray-600 transition cursor-pointer"
          disabled={loading}
        >
          {loading ? <ClipLoader color="#0dcaf0" size={20} /> : "Reset Password"}
        </button>

        <p className="text-center text-gray-700 font-medium mt-4">
          Remembered your password?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
}
