import { Markup, Scenes } from 'telegraf';
import CustomContext from '../../interfaces/custom.context';

const starCardQuestScene = new Scenes.BaseScene<CustomContext>('starCardQuest');

starCardQuestScene.enter(async (ctx) => {
    await ctx.replyWithHTML(
        'Ты получала расшифровку своей звёздной карты?',
        Markup.keyboard(['Да', 'Нет', 'Вернуться в главное меню'], { columns: 2 }).resize().oneTime()
    );
});

starCardQuestScene.on('text', async (ctx) => {
    const userText = ctx.message.text;
    if (userText === 'Да') {
        // Переходим в сцену с вопросом о самореализации
        await ctx.scene.enter('selfRealizationQuestScene');
        await ctx.scene.leave();
    } else if (userText === 'Нет') {
        // Предлагаем услуги
        await ctx.replyWithHTML('Тебе подойдут: ');
        await ctx.replyWithHTML('1️⃣ Разбор натальной карты');
        await ctx.replyWithHTML('1️⃣ Разбор ядра личности');
        await ctx.replyWithHTML(
            'Вышеперечисленные консультации находятся в разделе Астроконсультации.',
            Markup.keyboard(['Вернуться в главное меню']).resize().oneTime()
        );
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

export { starCardQuestScene };