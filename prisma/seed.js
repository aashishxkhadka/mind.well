const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const superAdmin = [
    {
      name: 'Super Admin',
      role: "SUPERADMIN",
      email: 'supermind@gmail.com',
      password: 'Aashish@123',
    },
    {
      name: 'Infomax College',
      role: "ADMIN",
      email: 'wellmin@gmail.com',
      password: 'Aashish@123',
    },
  ];

  for (const admin of superAdmin) {
    const hashedPassword = await bcrypt.hash(admin.password, 10);
    const existingAdmin = await prisma.admin.findUnique({
      where: { email: admin.email },
    });
    if (existingAdmin) {
      console.log(`Admin already exists: ${admin.email}`);
      continue;
    }

    const createdAdmin = await prisma.admin.create({
      data: {
        name: admin.name,
        email: admin.email,
        password: hashedPassword,
        role: admin.role,
      },
    });
    console.log(`Created admin: ${createdAdmin.email}`);
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });