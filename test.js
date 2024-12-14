import { PrismaClient } from '@prisma/client'
import express from "express";
const app = express();
const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'Test',
      email: 'test@gmail.com',
    },
  })
  console.log(user)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  });

  app.listen(1000,()=>{
    console.log(`Test Prisma`);
  })

