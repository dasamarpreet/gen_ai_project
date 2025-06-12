"use client";

import useCheckTokenExpiry from "@/hooks/useCheckTokenExpiry";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";


export default function ChatThreadPage() {
  const params = useParams();
  const thread_id = (params?.thread_id || "") as string;

  const [messages, setMessages] = useState([
    { role: "user", text: "Hello!" },
    { role: "bot", text: "Hi there! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");

  useCheckTokenExpiry();

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { role: "user", text: input };
    const botReply = { role: "bot", text: "(Simulated response)" };
    setMessages([...messages, userMsg, botReply]);
    setInput("");
  };

  return (
    <div
      className="flex min-h-screen bg-cover bg-center"
      style={{
        // backgroundImage: "url('/images/chatbg.jpg')", // Correct path from the public folder
        backgroundColor: "gray",
        backgroundSize: 'cover', // Ensures image covers the container
        backgroundPosition: 'center', // Keeps it centered
        backgroundRepeat: 'no-repeat', // Prevents the image from repeating
      }}
    >
      <main className="flex-1 flex flex-col p-6 bg-opacity-40">
        <h2 className="text-2xl font-bold text-white mb-4">
          Chat History - {thread_id}
        </h2>
        <div className="flex-1 overflow-y-auto space-y-4 mb-6">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`max-w-lg px-4 py-2 rounded-lg text-white ${
                msg.role === "user"
                  ? "bg-gradient-to-r from-red-500 to-pink-500 self-end ml-auto"
                  : "bg-opacity-60 bg-gray-800 self-start mr-auto"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>
        <form onSubmit={handleSend} className="flex gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
          />
          <button
            type="submit"
            className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600 cursor-pointer"
          >
            Send
          </button>
        </form>
      </main>
    </div>
  );
}
