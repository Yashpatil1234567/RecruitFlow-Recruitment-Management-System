const prisma = require("./src/config/prisma");

async function checkUsers() {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            active: true
        }
    });

    console.log(users);

    await prisma.$disconnect();
}

checkUsers();