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
    } else if (category && !(category.payable)) {
        await prisma.session.update({
            where: { userId },
            data: { currentCategoryId: category?.id }
        });
        await ctx.scene.enter('categoryDetails');
    } else if (categoryName === 'Корзина') {
        await ctx.scene.enter('cart');
    } else {
        ctx.reply('Пожалуйста, выберите раздел из меню.');
        await ctx.scene.enter('categories');
    }
});

export { categoriesScene };