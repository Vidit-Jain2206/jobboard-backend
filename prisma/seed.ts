import prisma from "../src/utils/Db";

async function main() {
  try {
    if (
      !(await prisma.role.findUnique({
        where: {
          name: "jobseeker",
        },
      }))
    ) {
      await prisma.role.create({
        data: {
          name: "jobseeker",
        },
      });
    }
    if (
      !(await prisma.role.findUnique({
        where: {
          name: "company",
        },
      }))
    ) {
      await prisma.role.create({
        data: {
          name: "company",
        },
      });
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    await prisma.$disconnect();
    process.exit(1);
  });
