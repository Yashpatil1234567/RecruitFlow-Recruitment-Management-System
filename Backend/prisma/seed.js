const bcrypt = require("bcrypt");
const prisma = require("../src/config/prisma");

const seed = async () => {
    const passwordHash = await bcrypt.hash("password", 10);

    await prisma.user.upsert({
        where: {
            email: "hr@demo.com"
        },
        update: {
            name: "HR Recruiter",
            passwordHash,
            role: "HR",
            active: true
        },
        create: {
            name: "HR Recruiter",
            email: "hr@demo.com",
            passwordHash,
            role: "HR",
            active: true
        }
    });

    await prisma.user.upsert({
        where: {
            email: "interviewer@demo.com"
        },
        update: {
            name: "Technical Interviewer",
            passwordHash,
            role: "INTERVIEWER",
            active: true
        },
        create: {
            name: "Technical Interviewer",
            email: "interviewer@demo.com",
            passwordHash,
            role: "INTERVIEWER",
            active: true
        }
    });

    console.log("Demo users created successfully");
};

seed()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });