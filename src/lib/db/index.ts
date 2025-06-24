import { PrismaClient } from "@/generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Types
export interface CreateUserData {
  email: string;
  username: string;
  name: string;
  password: string;
  role?: string;
}

export interface UserWithoutPassword {
  id: string;
  email: string;
  username: string;
  name: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

// Password utilities
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

export function validatePassword(password: string): {
  isValid: boolean;
  error?: string;
} {
  if (password.length < 8) {
    return {
      isValid: false,
      error: "Password must be at least 8 characters long",
    };
  }

  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      error: "Password must contain at least one uppercase letter",
    };
  }

  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      error: "Password must contain at least one lowercase letter",
    };
  }

  if (!/\d/.test(password)) {
    return {
      isValid: false,
      error: "Password must contain at least one number",
    };
  }

  return { isValid: true };
}

// User management
export async function createUser(
  userData: CreateUserData,
): Promise<UserWithoutPassword> {
  // Validate password strength
  const passwordValidation = validatePassword(userData.password);
  if (!passwordValidation.isValid) {
    throw new Error(`Password validation failed: ${passwordValidation.error}`);
  }

  const hashedPassword = await hashPassword(userData.password);

  const user = await prisma.user.create({
    data: {
      email: userData.email,
      username: userData.username,
      name: userData.name,
      password: hashedPassword,
      role: userData.role || "user",
    },
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
}

export async function findUserByUsernameOrEmail(
  identifier: string,
): Promise<(UserWithoutPassword & { password: string }) | null> {
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ username: identifier }, { email: identifier }],
    },
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      password: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) return null;

  return user as UserWithoutPassword & { password: string };
}

export async function validateUserCredentials(
  identifier: string,
  password: string,
): Promise<UserWithoutPassword | null> {
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ username: identifier }, { email: identifier }],
    },
  });

  if (!user) return null;

  const isValidPassword = await comparePassword(password, user.password);
  if (!isValidPassword) return null;

  // Return user without password
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: removedPassword, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export async function updateUserPassword(
  userId: string,
  newPassword: string,
): Promise<void> {
  // Validate password strength
  const passwordValidation = validatePassword(newPassword);
  if (!passwordValidation.isValid) {
    throw new Error(`Password validation failed: ${passwordValidation.error}`);
  }

  const hashedPassword = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });
}

export async function checkUserExists(identifier: string): Promise<boolean> {
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ username: identifier }, { email: identifier }],
    },
    select: { id: true },
  });

  return !!user;
}

export async function updateUserRole(
  userId: string,
  newRole: string,
): Promise<UserWithoutPassword> {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
}

export async function isSetupComplete(): Promise<boolean> {
  const adminCount = await prisma.user.count({
    where: { role: "admin" },
  });
  return adminCount > 0;
}

export async function createDefaultAdmin(): Promise<UserWithoutPassword> {
  const defaultAdmin = {
    email: "admin@example.com",
    username: "admin",
    name: "Default Admin",
    password: "Admin123!",
    role: "admin" as const,
  };

  return createUser(defaultAdmin);
}

export async function ensureDefaultAdmin(): Promise<{
  created: boolean;
  user: UserWithoutPassword;
  message: string;
}> {
  const setupComplete = await isSetupComplete();

  if (setupComplete) {
    const existingAdmin = await prisma.user.findFirst({
      where: { role: "admin" },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      created: false,
      user: existingAdmin!,
      message: "Admin user already exists",
    };
  }

  try {
    const admin = await createDefaultAdmin();
    return {
      created: true,
      user: admin,
      message: "Default admin user created successfully",
    };
  } catch (error) {
    throw new Error(`Failed to create default admin: ${error}`);
  }
}

export async function disconnect(): Promise<void> {
  await prisma.$disconnect();
}
