"use client";

import useCheckTokenExpiry from "@/hooks/useCheckTokenExpiry";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { ClipLoader, HashLoader } from "react-spinners";
import { toast } from "react-toastify";


interface ChatMessages {
  role: String,
  text: String,
  query?: String,
  response?: String,
  created_at?: string;
};

export default function ChatThreadPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const token = session?.accessToken;
  const fullThreadId = (params?.thread_id || "") as string;
  const thread_id = fullThreadId.replace("thread-", "");  // getting only thread_id integer part

  const [messages, setMessages] = useState<ChatMessages[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);


  useCheckTokenExpiry();

  useEffect(() => {
    const chatDiv = chatContainerRef.current;
    if (!chatDiv) return;

    const handleScroll = () => {
      const bottomThreshold = 100;
      const isBottom =
        chatDiv.scrollHeight - chatDiv.scrollTop - chatDiv.clientHeight < bottomThreshold;
      setShowScrollToBottom(!isBottom);
    };

    chatDiv.addEventListener("scroll", handleScroll);
    return () => chatDiv.removeEventListener("scroll", handleScroll);
  }, []);


  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(()=> {
    if (status == "loading"){
      return;
    }

    fetchHistory();
  }, [session, thread_id]);

  const fetchHistory = async () => {
    setLoading(true);
    
    if(!thread_id){
      toast.error("Thread id not found!");
      router.push('/');
      return;
    }

    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/chat-history/${thread_id}`, 
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        },
      );

      const historyData  = res.data;

      // Convert API response into message format
      const formattedMessages = historyData.flatMap((entry: ChatMessages) => [
        { role: "user", text: entry.query, created_at: entry.created_at },
        { role: "bot", text: entry.response, created_at: entry.created_at },
      ]);

      setMessages(formattedMessages);

    } catch (error) {
      toast.error("Unable to get chat history!");
      console.log("Error fetching hsitory: ", error);
    } finally {
      setLoading(false);
    }
  };

  // const handleSend = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!input.trim()) return;
  //   const userMsg = { role: "user", text: input };
  //   const botReply = { role: "bot", text: "(Simulated response)" };
  //   setMessages([...messages, userMsg, botReply]);
  //   setInput("");
  // };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    // 1. Optimistically append user message and temporary bot placeholder
    const newUserMessage = { role: "user", text: trimmedInput };
    const botPlaceholder = { role: "bot", text: "Thinking..." };

    setMessages((prev) => [...prev, newUserMessage, botPlaceholder]);
    setInput("");

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/continue-chat`,
        {
          thread_id: parseInt(thread_id),
          query: trimmedInput,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { new_response } = res.data;

      // 2. Replace the last bot placeholder with the actual AI response
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "bot", text: new_response };
        return updated;
      });

    } catch (error) {
      console.error("Error sending message: ", error);
      toast.error("Failed to send message!");

      // 3. Replace placeholder with an error message
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "bot", text: "Error fetching response." };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    {(status === "loading" || loading) ?
      (
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-100 to-gray-300">
          <HashLoader color="#3182ce" size={40} />
        </div>

      ) : (

        <div
          className="flex min-h-screen bg-gray-100 bg-cover bg-center bg-no-repeat"
        >
            <main className="flex-1 flex flex-col p-6 bg-opacity-40">
              <h2 className="text-2xl font-bold text-black mb-4">
                Chat History
              </h2>
              <div
                className="flex-1 space-y-4 mb-6 overflow-y-auto relative"
                style={{ maxHeight: "70vh" }}
                ref={chatContainerRef}
              >
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`max-w-lg px-4 py-2 rounded-lg ${
                      msg.role === "user"
                        ? "bg-gradient-to-r text-black from-red-500 to-pink-500 self-end ml-auto"
                        : "bg-opacity-60 text-white bg-gray-800 self-start mr-auto"
                    }`}
                  >
                    {msg.text}
                    {msg.created_at && (
                      <p className="text-xs text-gray-300 mt-1 text-right">
                        {new Date(msg.created_at).toLocaleString(undefined, {
                          hour: 'numeric',
                          minute: 'numeric',
                          hour12: true,
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <form onSubmit={handleSend} className="flex gap-4">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                  placeholder="Type a message..."
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600 cursor-pointer"
                >
                  {loading ? <ClipLoader size={8} color="#fff" /> : "Send"}
                </button>
              </form>
            </main>

            {showScrollToBottom && (
              <button
                onClick={() => {
                  chatContainerRef.current?.scrollTo({
                    top: chatContainerRef.current.scrollHeight,
                    behavior: 'smooth',
                  });
                }}
                className="fixed bottom-24 right-8 px-4 py-2 bg-blue-600 text-white rounded shadow-md hover:bg-blue-700 transition z-50"
              >
                Scroll to Latest
              </button>
            )}

          </div>
      )    
    }
  </>
  );
}
