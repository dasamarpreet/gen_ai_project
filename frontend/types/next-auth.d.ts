import NextAuth, { DefaultSession, DefaultUser, DefaultJWT } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user?: {
      name?: string;
      email?: string;
      mobile: string;
    };
  }

  interface User extends DefaultUser {
    token?: string;
    name?: string;
    email?: string;
    mobile?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    accessToken?: string;
    name?: string;
    email?: string;
    mobile: string;
  }
}
