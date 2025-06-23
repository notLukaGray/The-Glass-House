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

// User management
export async function createUser(
  userData: CreateUserData,
): Promise<UserWithoutPassword> {
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

export async function getAllUsers(): Promise<UserWithoutPassword[]> {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return users;
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

export async function deleteUser(userId: string): Promise<void> {
  await prisma.user.delete({
    where: { id: userId },
  });
}

// Database management utilities
export async function deleteAllUsers(): Promise<void> {
  await prisma.user.deleteMany();
}

export async function getUsersCount(): Promise<number> {
  return prisma.user.count();
}

export async function createDefaultAdmin(): Promise<UserWithoutPassword> {
  const defaultAdmin = {
    email: "admin@example.com",
    username: "admin",
    name: "Default Admin",
    password: "admin123",
    role: "admin" as const,
  };

  return createUser(defaultAdmin);
}

export async function ensureDefaultAdmin(): Promise<{
  created: boolean;
  user: UserWithoutPassword;
  message: string;
}> {
  const userCount = await getUsersCount();

  if (userCount === 0) {
    // No users exist, create default admin
    const admin = await createDefaultAdmin();
    return {
      created: true,
      user: admin,
      message: `Default admin created with credentials:\nUsername: admin\nPassword: admin123\n\nPlease change the password after first login.`,
    };
  } else {
    // Check if admin user exists
    const admin = await findUserByUsernameOrEmail("admin");
    if (admin && admin.role === "admin") {
      return {
        created: false,
        user: admin,
        message:
          "Admin user already exists. Use existing credentials to login.",
      };
    } else {
      // Create admin user
      const newAdmin = await createDefaultAdmin();
      return {
        created: true,
        user: newAdmin,
        message: `Admin user created with credentials:\nUsername: admin\nPassword: admin123\n\nPlease change the password after first login.`,
      };
    }
  }
}

// Cleanup
export async function disconnect(): Promise<void> {
  await prisma.$disconnect();
}
