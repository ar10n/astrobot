import { Scenes, Markup } from 'telegraf';
import CustomContext from '../interfaces/custom.context';
import { Service } from '@prisma/client';
import { prisma } from '../prisma/client';

const servicesScene = new Scenes.BaseScene<CustomContext>('services');

servicesScene.enter(async (ctx): Promise<void> => {
    const userId = ctx.from?.id;
    const currentSession = await prisma.session.findUnique({ where: { userId } });
    const categoryId = Number(currentSession?.currentCategoryId);
    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (category) {
        const services: Service[] = await prisma.service.findMany({
            where: { categoryId: category.id },
            orderBy: { id: 'asc' }
        });
        const buttons = services.map(service => [Markup.button.callback(service.name, `SERV_${service.id.toString()}`)]);
        buttons.push([Markup.button.callback('Вернуться в меню', 'MENU')]);
        await ctx.replyWithMarkdownV2(
            `Услуги раздела ${category.name}`,
            Markup.inlineKeyboard(buttons)
        );
    }
});

servicesScene.action(/SERV_./, async (ctx): Promise<void> => {
    const serviceId = Number(await ctx.callbackQuery.data?.slice(5));
    const userId = Number(await ctx.callbackQuery.from.id);
    await prisma.session.update({
        where: {
            userId
        },
        data: {
            currentServiceId: serviceId
        }
    });
    await ctx.scene.enter('serviceDetails');
    await ctx.answerCbQuery();
});

servicesScene.action('MENU', async (ctx): Promise<void> => {
    await ctx.scene.enter('categories');
    await ctx.answerCbQuery();
});

export { servicesScene };
