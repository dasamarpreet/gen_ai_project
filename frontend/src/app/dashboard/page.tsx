// app/dashboard/page.tsx
"use client";

// import Sidebar from "@/components/Sidebar";
import SessionRedirect from "@/components/SessionRedirect";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import useCheckTokenExpiry from "@/hooks/useCheckTokenExpiry";


export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState<string>("");

  const token = session?.accessToken;

  // Check for Token Expiry & Logout
  useCheckTokenExpiry();

  useEffect(() => {
    const now = new Date();
    const hours = now.getHours();

    let greeting = "";
    if (hours >= 0 && hours < 12) {
      greeting = "Good morning!";
    } else if (hours >= 12 && hours < 18) {
      greeting = "Good afternoon!";
    } else {
      greeting = "Good evening!";
    }

    const fullMessage = `${greeting} How can I help you today?`;

    let index = 0;
    let currentMessage = "";

    const typingEffect = setInterval(() => {
      if (index < fullMessage.length) {
        currentMessage += fullMessage[index];
        setMessage(currentMessage);
        index++;
      } else {
        clearInterval(typingEffect);
      }
    }, 100);

    return () => clearInterval(typingEffect);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      toast.error("Enter a query!");
      return;
    };
    // const threadId = `thread-${Date.now()}`;
    // router.push(`/c/${threadId}`);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/new-query`, 
        { query: query},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        },
      );

      const new_thread = response.data;
      const thread_id = new_thread.thread_id;
      const ai_response = new_thread.ai_response;
      if (new_thread && new_thread.message) {
        toast.success("New Thread Created!");
        console.log("api response threadid, ai_response ", thread_id, ai_response);

        setTimeout(() => {
          router.push(`/c/${thread_id}`);
        }, 2000);
      }

      // throw new Error("Query Submission Fail!");
    } catch (error) {
      // Custom error from FastAPI
      if (axios.isAxiosError(error) && error.response?.data?.detail) {
        toast.error(error.response.data.detail);
        throw new Error(error.response.data.detail);
      } else{
        console.log('hereeeeeeeeeeee ', error);
        toast.error("Something went wrong");
        throw new Error("Something went wrong");
      }
    }

  };


  return (
    <SessionRedirect redirectIfAuthenticated={false}>
      <div className="flex min-h-screen">
        {/* <Sidebar /> */}
        <main className="flex-1 p-10 bg-gradient-to-br from-gray-100 to-gray-300">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              <span className="typewriter-text">{message}</span>
            </h1>
            <form
              onSubmit={handleSearch}
              className="flex gap-4 justify-center items-center"
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask something..."
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 cursor-pointer"
              >
                Submit
              </button>
            </form>
          </div>
        </main>
      </div>
    </SessionRedirect>
  );
}
