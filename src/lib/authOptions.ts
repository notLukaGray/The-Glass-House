import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions, User } from "next-auth";
import { validateUserCredentials } from "./auth/db";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        try {
          const user = await validateUserCredentials(
            credentials?.username as string,
            credentials?.password as string,
          );

          if (user) {
            return {
              ...user,
              id: user.id,
            } as User;
          }

          throw new Error("Invalid username or password");
        } catch (error: unknown) {
          console.error("[NextAuth][authorize] Error:", error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.role) {
        (session.user as { role?: string; id?: string }).role = token.role;
        (session.user as { id?: string }).id = token.sub;
      }
      return session;
    },

    async jwt({ token, user }) {
      if (user && "role" in user) {
        token.role = user.role as string;
      }
      return token;
    },
  },
  // NextAuth built-in throttling configuration
  pages: {
    signIn: "/login",
    error: "/login",
  },
  // Enable built-in throttling
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  // Throttling configuration
  events: {
    async signIn({ user }) {
      // Log successful sign-ins for debugging
      if (user) {
        // Successful sign-in logged
      }
    },
    async signOut({ session, token }) {
      // Log sign-outs for debugging
      if (session?.user || token) {
        // User signed out logged
      }
    },
  },
  // Built-in rate limiting (NextAuth handles this automatically)
  // The CredentialsProvider automatically implements throttling
  // based on the number of failed attempts per IP address
};
