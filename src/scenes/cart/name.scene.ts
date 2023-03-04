import { Scenes, Markup } from 'telegraf';
import CustomContext from '../../interfaces/custom.context';
import { prisma } from '../../prisma/client';

const nameScene = new Scenes.BaseScene<CustomContext>('name');

nameScene.enter(async (ctx) => {
    await ctx.replyWithMarkdownV2('Пожалуйста, представьтесь\\.');
});

nameScene.on('text', async (ctx): Promise<void> => {
    const name = ctx.message.text;
    const userId = ctx.from?.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (name.length > 0 && user) {
        await prisma.user.update({
            where: { id: user.id },
            data: { name }
        });
    }
    await ctx.scene.enter('buy');
    await ctx.scene.leave();
});

export { nameScene };