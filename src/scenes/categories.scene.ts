import { Scenes, Markup } from 'telegraf';
import CustomContext from '../interfaces/custom.context';
import { prisma } from '../prisma/client';
import { Category } from '@prisma/client';

const categoriesScene = new Scenes.BaseScene<CustomContext>('categories');

categoriesScene.enter(async (ctx): Promise<void> => {
    const categories: Category[] = await prisma.category.findMany({ orderBy: { id: 'asc' } });
    const categoriesButtons = categories.map(category => [Markup.button.callback(
        category.name,
        `CAT_${category.id.toString()}`
    )]);
    categoriesButtons.push([Markup.button.callback('Корзина', 'CART')]);
    categoriesButtons.push([Markup.button.callback('Изменить данные', 'USERDATA')]);
    await ctx.replyWithMarkdownV2(
        'Список доступных разделов\\.',
        Markup.inlineKeyboard(categoriesButtons)
    );
});

categoriesScene.action(/CAT_./, async (ctx): Promise<void> => {
    const categoryId = Number(await ctx.callbackQuery.data?.slice(4));
    const userId = Number(await ctx.callbackQuery.from.id);
    await prisma.session.update({
        where: {
            userId: userId
        },
        data: {
            currentCategoryId: categoryId
        }
    });
    await ctx.scene.enter('services');
    await ctx.answerCbQuery();
});

categoriesScene.action('CART', async (ctx): Promise<void> => {
    await ctx.scene.enter('cart');
    await ctx.answerCbQuery();
});

categoriesScene.action('USERDATA', async (ctx): Promise<void> => {
    await ctx.scene.enter('changeUserData');
    await ctx.answerCbQuery();
});

export { categoriesScene };
