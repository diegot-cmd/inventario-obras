import { PrismaClient } from "@prisma/client";

// Use a global variable to preserve the PrismaClient across module reloads in development
const globalAny = globalThis as unknown as { __prisma?: PrismaClient };

const prisma = globalAny.__prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalAny.__prisma = prisma;

export default prisma;
export { prisma };
