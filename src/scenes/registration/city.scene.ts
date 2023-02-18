import { Scenes } from 'telegraf';
import CustomContext from '../../interfaces/custom.context';
import { prisma } from '../../prisma/client';

const cityScene = new Scenes.BaseScene<CustomContext>('city');

cityScene.enter(async (ctx): Promise<void> => {
    await ctx.reply('Пожалуйста, введите Ваш город.');
});

cityScene.on('text', async (ctx): Promise<void> => {
    const user = await prisma.user.create({
        data: {
            id: ctx.session.id,
            name: ctx.session.name,
            city: ctx.message.text
        }
    });
    await prisma.cart.create({
        data: {
            user: {
                connect: { id: user.id }
            }
        }
    });
    await prisma.session.create({
        data: {
            user: {
                connect: { id: user.id }
            }
        }
    });
    await ctx.scene.enter('categories');
});

export { cityScene };
