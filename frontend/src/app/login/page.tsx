"use client"; // This page uses client-side interactivity

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import SessionRedirect from "@/components/SessionRedirect";
import { ClipLoader } from "react-spinners";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    // Basic validation
    if (!username || !password) {
      setErrorMsg("Please fill in all fields");
      setLoading(false);
      return;
    }

    try{
      // Call your backend login API here
      const res = await signIn("credentials", {
        redirect: false,
        username: username,
        password: password,
      });

      if (res?.error) {
        setErrorMsg(res.error);
      } else {
        // Redirect to dashboard
        router.push("/dashboard");
      }
    } catch (error){
        setErrorMsg("Something went wrong");
        console.log("errorrrrrrrrr ", error);
    } finally{
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
            Login
          </h1>

          {errorMsg && (
            <div className="mb-4 text-red-600 text-sm font-medium text-center">
              {errorMsg}
            </div>
          )}

          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-700 font-medium mb-1"
            >
              Email or Username
            </label>
            <input
              id="username"
              type="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900"
              placeholder="Your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gray-700 text-white font-semibold py-2 rounded-lg hover:bg-gray-600 transition cursor-pointer"
            disabled={loading}
          >
            {loading ? <ClipLoader color="#0dcaf0" size={20} /> : "Sign In"}
          </button>
          
          <p className="text-center text-gray-700 font-medium mt-4">
            New user? <Link href="/register" className="text-blue-600 hover:underline">Register here</Link>
          </p>

          <p className="text-center text-gray-700 font-medium mt-2">
            <Link href="/forgot-password" className="text-blue-600 hover:underline">Forgot Password?</Link>
          </p>

        </form>
      </div>
    </SessionRedirect>
  );
}
