import { PrismaClient, Role, ReviewStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // 1. Create Admin User
  const adminEmail = 'admin@karera.ru';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: {
        name: 'Главный Администратор',
        email: adminEmail,
        passwordHash,
        role: Role.ADMIN,
      },
    });
    console.log('Admin user created');
  }

  // 2. Create Services
  const servicesData = [
    { name: 'Женская стрижка', category: 'Волосы', price: 1500, durationMinutes: 60 },
    { name: 'Мужская стрижка', category: 'Волосы', price: 1000, durationMinutes: 45 },
    { name: 'Маникюр с покрытием', category: 'Ногти', price: 2000, durationMinutes: 90 },
    { name: 'Педикюр', category: 'Ногти', price: 2500, durationMinutes: 90 },
    { name: 'Коррекция бровей', category: 'Брови/Ресницы', price: 800, durationMinutes: 30 },
    { name: 'Чистка лица', category: 'Косметология', price: 3000, durationMinutes: 90 },
  ];

  for (const s of servicesData) {
    const exists = await prisma.service.findFirst({ where: { name: s.name } });
    if (!exists) {
      await prisma.service.create({ data: s });
    }
  }
  console.log('Services seeded');

  // 3. Create Specializations & Staff
  const specsData = ['Парикмахер', 'Мастер маникюра', 'Косметолог'];
  const specsMap = new Map<string, string>();

  for (const name of specsData) {
    const s = await prisma.specialization.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    specsMap.set(name, s.id);
  }
  console.log('Specializations seeded');

  const staffData = [
    { name: 'Анна Иванова', specializationName: 'Парикмахер', description: 'Топ-стилист с 10-летним стажем.' },
    { name: 'Мария Петрова', specializationName: 'Мастер маникюра', description: 'Аккуратность и креативность.' },
    { name: 'Елена Сидорова', specializationName: 'Косметолог', description: 'Врач-дерматолог.' },
  ];

  for (const st of staffData) {
    const exists = await prisma.staff.findFirst({ where: { name: st.name } });
    if (!exists) {
      await prisma.staff.create({
        data: {
          name: st.name,
          description: st.description,
          specializationId: specsMap.get(st.specializationName),
        },
      });
    }
  }
  console.log('Staff seeded');

  // 4. Create Settings
  const settings = await prisma.setting.findFirst();
  if (!settings) {
    await prisma.setting.create({
      data: {
        contactPhone: '+7 (999) 123-45-67',
        contactAddress: 'г. Москва, ул. Красоты, д. 1',
        contactTelegram: 'karera_beauty',
        contactWhatsApp: '79991234567',
        workHoursJson: {
          mon: '10:00 - 21:00',
          tue: '10:00 - 21:00',
          wed: '10:00 - 21:00',
          thu: '10:00 - 21:00',
          fri: '10:00 - 21:00',
          sat: '11:00 - 20:00',
          sun: '11:00 - 20:00',
        },
      },
    });
    console.log('Settings seeded');
  }

  // 5. Create Reviews
  const reviewsCount = await prisma.review.count();
  if (reviewsCount === 0) {
    await prisma.review.createMany({
      data: [
        { clientName: 'Ольга', rating: 5, text: 'Прекрасный салон! Очень довольна стрижкой.', status: ReviewStatus.APPROVED },
        { clientName: 'Наталья', rating: 4, text: 'Маникюр сделали хорошо, но пришлось подождать 5 минут.', status: ReviewStatus.APPROVED },
        { clientName: 'Ирина', rating: 5, text: 'Косметолог Елена - просто волшебница!', status: ReviewStatus.APPROVED },
      ],
    });
    console.log('Reviews seeded');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
