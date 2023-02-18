import { Scenes, Markup } from 'telegraf';
import CustomContext from '../../interfaces/custom.context';

const changeUserDataScene = new Scenes.BaseScene<CustomContext>('changeUserData');

changeUserDataScene.enter(async (ctx) => {
    await ctx.replyWithMarkdownV2(
        'Какие данные вы хотите изменить?',
        Markup.inlineKeyboard([
            Markup.button.callback('Имя', 'NAME'),
            Markup.button.callback('Город', 'CITY'),
            Markup.button.callback('Вернуться в меню', 'MENU')
        ])
    );
});

changeUserDataScene.action('NAME', async (ctx): Promise<void> => {
    await ctx.scene.enter('changeName');
    await ctx.answerCbQuery();
});

changeUserDataScene.action('CITY', async (ctx): Promise<void> => {
    await ctx.scene.enter('changeCity');
    await ctx.answerCbQuery();
});

changeUserDataScene.action('MENU', async (ctx): Promise<void> => {
    await ctx.scene.enter('categories');
    await ctx.answerCbQuery();
});

export { changeUserDataScene };