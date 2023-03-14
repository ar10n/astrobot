import { Scenes, Markup } from 'telegraf';
import CustomContext from '../interfaces/custom.context';
import { Service } from '@prisma/client';
import { prisma } from '../prisma/client';

const servicesScene = new Scenes.BaseScene<CustomContext>('services');

servicesScene.enter(async (ctx) => {
    const userId = ctx.from?.id;
    const currentSession = await prisma.session.findUnique({ where: { userId } });
    const categoryId = Number(currentSession?.currentCategoryId);
    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (category) {
        const services: Service[] = await prisma.service.findMany({
            where: { categoryId: category.id },
            orderBy: { id: 'asc' }
        });
        const buttons = services.map(service => service.name);
        await ctx.reply(
            `Услуги раздела ${category.name}`,
            Markup.keyboard([...buttons, 'Назад'], { columns: 2 }).resize().oneTime()
        );
        if (category.description) {
            await ctx.replyWithHTML(category.description);
        }
    }
});

servicesScene.command('start', async (ctx) => {
    await ctx.scene.enter('categories');
});

servicesScene.command('cart', async (ctx) => {
    await ctx.scene.enter('cart');
});

servicesScene.on('text', async (ctx) => {
    const userId = ctx.from?.id;
    const serviceName = ctx.message.text;
    const service = await prisma.service.findFirst({ where: { name: serviceName } });
    if (service) {
        await prisma.session.update({
            where: { userId },
            data: { currentServiceId: service?.id }
        });
        await ctx.scene.enter('payableServiceDetails');
    } else if (serviceName === 'Назад') {
        await ctx.scene.enter('categories');
    } else {
        ctx.reply('Пожалуйста, выберите раздел из меню.');
        await ctx.scene.enter('services');
    }
});

export { servicesScene };