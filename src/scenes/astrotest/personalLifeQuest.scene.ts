import { Markup, Scenes } from 'telegraf';
import CustomContext from '../../interfaces/custom.context';

const personalLifeQuestScene = new Scenes.BaseScene<CustomContext>('personalLife');

personalLifeQuestScene.enter(async (ctx) => {
    await ctx.replyWithHTML(
        'Ты хотела бы узнать как наладить личную жизнь?',
        Markup.keyboard(['Да', 'Нет', 'Вернуться в главное меню'], { columns: 2 }).resize().oneTime()
    );
});

personalLifeQuestScene.on('text', async (ctx) => {
    const userText = ctx.message.text;
    if (userText === 'Да') {
        // Предлагаем услуги
        await ctx.replyWithHTML(
            'Тебе подойдет консультация Отношения и личная жизнь из раздела Астроконсультации.',
            Markup.keyboard(['Вернуться в главное меню']).resize().oneTime()
        );
    } else if (userText === 'Нет') {
        // Переходим в сцену с вопросом о предназначении
        await ctx.scene.enter('destinyQuestScene');
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

export { personalLifeQuestScene };