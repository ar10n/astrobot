import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Context, Markup, Scenes, Telegraf } from 'telegraf';
import LocalSession from 'telegraf-session-local';

const { leave, enter } = Scenes.Stage;

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

interface CustomSession extends Scenes.SceneSession {
    name: string;
    email: string;
}

interface CustomContext extends Context {
    session: CustomSession;
    scene: Scenes.SceneContextScene<CustomContext>;
}

const bot = new Telegraf<CustomContext>(token);

const nameScene = new Scenes.BaseScene<CustomContext>('name');
nameScene.enter((ctx) => ctx.reply('Пожалуйста, представьтесь.'));
nameScene.on("text", (ctx) => {
    ctx.session.name = ctx.message.text;
    ctx.scene.enter('email');
});

const emailScene = new Scenes.BaseScene<CustomContext>('email');
emailScene.enter((ctx) => ctx.reply('Пожалуйста, введите email.'));
emailScene.leave((ctx, next) => {
    next();
});
emailScene.on("text", (ctx) => {
    ctx.session.email = ctx.message.text;
    ctx.reply(`Спасибо, ${ctx.session.name}!`);
    ctx.scene.leave();
});

const categoriesScene = new Scenes.BaseScene<CustomContext>('categories');
categoriesScene.enter(async (ctx) => {
    const categories = await prisma.category.findMany();
    const categoriesNames: string[] = categories.map(category => category.name);
    ctx.reply('Список разделов.', Markup.keyboard([categoriesNames]).oneTime().resize());
});
categoriesScene.leave((ctx, next) => {
    next();
});
categoriesScene.command("leave", (ctx) => {
    ctx.scene.leave();
});

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
