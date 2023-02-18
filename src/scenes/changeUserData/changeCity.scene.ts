import { Scenes, Markup } from 'telegraf';
import CustomContext from '../../interfaces/custom.context';
import { prisma } from '../../prisma/client';

const changeCityScene = new Scenes.BaseScene<CustomContext>('changeCity');

changeCityScene.enter(async (ctx): Promise<void> => {
    await ctx.replyWithMarkdownV2(
        'Если вы хотите сменить город, отправьте его в сообщении\\. Либо нажмите "Вернуться в меню" для возврата\\.',
        Markup.inlineKeyboard([Markup.button.callback('Вернуться в меню', 'MENU')])
    );
});

changeCityScene.action('MENU', async (ctx): Promise<void> => {
    await ctx.scene.enter('categories');
    await ctx.answerCbQuery();
});

changeCityScene.on('text', async (ctx): Promise<void> => {
    const userId = ctx.from?.id;
    const newCity = ctx.update.message.text;
    await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            city: newCity
        }
    });
    await ctx.scene.enter('changeUserData');
});

export { changeCityScene };