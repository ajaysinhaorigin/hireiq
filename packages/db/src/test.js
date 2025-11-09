import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      email: "ajay@example.com",
      password: 'mySecurePassword123', // required field
    },
  });
  console.log(user);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
