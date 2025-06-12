"use client";

import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import SessionRedirect from "@/components/SessionRedirect";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";


export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    mobile: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${BACKEND_URL}/auth/register`, formData);
      console.log("Registration success:", res.data);

      // Redirect or show success message here
      toast.success("Registration successful! Please check your email.");
      setTimeout(() => {
        router.push("/login");
      }, 2500);
    } catch (err: any) {
      const msg =
        err.response?.data?.detail ||
        "Registration failed. Please try again.";

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
            Sign Up
          </h1>

          {/* Email Field */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Username + Mobile in same row */}
          <div className="mb-4 flex gap-4">
            <div className="w-1/2">
              <label htmlFor="username" className="block text-gray-700 font-medium mb-1">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900"
                placeholder="Enter username"
                required
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="mobile" className="block text-gray-700 font-medium mb-1">
                Mobile
              </label>
              <input
                id="mobile"
                name="mobile"
                type="text"
                value={formData.mobile}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900"
                placeholder="Enter mobile"
                required
              />
            </div>
          </div>

          {/* Password + Confirm Password in same row */}
          <div className="mb-6 flex gap-4">
            <div className="w-1/2">
              <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900"
                placeholder="Enter password"
                required
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900"
                placeholder="Confirm password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gray-700 text-white font-semibold py-2 rounded-lg hover:bg-gray-600 transition cursor-pointer"
            disabled={loading}
          >
            {loading ? <ClipLoader color="#0dcaf0" size={20} /> : "Register"}
          </button>

          <p className="text-center text-gray-700 font-medium mt-4">
            Already registered?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </SessionRedirect>
  );
}
