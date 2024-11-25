import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const created = await prisma.user.create({
    data: {
      name: "Administrador",
      email: "admin@admin.com",
      password_hash: await bcrypt.hash("admin@123", 12),
    },
  });

  console.log("Administrator created", created);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
