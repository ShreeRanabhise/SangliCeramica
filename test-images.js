import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const images = await prisma.productImage.findMany({ take: 5 });
  console.log(images);
}

main().catch(console.error).finally(() => prisma.$disconnect());
