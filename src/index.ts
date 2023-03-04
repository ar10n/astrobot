import 'dotenv/config';
import CustomContext from './interfaces/custom.context';
import LocalSession from 'telegraf-session-local';
import { allScenes } from './scenes/scenes';
import { Scenes, Telegraf } from 'telegraf';
import { prisma } from './prisma/client';

const token: string | undefined = process.env.TOKEN;
if (!token) {
    throw new Error('Не задан токен.');
}

const bot = new Telegraf<CustomContext>(token);
const stage = new Scenes.Stage<CustomContext>(allScenes);

bot.use(new LocalSession({ storage: LocalSession.storageMemory })).middleware();
bot.use(stage.middleware());

bot.command('start', async (ctx) => {
    const userId = Number(ctx.from.id);
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        const newUser = await prisma.user.create({ data: { id: userId } });
        await prisma.cart.create({ data: { user: { connect: { id: newUser.id } } } });
        await prisma.session.create({ data: { user: { connect: { id: newUser.id } } } });
    }
    await ctx.scene.enter('categories');
});

bot.command('cart', async (ctx) => {
    await ctx.scene.enter('cart');
});

bot.launch();