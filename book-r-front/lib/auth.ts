import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "./db";

const adminId = ['6681baf3edaf2e8a771432a2']; // Array of admin IDs

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google, Resend],
  adapter: MongoDBAdapter(clientPromise),
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
  },
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    session: async ({ session, token, user }) => {
      // Check if user is admin based on user.id
      if (adminId.includes(session?.user?.id)) {
        return { ...session, isAdmin: true };
      } else {
        return { ...session, isAdmin: false };
      }
    },
  },
});
