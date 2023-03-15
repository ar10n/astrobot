import { Scenes, Markup } from 'telegraf';
import CustomContext from '../../interfaces/custom.context';

const startTestScene = new Scenes.BaseScene<CustomContext>('startTest');

startTestScene.enter(async (ctx) => {
    await ctx.replyWithHTML('<b>Привет!</b> С помощью этого теста мы сможем определить, какие именно консультации тебе необходимы. Для этого нужно последовательно отвечать на вопросы.');
    await ctx.replyWithHTML('Итак, начнем...');
    await ctx.replyWithHTML(
        'Знаешь ли ты точное время своего рождения?',
        Markup.keyboard(['Да', 'Нет', 'Вернуться в главное меню'], { columns: 2 }).resize().oneTime()
    );
});

startTestScene.on('text', async (ctx) => {
    const userText = ctx.message.text;
    if (userText === 'Да') {
        // Переходим в сцену с вопросом о разовой консультации
        await ctx.scene.enter('onceOrManyQuest');
        await ctx.scene.leave();
    } else if (userText === 'Нет') {
        // Переходим в сцену с вопросом об онлайн формате
        await ctx.scene.enter('onlineQuest');
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

export { startTestScene };