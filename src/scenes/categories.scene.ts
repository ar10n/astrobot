import { Scenes, Markup } from 'telegraf';
import CustomContext from '../interfaces/custom.context';
import { Category } from '@prisma/client';
import { prisma } from '../prisma/client';

const categoriesScene = new Scenes.BaseScene<CustomContext>('categories');

categoriesScene.enter(async (ctx) => {
    const categories: Category[] = await prisma.category.findMany({ orderBy: { id: 'asc' } });
    const buttons = categories.map(category => category.name);
    await ctx.reply(
        'Список доступных разделов.',
        Markup.keyboard([...buttons], { columns: 2 }).resize().oneTime()
    );
});

categoriesScene.command('cart', async (ctx) => {
    await ctx.scene.enter('cart');
    await ctx.scene.leave();
});

categoriesScene.on('text', async (ctx) => {
    const userId = ctx.from.id;
    const categoryName = ctx.message.text;
    const category = await prisma.category.findFirst({ where: { name: categoryName } });
    if (category && category.payable) {
        await prisma.session.update({
            where: { userId },
            data: { currentCategoryId: category?.id }
        });
        await ctx.scene.enter('services');
        await ctx.scene.leave();
    } else if (category && category.name === 'АстроТЕСТ') {
        await ctx.scene.enter('startTest');
        await ctx.scene.leave();
    } else if (category && !(category.payable)) {
        await prisma.session.update({
            where: { userId },
            data: { currentCategoryId: category?.id }
        });
        await ctx.scene.enter('categoryDetails');
        await ctx.scene.leave();
    } else if (categoryName === 'Корзина') {
        await ctx.scene.enter('cart');
        await ctx.scene.leave();
    } else {
        ctx.reply('Пожалуйста, выберите раздел из меню.');
        await ctx.scene.enter('categories');
        await ctx.scene.leave();
    }
});

export { categoriesScene };