import 'dotenv/config';
import { Markup, Scenes, Telegraf } from 'telegraf';
import CustomContext from './interfaces/custom.context';
import LocalSession from 'telegraf-session-local';
import { prisma } from './prisma/client';
import { allScenes } from './scenes/scenes';

const token: string | undefined = process.env.TOKEN;
if (!token) {
    throw new Error('Не задан токен.');
}

const bot = new Telegraf<CustomContext>(token);
const stage = new Scenes.Stage<CustomContext>(allScenes);

bot.use(new LocalSession({ storage: LocalSession.storageMemory })).middleware();
bot.use(stage.middleware());

bot.command('start', async (ctx): Promise<void> => {
    const user = await prisma.user.findUnique({ where: { id: ctx.from.id } });
    if (!user) {
        await ctx.replyWithMarkdownV2(
            'Добро пожаловать в *АстроБот*\\!',
            Markup.inlineKeyboard([
                Markup.button.callback('Подробнее', 'descriptionBtn'),
                Markup.button.callback('Зарегистрироваться', 'registerBtn')
            ]));
    } else {
        await ctx.scene.enter('categories');
    }
});

bot.action('descriptionBtn', async (ctx): Promise<void> => {
    await ctx.replyWithMarkdownV2(
        'Подробности о боте\\.',
        Markup.inlineKeyboard([
            Markup.button.callback('Зарегистрироваться', 'registerBtn')
        ])
    );
    await ctx.answerCbQuery();
});

bot.action('registerBtn', async (ctx): Promise<void> => {
    await ctx.scene.enter('name');
    await ctx.answerCbQuery();
});

bot.launch();