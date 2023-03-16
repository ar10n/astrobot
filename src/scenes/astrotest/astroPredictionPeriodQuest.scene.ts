import { Scenes, Markup } from 'telegraf';
import CustomContext from '../../interfaces/custom.context';

const astroPredictionPeriodQuestScene = new Scenes.BaseScene<CustomContext>('astroPredictionPeriodQuest');

astroPredictionPeriodQuestScene.enter(async (ctx) => {
    await ctx.replyWithHTML(
        'На какой период ты хочешь получить Астропрогноз?',
        Markup.keyboard(['Полгода', 'Год', 'Вернуться в главное меню'], { columns: 2 }).resize().oneTime()
    );
});

astroPredictionPeriodQuestScene.on('text', async (ctx) => {
    const userText = ctx.message.text;
    if (userText === 'Полгода') {
        // Предлагаем астропрогноз на полгода
        await ctx.replyWithHTML(
            'Тебе подойдет <b>Астропрогноз на полгода</b> из раздела Астроконсультации.',
            Markup.keyboard(['Вернуться в главное меню']).resize().oneTime()
        );
    } else if (userText === 'Год') {
        // Предлагаем астропрогноз на год и соляры
        await ctx.replyWithHTML('Тебе подойдут следующие консультации:');
        await ctx.replyWithHTML('1️⃣ Астропрогноз на год');
        await ctx.replyWithHTML('2️⃣ Соляр СТАНДАРТ');
        await ctx.replyWithHTML('3️⃣ Соляр ПРО');
        await ctx.replyWithHTML(
            'Указанные выше консультации находятся в разделе Астроконсультации.',
            Markup.keyboard(['Вернуться в главное меню']).resize().oneTime()
        );
    } else if (userText === 'Вернуться в главное меню') {
        await ctx.scene.enter('categories');
        await ctx.scene.leave();
    } else {
        await ctx.replyWithHTML(
            'Пожалуйста, выбери один из ответов в меню.',
            Markup.keyboard(['Полгода', 'Год', 'Вернуться в главное меню'], { columns: 2 }).resize().oneTime()
        );
        await ctx.scene.leave();
    }
});

export { astroPredictionPeriodQuestScene };