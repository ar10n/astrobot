import { Scenes, Markup } from 'telegraf';
import CustomContext from '../../interfaces/custom.context';
import { prisma } from '../../prisma/client';

const changeNameScene = new Scenes.BaseScene<CustomContext>('changeName');

changeNameScene.enter(async (ctx): Promise<void> => {
    await ctx.replyWithMarkdownV2(
        'Если вы хотите сменить имя, отправьте его в сообщении\\. Либо нажмите "Вернуться в меню" для возврата\\.',
        Markup.inlineKeyboard([Markup.button.callback('Вернуться в меню', 'MENU')])
    );
});

changeNameScene.action('MENU', async (ctx): Promise<void> => {
    await ctx.scene.enter('categories');
    await ctx.answerCbQuery();
});

changeNameScene.on('text', async (ctx): Promise<void> => {
    const userId = ctx.from?.id;
    const newName = ctx.update.message.text;
    await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            name: newName
        }
    });
    await ctx.scene.enter('changeUserData');
});

export { changeNameScene };