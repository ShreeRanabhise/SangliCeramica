const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    const products = await prisma.product.findMany();
    console.log("Products table exists! Found", products.length, "records.");
    const inquiries = await prisma.inquiry.findMany();
    console.log("Inquiries table exists! Found", inquiries.length, "records.");
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
