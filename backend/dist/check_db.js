"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const serviceCount = await prisma.service.count();
    const staffCount = await prisma.staff.count();
    const activeServiceCount = await prisma.service.count({ where: { isActive: true } });
    const activeStaffCount = await prisma.staff.count({ where: { isActive: true } });
    console.log(`Total Services: ${serviceCount}`);
    console.log(`Active Services: ${activeServiceCount}`);
    console.log(`Total Staff: ${staffCount}`);
    console.log(`Active Staff: ${activeStaffCount}`);
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=check_db.js.map