import { Scenes, Markup } from 'telegraf';
import CustomContext from '../interfaces/custom.context';
import { prisma } from '../prisma/client';

const categoriesScene = new Scenes.BaseScene<CustomContext>('categories');
categoriesScene.enter(async (ctx) => {
    const categories = await prisma.category.findMany();
    const categoriesNames: string[] = categories.map(category => category.name);
    ctx.reply('Список разделов.', Markup.keyboard([categoriesNames]).oneTime().resize());
});
categoriesScene.leave((ctx, next) => {
    next();
});
categoriesScene.command("leave", (ctx) => {
    ctx.scene.leave();
});

export { categoriesScene };