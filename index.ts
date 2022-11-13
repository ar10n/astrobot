import 'dotenv/config';
import { Markup, Scenes, Telegraf } from 'telegraf';
import LocalSession from 'telegraf-session-local';
import CustomContext from './interfaces/custom.context';
import { prisma } from './prisma/client';
import { categoriesScene, emailScene, nameScene } from './scenes/scenes';

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

const stage = new Scenes.Stage<CustomContext>([nameScene, emailScene, categoriesScene]);

bot.use(new LocalSession).middleware();
bot.use(stage.middleware());

bot.hears('Подробнее', ctx => ctx.reply('Здесь будут подробности'));
bot.hears('Начать', ctx => ctx.scene.enter('name'));

bot.command('start', (ctx) => {
    if (!ctx.session.name && !ctx.session.email) {
        ctx.replyWithMarkdownV2(
            'Добро пожаловать в *АстроБот*\\!',
            Markup.keyboard([
                ['Подробнее', 'Начать']
            ]).oneTime().resize()
        );
    }
    ctx.scene.enter('categories');
});

bot.launch();
