import bcrypt from "bcryptjs";

const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();

export interface User {
  id: string;
  name: string;
  username: string;
  password: string;
  role: string;
  createdAt: Date;
  lastLogin?: Date;
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

export async function comparePassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

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

export function resetRateLimit(username: string): void {
  loginAttempts.delete(username);
}

export function sanitizeUser(user: User): Omit<User, "password"> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _password, ...userWithoutPass } = user;
  return userWithoutPass;
}

export function generateSessionId(): string {
  return crypto.randomUUID();
}

export function cleanupRateLimits(maxAgeMs: number = 60 * 60 * 1000): void {
  const now = Date.now();
  for (const [username, attempts] of loginAttempts.entries()) {
    if (now - attempts.lastAttempt > maxAgeMs) {
      loginAttempts.delete(username);
    }
  }
}
