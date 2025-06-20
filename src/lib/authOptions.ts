import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";

interface HardcodedUser {
  id: number;
  name: string;
  username: string;
  password: string;
  role: string;
}

// Get users from environment variable (JSON string)
const users: HardcodedUser[] = process.env.AUTH_USERS ? JSON.parse(process.env.AUTH_USERS) : [];

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const user = users.find(
          (u: HardcodedUser) => u.username === credentials?.username && u.password === credentials?.password
        );
        if (user) {
          // Don't return password! Ensure id is a string for NextAuth compatibility
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password, ...userWithoutPass } = user;
          return { ...userWithoutPass, id: String(user.id) };
        }
        return null;
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.role) {
        (session.user as Record<string, unknown>).role = token.role;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user && 'role' in user) token.role = (user as Record<string, unknown>).role;
      return token;
    }
  }
}; 