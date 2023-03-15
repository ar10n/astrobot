import { Markup, Scenes } from 'telegraf';
import CustomContext from '../../interfaces/custom.context';

const selfRealizationQuestScene = new Scenes.BaseScene<CustomContext>('selfRealizationQuest');

selfRealizationQuestScene.enter(async (ctx) => {
    await ctx.replyWithHTML(
        'Ты хотела бы достичь вершины своей самореализации?',
        Markup.keyboard(['Да', 'Нет', 'Вернуться в главное меню'], { columns: 2 }).resize().oneTime()
    );
});

selfRealizationQuestScene.on('text', async (ctx) => {
    const userText = ctx.message.text;
    if (userText === 'Да') {
        // Предлагаем услуги
        await ctx.replyWithHTML(
            'Тебе подойдет Карьера и самореализация из раздела Астроконсультации.',
            Markup.keyboard(['Вернуться в главное меню']).resize().oneTime()
        );
    } else if (userText === 'Нет') {
        // Переходим в сцену с вопросом о финансах
        await ctx.scene.enter('financeQuestScene');
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

export { selfRealizationQuestScene };