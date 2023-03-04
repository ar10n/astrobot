import { Markup, Scenes } from 'telegraf';
import CustomContext from '../interfaces/custom.context';
import { prisma } from '../prisma/client';

const payableServiceDetailsScene = new Scenes.BaseScene<CustomContext>('payableServiceDetails');

let serviceId: number;

payableServiceDetailsScene.enter(async (ctx) => {
    const userId = ctx.from?.id;
    const currentSession = await prisma.session.findUnique({ where: { userId } });
    serviceId = Number(currentSession?.currentServiceId);
    const service = await prisma.service.findFirst({ where: { id: serviceId } });
    const cart = await prisma.cart.findFirst({ where: { userId } });
    const checkService = await prisma.serviceInCart.findFirst({
        where: {
            cartId: cart?.id,
            serviceId: service?.id
        }
    });
    const servicePrice = (service?.price)?.toLocaleString('ru-RU');
    const serviceDescription = `${service?.description} \n\n ➡️ Цена: ${servicePrice} руб.`;
    if (service && !checkService) {
        await ctx.replyWithHTML(serviceDescription, Markup.keyboard(
            ['Добавить в корзину', 'Назад'], { columns: 2 }
        ).resize().oneTime());
    } else if (service && checkService) {
        await ctx.replyWithHTML(serviceDescription, Markup.keyboard(
            ['Удалить из корзины', 'Назад'], { columns: 2 }
        ).resize().oneTime());
    }
});

payableServiceDetailsScene.command('start', async (ctx) => {
    await ctx.scene.enter('categories');
    await ctx.scene.leave();
});

payableServiceDetailsScene.command('cart', async (ctx) => {
    await ctx.scene.enter('cart');
    await ctx.scene.leave();
});

payableServiceDetailsScene.hears('Добавить в корзину', async (ctx) => {
    const userId = ctx.from.id;
    const service = await prisma.service.findFirst({ where: { id: serviceId } });
    const cart = await prisma.cart.findFirst({ where: { userId } });
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
    await ctx.reply(`Добавлено в корзину: ${service?.name}.`);
    await ctx.scene.enter('services');
});

payableServiceDetailsScene.hears('Удалить из корзины', async (ctx) => {
    const userId = ctx.from.id;
    const service = await prisma.service.findFirst({ where: { id: serviceId } });
    const cart = await prisma.cart.findFirst({ where: { userId } });
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
    await ctx.reply(`Удалено из корзины: ${service?.name}.`);
    await ctx.scene.enter('services');
});

payableServiceDetailsScene.hears('Назад', async (ctx) => {
    await ctx.scene.enter('services');
});

export { payableServiceDetailsScene };