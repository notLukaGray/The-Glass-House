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

const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 10 * 60 * 1000;

function getClientKey(
  credentials: Record<string, unknown> | undefined,
  req: {
    headers?: Record<string, string>;
    socket?: { remoteAddress?: string };
  },
) {
  const username = credentials?.username || "unknown_username";
  const ip =
    req?.headers?.["x-forwarded-for"]?.split(",")[0] ||
    req?.socket?.remoteAddress ||
    "unknown_ip";
  return `${username}:${ip}`;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials, req) {
        try {
          const key = getClientKey(credentials, req);
          const now = Date.now();
          const attempt = loginAttempts.get(key);

          if (attempt && now - attempt.lastAttempt < WINDOW_MS) {
            if (attempt.count >= MAX_ATTEMPTS) {
              console.warn(`Rate limit exceeded for ${key}`);
              throw new Error(
                "Too many login attempts. Please try again later.",
              );
            }
            loginAttempts.set(key, {
              count: attempt.count + 1,
              lastAttempt: now,
            });
          } else {
            loginAttempts.set(key, { count: 1, lastAttempt: now });
          }

          const user = await validateUserCredentials(
            credentials?.username as string,
            credentials?.password as string,
          );

          if (user) {
            loginAttempts.delete(key);
            return {
              ...user,
              id: user.id,
            } as User;
          }

          console.warn(
            `Invalid credentials for username: ${credentials?.username}`,
          );
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
};
