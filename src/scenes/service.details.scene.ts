import { Markup, Scenes } from 'telegraf';
import CustomContext from '../interfaces/custom.context';
import { prisma } from '../prisma/client';
import { Cart, Service } from '@prisma/client';

const serviceDetailsScene = new Scenes.BaseScene<CustomContext>('serviceDetails');

serviceDetailsScene.enter(async (ctx) => {
    const userId = ctx.from?.id;
    const currentSession = await prisma.session.findUnique({ where: { userId } });
    const serviceId = Number(currentSession?.currentServiceId);
    const service = await prisma.service.findFirst({
        where: {
            id: serviceId
        }
    });
    const cart: Cart | null = await prisma.cart.findFirst({ where: { userId } });
    const checkService = await prisma.serviceInCart.findFirst({
        where: {
            cartId: cart?.id,
            serviceId: service?.id
        }
    });
    const servicePrice = (service?.price)?.toLocaleString('ru-RU');
    const serviceDescription = `${service?.description} \n\n ➡️ Цена: ${servicePrice} руб.`;
    if (service && !checkService) {
        await ctx.replyWithHTML(serviceDescription, Markup.inlineKeyboard(
            [
                [Markup.button.callback('Добавить в корзину', 'ADD')],
                [Markup.button.callback('Вернуться в меню', 'MENU')]
            ]
        ));
    } else if (service && checkService) {
        await ctx.replyWithHTML(serviceDescription, Markup.inlineKeyboard(
            [
                [Markup.button.callback('Удалить из корзины', 'DEL')],
                [Markup.button.callback('Вернуться в меню', 'MENU')]
            ]
        ));
    }
});

serviceDetailsScene.action('ADD', async (ctx): Promise<void> => {
    const userId = ctx.from?.id;
    const currentSession = await prisma.session.findUnique({ where: { userId } });
    const serviceId = Number(currentSession?.currentServiceId);
    const cart: Cart | null = await prisma.cart.findFirst({ where: { userId } });
    await prisma.serviceInCart.create({
        data: {
            cart: {
                connect: { id: cart?.id }
            },
            service: {
                connect: { id: serviceId }
            }
        },
    });
    await ctx.scene.enter('services');
    await ctx.answerCbQuery();
});

serviceDetailsScene.action('DEL', async (ctx): Promise<void> => {
    const userId = ctx.from?.id;
    const currentSession = await prisma.session.findUnique({ where: { userId } });
    const serviceId = Number(currentSession?.currentServiceId);
    const cart: Cart | null = await prisma.cart.findFirst({ where: { userId } });
    const service: Service | null = await prisma.service.findFirst({
        where: {
            id: serviceId
        }
    });
    if (cart && service) {
        await prisma.serviceInCart.delete({
            where: {
                cartId_serviceId: {
                    cartId: cart.id,
                    serviceId: service.id
                }
            }
        });
    }
    await ctx.scene.enter('services');
    await ctx.answerCbQuery();
});

serviceDetailsScene.action('MENU', async (ctx): Promise<void> => {
    await ctx.scene.enter('services');
    await ctx.answerCbQuery();
});

export { serviceDetailsScene };
