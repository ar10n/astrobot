import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    await prisma.$connect();
    await prisma.category.createMany({
        data: [
            { name: 'Категория 1' },
            { name: 'Категория 2' },
            { name: 'Категория 3' }
        ]
    });
    await prisma.service.createMany({
        data: [
            { name: 'Тестовая услуга 1', description: 'Тестовое описание 1', categoryId: 1 },
            { name: 'Тестовая услуга 2', description: 'Тестовое описание 2', categoryId: 1 },
            { name: 'Тестовая услуга 3', description: 'Тестовое описание 3', categoryId: 2 },
            { name: 'Тестовая услуга 4', description: 'Тестовое описание 4', categoryId: 2 },
            { name: 'Тестовая услуга 5', description: 'Тестовое описание 5', categoryId: 3 },
            { name: 'Тестовая услуга 6', description: 'Тестовое описание 6', categoryId: 3 }
        ]
    });
    await prisma.$disconnect();
}

main();