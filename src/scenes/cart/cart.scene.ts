import { Scenes, Markup } from 'telegraf';
import CustomContext from '../../interfaces/custom.context';
import { prisma } from '../../prisma/client';

const cartScene = new Scenes.BaseScene<CustomContext>('cart');

cartScene.enter(async (ctx): Promise<void> => {
    const userId = ctx.from?.id;
    const cart = await prisma.cart.findUnique({ where: { userId } });

});

export { cartScene };