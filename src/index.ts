import 'dotenv/config';
import { Markup, Scenes, Telegraf } from 'telegraf';
import LocalSession from 'telegraf-session-local';
import CustomContext from './interfaces/custom.context';
import { prisma } from './prisma/client';
import { categoriesScene, emailScene, nameScene, servicesScene } from './scenes/scenes';

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

const bot = new Telegraf<CustomContext>(token);
const stage = new Scenes.Stage<CustomContext>([categoriesScene, emailScene, nameScene, servicesScene]);

bot.use(new LocalSession).middleware();
bot.use(stage.middleware());

bot.action('DESC', (ctx) => {
    ctx.deleteMessage();
    ctx.reply('Подробности о боте.', Markup.inlineKeyboard(
        [Markup.button.callback('Зарегистрироваться', 'REG')]
    ));
    ctx.answerCbQuery();
});

bot.action('REG', (ctx) => {
    ctx.deleteMessage();
    ctx.scene.enter('name');
    ctx.answerCbQuery();
});

bot.command('start', (ctx) => {
    if (!ctx.session.name && !ctx.session.email) {
        ctx.deleteMessage();
        ctx.replyWithMarkdownV2(
            'Добро пожаловать в *АстроБот*\\!',
            Markup.inlineKeyboard([
                [Markup.button.callback('Подробнее', 'DESC')],
                [Markup.button.callback('Зарегистрироваться', 'REG')]
            ]),
        );
    } else {
        ctx.scene.enter('categories');
    }
});

bot.launch();
