import bcrypt from "bcryptjs";

/**
 * In-memory store for tracking login attempts.
 *
 * NOTE: This is a simple in-memory implementation suitable for development
 * and small applications. For production use, consider using Redis or a
 * similar persistent store that can handle server restarts and multiple
 * server instances.
 */
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();

/**
 * Interface representing a user in the authentication system.
 * This includes all the essential user information needed for authentication
 * and authorization purposes.
 */
export interface User {
  id: string;
  name: string;
  username: string;
  password: string;
  role: string;
  createdAt: Date;
  lastLogin?: Date;
}

/**
 * Hashes a plaintext password using bcrypt with a salt rounds of 12.
 * This is the recommended approach for securely storing passwords.
 * The salt rounds determine the computational cost of hashing.
 *
 * @param {string} password - The plaintext password to hash.
 * @returns {Promise<string>} The hashed password.
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Compares a plaintext password against a hashed password.
 * This is the secure way to verify passwords without storing them in plaintext.
 *
 * @param {string} password - The plaintext password to verify.
 * @param {string} hashedPassword - The stored hashed password.
 * @returns {Promise<boolean>} True if the password matches, false otherwise.
 */
export async function comparePassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Validates a username according to security and usability requirements.
 * Ensures the username is present, within length limits, and contains only
 * allowed characters.
 *
 * @param {string} username - The username to validate.
 * @returns {object} Object containing validation result and optional error message.
 */
export function validateUsername(username: string): {
  isValid: boolean;
  error?: string;
} {
  if (!username || username.trim().length === 0) {
    return { isValid: false, error: "Username is required" };
  }

  if (username.length < 3) {
    return { isValid: false, error: "Username must be at least 3 characters" };
  }

  if (username.length > 50) {
    return {
      isValid: false,
      error: "Username must be less than 50 characters",
    };
  }

  // Allow alphanumeric, underscores, and hyphens
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return {
      isValid: false,
      error:
        "Username can only contain letters, numbers, underscores, and hyphens",
    };
  }

  return { isValid: true };
}

/**
 * Validates a password according to security requirements.
 * Ensures the password meets minimum length requirements and contains
 * a mix of letters and numbers for better security.
 *
 * @param {string} password - The password to validate.
 * @returns {object} Object containing validation result and optional error message.
 */
export function validatePassword(password: string): {
  isValid: boolean;
  error?: string;
} {
  if (!password || password.length === 0) {
    return { isValid: false, error: "Password is required" };
  }

  if (password.length < 8) {
    return { isValid: false, error: "Password must be at least 8 characters" };
  }

  if (password.length > 128) {
    return {
      isValid: false,
      error: "Password must be less than 128 characters",
    };
  }

  // Check for at least one letter and one number
  if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
    return {
      isValid: false,
      error: "Password must contain at least one letter and one number",
    };
  }

  return { isValid: true };
}

/**
 * Checks if a user is allowed to attempt login based on rate limiting rules.
 * This prevents brute force attacks by limiting the number of login attempts
 * within a specified time window.
 *
 * @param {string} username - The username attempting to log in.
 * @param {number} maxAttempts - Maximum allowed attempts (default: 5).
 * @param {number} windowMs - Time window in milliseconds (default: 15 minutes).
 * @returns {object} Object containing whether login is allowed, remaining attempts, and reset time.
 */
export function checkRateLimit(
  username: string,
  maxAttempts: number = 5,
  windowMs: number = 15 * 60 * 1000,
): { allowed: boolean; remainingAttempts: number; resetTime?: number } {
  const now = Date.now();
  const userAttempts = loginAttempts.get(username);

  if (!userAttempts) {
    loginAttempts.set(username, { count: 1, lastAttempt: now });
    return { allowed: true, remainingAttempts: maxAttempts - 1 };
  }

  // Reset if window has passed
  if (now - userAttempts.lastAttempt > windowMs) {
    loginAttempts.set(username, { count: 1, lastAttempt: now });
    return { allowed: true, remainingAttempts: maxAttempts - 1 };
  }

  // Check if user is blocked
  if (userAttempts.count >= maxAttempts) {
    const resetTime = userAttempts.lastAttempt + windowMs;
    return {
      allowed: false,
      remainingAttempts: 0,
      resetTime,
    };
  }

  // Increment attempts
  userAttempts.count++;
  userAttempts.lastAttempt = now;
  loginAttempts.set(username, userAttempts);

  return {
    allowed: true,
    remainingAttempts: maxAttempts - userAttempts.count,
  };
}

/**
 * Resets the rate limit for a specific user.
 * This is typically called after a successful login to clear any
 * accumulated failed attempts.
 *
 * @param {string} username - The username to reset rate limiting for.
 */
export function resetRateLimit(username: string): void {
  loginAttempts.delete(username);
}

/**
 * Removes the password field from a user object for security.
 * This ensures that user objects returned to the client never contain
 * password information, even if it's hashed.
 *
 * @param {User} user - The user object to sanitize.
 * @returns {Omit<User, "password">} The user object without the password field.
 */
export function sanitizeUser(user: User): Omit<User, "password"> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _password, ...userWithoutPass } = user;
  return userWithoutPass;
}

/**
 * Generates a unique session identifier using the Web Crypto API.
 * This creates a cryptographically secure random UUID that can be used
 * as a session token or for other security purposes.
 *
 * @returns {string} A unique session identifier.
 */
export function generateSessionId(): string {
  return crypto.randomUUID();
}

/**
 * Cleans up old rate limit entries to prevent memory leaks.
 * This should be called periodically (e.g., every hour) to remove
 * entries that are older than the specified maximum age.
 *
 * @param {number} maxAgeMs - Maximum age of entries in milliseconds (default: 1 hour).
 */
export function cleanupRateLimits(maxAgeMs: number = 60 * 60 * 1000): void {
  const now = Date.now();
  for (const [username, attempts] of loginAttempts.entries()) {
    if (now - attempts.lastAttempt > maxAgeMs) {
      loginAttempts.delete(username);
    }
  }
}
