import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";

// NextAuth config (spec section 17/18: authentication + role-based permissions).
// TODO: add real password hashing/verification (e.g. bcrypt) and consider adding
// an OAuth provider (Google) for faster customer signup.
export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: { email: { label: "Email", type: "email" }, password: { label: "Password", type: "password" } },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        const user = await db.user.findUnique({ where: { email: credentials.email } });
        if (!user) return null;
        // TODO: verify credentials.password against user.passwordHash.
        return { id: user.id, email: user.email, name: user.name ?? undefined, role: user.role } as any;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as any).role;
      return token;
    },
    async session({ session, token }) {
      if (session.user) (session.user as any).role = token.role;
      return session;
    }
  },
  pages: { signIn: "/account" }
};
