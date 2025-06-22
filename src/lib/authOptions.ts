import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions, User } from "next-auth";

interface HardcodedUser {
  id: number;
  name: string;
  username: string;
  password: string;
  role: string;
}

/**
 * NOTE ON SECURITY:
 * Storing plaintext passwords in an environment variable is highly insecure and should
 * NEVER be used in production. This is a temporary solution for local development.
 * In a real-world application, you should:
 * 1. Store hashed passwords in a database.
 * 2. Use a library like `bcrypt` to compare the provided password with the stored hash.
 */
const users: HardcodedUser[] = process.env.AUTH_USERS
  ? JSON.parse(process.env.AUTH_USERS)
  : [];

// --- In-Memory Rate Limiter ---
// This simple rate limiter helps prevent brute-force attacks by tracking login attempts
// from a specific username/IP address combination. It's not foolproof but is a
// good basic security measure. For production, a more robust solution like a
// Redis-backed store would be better.

const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5; // Max attempts per window
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Generates a unique key for rate limiting based on the user's name and IP address.
 * Using both makes it harder for an attacker to spam multiple usernames from one IP.
 * @param credentials - The credentials object from NextAuth.
 * @param req - The request object from NextAuth.
 * @returns A unique string key for the rate limiter.
 */
function getClientKey(
  credentials: Record<string, unknown> | undefined,
  req: {
    headers?: Record<string, string>;
    socket?: { remoteAddress?: string };
  },
) {
  const username = credentials?.username || "unknown_username";
  // Standard way to get the real IP address, even when behind a proxy.
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
      /**
       * The core authorization logic. It's called when a user tries to sign in.
       * @param credentials The username and password from the login form.
       * @param req The incoming request object.
       * @returns The user object if authentication is successful, otherwise null or throws an error.
       */
      async authorize(credentials, req) {
        try {
          const key = getClientKey(credentials, req);
          const now = Date.now();
          const attempt = loginAttempts.get(key);

          // If there's a recent attempt, check if the user is locked out.
          if (attempt && now - attempt.lastAttempt < WINDOW_MS) {
            if (attempt.count >= MAX_ATTEMPTS) {
              console.warn(`Rate limit exceeded for ${key}`);
              throw new Error(
                "Too many login attempts. Please try again later.",
              );
            }
            // Increment the attempt count if still within the window.
            loginAttempts.set(key, {
              count: attempt.count + 1,
              lastAttempt: now,
            });
          } else {
            // Otherwise, start a new attempt window.
            loginAttempts.set(key, { count: 1, lastAttempt: now });
          }

          // Find the user in our "database" (the environment variable array).
          const user = users.find(
            (u: HardcodedUser) =>
              u.username === credentials?.username &&
              u.password === credentials?.password,
          );

          if (user) {
            // On successful login, clear their rate limit attempts.
            loginAttempts.delete(key);

            // IMPORTANT: Never return the password in the user object.
            // Even though it's not sent to the client by default, it's a critical security practice.
            const { ...userWithoutPassword } = user;

            // The 'user' object returned here is passed to the JWT callback.
            // NextAuth expects the 'id' property to be a string.
            return {
              ...userWithoutPassword,
              id: String(user.id),
            } as User;
          }

          // If no user is found, log the failed attempt and throw an error.
          // This error message is deliberately generic to avoid telling attackers
          // whether they got the username right or wrong.
          console.warn(
            `Invalid credentials for username: ${credentials?.username}`,
          );
          throw new Error("Invalid username or password");
        } catch (error: unknown) {
          // Rethrow the specific error (e.g., from rate limiting or invalid credentials)
          // so NextAuth can send it to the client.
          console.error("[NextAuth][authorize] Error:", error);
          throw error;
        }
      },
    }),
  ],
  // Callbacks are used to control what happens after a user is authenticated.
  callbacks: {
    /**
     * The session callback is called whenever a session is checked.
     * We use it to add custom data (like the user's role) to the session object,
     * which is then available on the client.
     */
    async session({ session, token }) {
      // The token argument is the JWT that was created in the `jwt` callback.
      if (session.user && token.role) {
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
    /**
     * The JWT callback is called when a JSON Web Token is created or updated.
     * We use it to persist the user's role into the token, so it's available
     * between sessions without needing a database lookup.
     */
    async jwt({ token, user }) {
      // The `user` object is only available on the first call (after sign-in).
      // We take the role from it and add it to the token.
      if (user && "role" in user) {
        token.role = user.role as string;
      }
      // On subsequent calls, the token is returned as-is, preserving the role.
      return token;
    },
  },
};
