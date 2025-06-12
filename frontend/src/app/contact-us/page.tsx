// src/app/contact/page.tsx
"use client";

import useCheckTokenExpiry from "@/hooks/useCheckTokenExpiry";
import { useEffect } from "react";

export default function ContactPage() {

  // Check for Token Expiry & Logout
  useCheckTokenExpiry();
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 px-4 py-20 flex flex-col items-center justify-start">
      <div className="bg-white max-w-3xl w-full p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Contact Us</h1>
        <p className="text-gray-700 text-lg mb-4">
          We'd love to hear from you! Whether it's feedback, support, or just saying hi—feel free to drop us a message.
        </p>
        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-gray-700 font-medium mb-1">Name</label>
            <input
              type="text"
              id="name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              id="email"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-gray-700 font-medium mb-1">Message</label>
            <textarea
              id="message"
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your message..."
            />
          </div>
          <button type="submit" className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition cursor-pointer">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
