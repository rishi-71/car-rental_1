import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  // 1. Extend the User type
  interface User {
    id: string;
    role: string;
  }

  // 2. Extend the Session type
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  // 3. Extend the JWT type
  interface JWT {
    id: string;
    role: string;
  }
}