import { Scenes, Markup } from 'telegraf';
import CustomContext from '../../interfaces/custom.context';
import { Cart, Service } from '@prisma/client';
import { prisma } from '../../prisma/client';

const cartScene = new Scenes.BaseScene<CustomContext>('cart');

cartScene.enter(async (ctx) => {
    const userId = ctx.from?.id;
    const cart = await prisma.cart.findUnique({
        where: { userId },
        include: {
            services: {
                include: { service: true }
            }
        }
    });
    const services = (cart?.services)?.map(item => item.service);
    let cartPrice = 0;
    const servicesInCart = [];
    if (services && services.length > 0) {
        servicesInCart.push(await ctx.replyWithMarkdownV2('Ваша корзина:'));
        for (const service of services) {
            if (service.name && service.price) {
                cartPrice += service.price;
                servicesInCart.push(
                    ctx.replyWithMarkdownV2(
                        `${service.name}\\: ${service.price} руб\\.`,
                        Markup.inlineKeyboard([
                            Markup.button.callback('Удалить из корзины', `SERV_${service.id}`)
                        ])
                    )
                );
            }
        }
        await ctx.replyWithMarkdownV2(
            `Общая стоимость: ${cartPrice} руб\\.`,
            Markup.keyboard(
                ['Вернуться в меню', 'Отправить запрос на покупку'],
                { columns: 2 }).resize().oneTime()
        );
    } else {
        await ctx.replyWithMarkdownV2(
            'Ваша корзина пока пуста\\.',
            Markup.keyboard(
                ['Вернуться в меню']).resize().oneTime()
        );
    }
});

cartScene.hears('Вернуться в меню', async (ctx) => {
    await ctx.scene.enter('categories');
    await ctx.scene.leave();
});

cartScene.hears('Отправить запрос на покупку', async (ctx) => {
    await ctx.scene.enter('buy');
    await ctx.scene.leave();
});

cartScene.action(/SERV_./, async (ctx) => {
    const userId = ctx.from?.id;
    const serviceId = Number(ctx.callbackQuery.data?.slice(5));
    const cart: Cart | null = await prisma.cart.findFirst({
        where: {
            userId
        }
    });
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
    await ctx.scene.enter('cart');
    await ctx.answerCbQuery();
});

export { cartScene };