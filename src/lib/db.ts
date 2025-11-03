// `db.ts` re-exports the singleton from `prisma.ts` to keep existing imports working
import prisma from './prisma';
export default prisma;
export { prisma };
