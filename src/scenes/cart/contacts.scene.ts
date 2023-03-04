import { Scenes, Markup } from 'telegraf';
import CustomContext from '../../interfaces/custom.context';
import { prisma } from '../../prisma/client';

const contactsScene = new Scenes.BaseScene<CustomContext>('contacts');

contactsScene.enter(async (ctx) => {
    await ctx.replyWithMarkdownV2('Пожалуйста, введите Ваш email или номер телефона\\.');
});

contactsScene.on('text', async (ctx): Promise<void> => {
    const contacts = ctx.message.text;
    const userId = ctx.from?.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (contacts.length > 0 && user) {
        await prisma.user.update({
            where: { id: user.id },
            data: { contacts }
        });
    }
    await ctx.scene.enter('buy');
    await ctx.scene.leave();
});

export { contactsScene };