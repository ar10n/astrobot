import { Scenes, Markup } from 'telegraf';
import CustomContext from '../../interfaces/custom.context';

const astroPredictionQuestScene = new Scenes.BaseScene<CustomContext>('astroPredictionQuest');

astroPredictionQuestScene.enter(async (ctx) => {
    await ctx.replyWithHTML(
        'Тебе интересен Астропрогноз?',
        Markup.keyboard(['Да', 'Нет', 'Вернуться в главное меню'], { columns: 2 }).resize().oneTime()
    );
});

astroPredictionQuestScene.on('text', async (ctx) => {
    const userText = ctx.message.text;
    if (userText === 'Да') {
        // Переходим в сцену с вопросом о сроке астропрогноза
        await ctx.scene.enter('astroPredictionPeriodQuest');
        await ctx.scene.leave();
    } else if (userText === 'Нет') {
        // Переходим в сцену с вопросом о расшифровке звездной карты
        await ctx.scene.enter('starCardQuest');
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

export { astroPredictionQuestScene };