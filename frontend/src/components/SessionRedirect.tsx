"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ClipLoader, HashLoader } from "react-spinners";

interface Props {
  children: React.ReactNode;
  redirectIfAuthenticated?: boolean;
  redirectTo?: string;
}

export default function SessionRedirect({
  children,
  redirectIfAuthenticated,
  redirectTo = "/dashboard",
}: Props) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (redirectIfAuthenticated && session) {
      router.replace(redirectTo);
    }

    if (!redirectIfAuthenticated && !session) {
      router.replace("/login");
    }
  }, [status, session, redirectIfAuthenticated, redirectTo, router]);

  const isRedirecting = status === "loading" ||
  (redirectIfAuthenticated && session) ||
  (!redirectIfAuthenticated && !session);


  if (isRedirecting) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-100 to-gray-300">
        <HashLoader color="#0dcaf0" size={40} />
      </div>
    );
  }

  return <>{children}</>;
}
