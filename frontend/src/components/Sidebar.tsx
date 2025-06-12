"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import clsx from "clsx";
import axios from "axios";
import { useSession } from "next-auth/react";
import { ClipLoader } from "react-spinners";

interface Thread {
  id: string;
  title: string;
  timestamp: string;
}

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [threads, setThreads] = useState<Thread[]>([]);
  const pageRef = useRef(1);
  const loadingRef = useRef(false);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Function to fetch chat history
  const fetchChatHistory = async () => {
  if (!session?.accessToken || loadingRef.current) return;

  loadingRef.current = true;
  setLoading(true); // Optional: just for UI spinner

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/user-histories?page=${pageRef.current}&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    const newThreads = response.data.histories.map((history: any) => ({
      id: `thread-${history.thread_id}`,
      title: history.query,
      timestamp: new Date(history.created_at).toLocaleString(),
    }));

    if (newThreads.length === 0) {
      setHasMore(false);
      return;
    }

    setThreads((prevThreads) => {
      const existingIds = new Set(prevThreads.map((t) => t.id));
      const uniqueNew = newThreads.filter((t: Thread) => !existingIds.has(t.id));
      return [...prevThreads, ...uniqueNew];
    });

    setHasMore(response.data.total > pageRef.current * 10);
    pageRef.current += 1; // INCREMENT AFTER SUCCESSFUL LOAD
  } catch (error) {
    console.error("Error fetching chat history:", error);
  } finally {
    loadingRef.current = false;
    setLoading(false);
  }
};

  // Infinite scroll event listener
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const atBottom = target.scrollTop + target.clientHeight >= target.scrollHeight - 5;
    if (atBottom && hasMore) {
      fetchChatHistory();
    }
  };

  useEffect(() => {
    if (pageRef.current === 1 && threads.length === 0) {
      fetchChatHistory();
    }
  }, [session]);

  return (
    <div className="w-64 bg-white shadow-lg h-screen px-4 py-6 flex flex-col">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Chat History</h2>
      <ScrollArea
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto space-y-2"
      >
        {threads.map((thread) => (
          <Link
            key={thread.id}
            href={`/c/${thread.id}`}
            className={clsx(
              "block p-3 rounded-lg border hover:bg-gray-100 transition",
              pathname?.includes(thread.id)
                ? "bg-blue-100 border-blue-500 text-blue-800"
                : "border-gray-200 text-gray-700"
            )}
          >
            <div className="font-medium truncate">{thread.title}</div>
            <div className="text-xs text-gray-500">{thread.timestamp}</div>
          </Link>
        ))}

        {loading && (
          <div className="text-center mt-4">
            <ClipLoader color="#0dcaf0" size={40} />
          </div>
        )}

        {!hasMore && (
          <div className="text-center mt-4">
            <span className="text-gray-500">That's all!</span>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
