// src/app/about/page.tsx
"use client";

import useCheckTokenExpiry from "@/hooks/useCheckTokenExpiry";

export default function AboutPage() {

  // Check for Token Expiry & Logout
  useCheckTokenExpiry();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 px-4 py-20 flex flex-col items-center justify-start">
      <div className="bg-white max-w-3xl w-full p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">About</h1>
        <p className="text-gray-700 text-lg mb-4">
          PromptAce is a smart and responsive AI assistant platform designed to facilitate real-time conversations, assist with general queries, and deliver seamless user interaction. It’s crafted with a clean, chat-first interface that prioritizes usability and responsiveness.
        </p>
        <p className="text-gray-700 text-lg mb-4">
          This application combines the performance of a FastAPI backend with the modern capabilities of a Next.js frontend, enabling efficient processing, secure sessions, and interactive features like Socket.IO messaging and JWT-based logic.
        </p>
        <p className="text-gray-700 text-lg mb-4">
          Whether you're here for a quick answer, casual conversation, or to explore how AI can enhance daily tasks—PromptAce adapts naturally to your intent, without requiring any external APIs.
        </p>
        <p className="text-gray-700 text-lg">
          The goal is simple: to create a lightweight, fast, and privacy-respecting assistant that just works—built entirely from the ground up by one developer, for everyday users like you.
        </p>
      </div>
    </div>
  );
}
