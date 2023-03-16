import { Markup, Scenes } from 'telegraf';
import CustomContext from '../../interfaces/custom.context';

const financeQuestScene = new Scenes.BaseScene<CustomContext>('financeQuest');

financeQuestScene.enter(async (ctx) => {
    await ctx.replyWithHTML(
        'Тебя интересуют деньги и финансы?',
        Markup.keyboard(['Да', 'Нет', 'Вернуться в главное меню'], { columns: 2 }).resize().oneTime()
    );
});

financeQuestScene.on('text', async (ctx) => {
    const userText = ctx.message.text;
    if (userText === 'Да') {
        // Предлагаем услуги
        await ctx.replyWithHTML(
            'Тебе подойдет консультация <b>Деньги и финансы</b> из раздела Астроконсультации.',
            Markup.keyboard(['Вернуться в главное меню']).resize().oneTime()
        );
    } else if (userText === 'Нет') {
        // Переходим в сцену с вопросом о личной жизни
        await ctx.scene.enter('personalLife');
        await ctx.scene.leave();
    } else if (userText === 'Вернуться в главное меню') {
        await ctx.scene.enter('categories');
        await ctx.scene.leave();
    } else {
        await ctx.replyWithHTML(
            'Пожалуйста, выбери один из ответов в меню.',
            Markup.keyboard(['Да', 'Нет', 'Вернуться в главное меню'], { columns: 2 }).resize().oneTime()
        );
        await ctx.scene.leave();
    }
});

export { financeQuestScene };