// components/LayoutWithSidebar.tsx
"use client";

import { useSession } from "next-auth/react";
import Sidebar from "./Sidebar";
import { HashLoader } from "react-spinners";

export default function LayoutWithSidebar({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-100 to-gray-300">
        <HashLoader color="#0dcaf0" size={40} />
    </div>
  }

  return (
    <div className="flex min-h-[calc(100vh-128px)]">
      {session?.user && <Sidebar />}
      <main className="flex-1">{children}</main>
    </div>
  );
}
