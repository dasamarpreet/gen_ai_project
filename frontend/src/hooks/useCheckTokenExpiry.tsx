import { jwtDecode } from 'jwt-decode';
import { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { toast } from 'react-toastify';

const useCheckTokenExpiry = () => {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session && session.accessToken) {
      try {
        // Decode the JWT to get the expiration time
        const decoded = jwtDecode(session.accessToken);
        const currentTime = Date.now() / 1000; // Current time in seconds

        console.log("Token will expire at: ", (decoded.exp && new Date(decoded.exp * 1000).toLocaleString()));

        // Check if the token is expired
        if (decoded.exp && (decoded.exp < currentTime)) {
          // Token expired, log the user out
          toast.error("Your Token expired! Login again.");
          signOut({ callbackUrl: '/login' });
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [session]);

  return { status };
};

export default useCheckTokenExpiry;
