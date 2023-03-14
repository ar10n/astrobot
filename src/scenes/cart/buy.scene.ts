import { Scenes, Markup } from 'telegraf';
import CustomContext from '../../interfaces/custom.context';
import nodemailer from 'nodemailer';
import 'dotenv/config';
import { prisma } from '../../prisma/client';

const buyScene = new Scenes.BaseScene<CustomContext>('buy');

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

buyScene.enter(async (ctx) => {
    const userId = ctx.from?.id;
    const userName = ctx.from?.username;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user && !user.name) {
        await ctx.scene.enter('name');
        await ctx.scene.leave();
    }
    if (user && user.name && !user.contacts) {
        await ctx.scene.enter('contacts');
        await ctx.scene.leave();
    }
    if (user && user.contacts && user.name) {
        const cart = await prisma.cart.findUnique({
            where: { userId },
            include: {
                services: {
                    include: { service: true }
                }
            }
        });
        if (cart) {
            const text = (cart.services.map(item => item.service.name + ', ')).toString();
            await transporter.sendMail({
                from: nodemailerCredentials.from,
                to: nodemailerCredentials.to,
                subject: 'Новый заказ от Астробота',
                text: `
                    Заказ: ${text}
                    Имя: ${user.name},
                    Контакты: ${user.contacts},
                    TG Username: ${userName}
                `
            });

            await prisma.serviceInCart.deleteMany({ where: { cartId: cart.id } });
            await ctx.replyWithMarkdownV2('Ваш заказ отправлен\\. Астролог свяжется с Вами в самое ближайшее время\\.');
            await ctx.scene.enter('categories');
            await ctx.scene.leave();
        }
    }
});


export { buyScene };