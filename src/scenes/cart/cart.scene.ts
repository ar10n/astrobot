import { Scenes, Markup } from 'telegraf';
import CustomContext from '../../interfaces/custom.context';
import { prisma } from '../../prisma/client';
import { Cart, Service } from '@prisma/client';
import nodemailer from 'nodemailer';
import 'dotenv/config';

const cartScene = new Scenes.BaseScene<CustomContext>('cart');

const nodemailerCredentials = {
    host: process.env.NODEMAILER_HOST,
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
    from: process.env.NODEMAILER_FROM,
    to: process.env.NODEMAILER_TO
};

const transporter = nodemailer.createTransport({
    host: nodemailerCredentials.host,
    port: 465,
    secure: true,
    auth: {
        user: nodemailerCredentials.user,
        pass: nodemailerCredentials.pass
    }
});

cartScene.enter(async (ctx): Promise<void> => {
    const userId = ctx.from?.id;
    const cart = await prisma.cart.findUnique({
        where: {
            userId
        },
        include: {
            services: {
                include: {
                    service: true
                }
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
        for (const service of servicesInCart) {
            await service;
        }
        await ctx.replyWithMarkdownV2(
            `Общая стоимость: ${cartPrice} руб\\.`,
            Markup.inlineKeyboard([
                Markup.button.callback('Вернуться в меню', 'MENU'),
                Markup.button.callback('Отправить запрос на покупку', 'BUY')
            ])
        );
    } else {
        await ctx.replyWithMarkdownV2(
            'Ваша корзина пока пуста\\.',
            Markup.inlineKeyboard([Markup.button.callback('Вернуться в меню', 'MENU')])
        );
    }
});

cartScene.action(/SERV_./, async (ctx): Promise<void> => {
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

cartScene.action('MENU', async (ctx): Promise<void> => {
    await ctx.scene.enter('categories');
    await ctx.answerCbQuery();
});

cartScene.action('BUY', async (ctx): Promise<void> => {
    await transporter.sendMail({
        from: nodemailerCredentials.from,
        to: nodemailerCredentials.to,
        subject: 'Новый заказ от Астробота',
        text: 'Тестовый заказ'
    });
    await ctx.scene.enter('categories');
    await ctx.answerCbQuery();
});

export { cartScene };