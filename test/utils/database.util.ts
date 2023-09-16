import { PrismaClient } from '@prisma/client';

async function getDbTableNames(prisma?: PrismaClient): Promise<string[]> {
  const prismaClient = prisma || new PrismaClient();

  const models = (await prismaClient.$queryRaw`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema='public'
    `) as Array<{ table_name: string }>;

  const tableNames = models.map((model) => model.table_name).filter((m) => m !== '_prisma_migrations');

  if (!prisma) await prismaClient.$disconnect();

  return tableNames;
}

export async function clearDbTables() {
  const prisma = new PrismaClient();

  const tableNames = await getDbTableNames(prisma);

  await prisma.$executeRawUnsafe(`
      TRUNCATE TABLE ${tableNames.join(', ')} RESTART IDENTITY CASCADE;
    `);

  await prisma.$disconnect();
}

export async function resetDb() {
  await clearDbTables();
}
