import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.username || !credentials.password) {
            throw new Error("Missing username or password");
        }

        try {
          const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
            username: credentials.username,
            password: credentials.password,
          });

          const user = response.data;

          if (user && user.token) {
            return {
              id: user.user_id,
              name: user.username,
              email: user.email,
              mobile: user.mobile,
              token: user.token,
            };
          }

          throw new Error("Login failed");
        } catch (error) {
          // Custom error from FastAPI
          if (axios.isAxiosError(error) && error.response?.data?.detail) {
            throw new Error(error.response.data.detail);
          }
          throw new Error("Something went wrong");
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
        if (user) {
        token.accessToken = user.token ?? "";
        token.name = user.name ?? "";
        token.email = user.email ?? "";
        token.mobile = user.mobile ?? "";
        }
        return token;
    },
    async session({ session, token }) {
        session.accessToken = token.accessToken; // no error
        if (session.user) {
            session.user.name = token.name ?? "";
            session.user.email = token.email ?? "";
            session.user.mobile = token.mobile ?? "";
        }
        return session;
    },
  },

  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
