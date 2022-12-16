import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


interface Category {
    name: string;
}

interface Service {
    name: string;
    description: string;
    categoryId: number;
}

const createCategories = (num: number): Category[] => {
    const arr: Category[] = [];
    for (let i = 1; i <= num; i++) {
        arr.push({ name: `Категория ${i}` });
    }
    return arr;
}

const createServices = (num: number): Service[] => {
    const arr: Service[] = [];
    for (let i = 1; i <= num; i++) {
        arr.push({ name: `Тестовая услуга ${i}`, description: `Тестовое описание ${i}`, categoryId: 1 });
    }
    return arr;
}

async function main() {
    await prisma.$connect();
    await prisma.category.createMany({
        data: createCategories(3)
    });
    await prisma.service.createMany({
        data: createServices(5)
    });
    await prisma.$disconnect();
}

main();