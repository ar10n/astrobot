import { Markup, Scenes } from 'telegraf';
import CustomContext from '../interfaces/custom.context';
import { prisma } from '../prisma/client';
import fs from 'fs';

const dir = './src/img';

const categoryDetailsScene = new Scenes.BaseScene<CustomContext>('categoryDetails');

categoryDetailsScene.enter(async (ctx) => {
    const userId = ctx.from?.id;
    const currentSession = await prisma.session.findUnique({ where: { userId } });
    const categoryId = currentSession?.currentCategoryId;
    if (categoryId) {
        const category = await prisma.category.findUnique({ where: { id: categoryId } });
        if (category?.name === 'Отзывы') {
            const files = fs.readdirSync(dir);
            const photoIndex = Math.floor(Math.random() * files.length + 1);
            await ctx.replyWithPhoto({ source: dir + '/' + files[photoIndex] },
                Markup.keyboard(['Следующий отзыв', 'Назад']).resize().oneTime());
        } else {
            const services = await prisma.service.findMany({
                where: { categoryId }
            });
            await ctx.reply(`${category?.name}`,
                Markup.keyboard(['Назад']).resize().oneTime());
            for (const service of services) {
                await ctx.reply(`${service.name}`);
            }
        }
    }
});

categoryDetailsScene.command('start', async (ctx) => {
    await ctx.scene.enter('categories');
    await ctx.scene.leave();
});

categoryDetailsScene.command('cart', async (ctx) => {
    await ctx.scene.enter('cart');
    await ctx.scene.leave();
});

categoryDetailsScene.hears('Следующий отзыв', async (ctx) => {
    const files = fs.readdirSync(dir);
    const photoIndex = Math.floor(Math.random() * files.length + 1);
    await ctx.replyWithPhoto({ source: dir + '/' + files[photoIndex] },
        Markup.keyboard(['Следующий отзыв', 'Назад']).resize().oneTime());
});

categoryDetailsScene.hears('Назад', async (ctx) => {
    await ctx.scene.enter('categories');
});

export { categoryDetailsScene };