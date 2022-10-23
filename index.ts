import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Telegraf } from 'telegraf';

const prisma = new PrismaClient();

class App {
    async init() {
        await prisma.$connect();
    }
}

const app = new App();
app.init();

const token: string | undefined = process.env.TOKEN;
if (!token) {
    throw new Error('Не задан токен.');
}

const bot = new Telegraf(token);

bot.command('start', (ctx) => {
    ctx.replyWithMarkdownV2('Добро пожаловать в *АстроБот*\\!');
});

bot.launch();