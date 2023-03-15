import { Scenes, Markup } from 'telegraf';
import CustomContext from '../../interfaces/custom.context';

const onceOrManyQuestScene = new Scenes.BaseScene<CustomContext>('onceOrManyQuest');

onceOrManyQuestScene.enter(async (ctx) => {
    await ctx.replyWithHTML(
        'Тебе необходима только разовая консультация?',
        Markup.keyboard(['Да', 'Нет', 'Вернуться в главное меню'], { columns: 2 }).resize().oneTime()
    );
});

onceOrManyQuestScene.on('text', async (ctx) => {
    const userText = ctx.message.text;
    if (userText === 'Да') {
        // Переходим в сцену с вопросом об астропрогнозе
        await ctx.scene.enter('astroPredictionQuest');
        await ctx.scene.leave();
    } else if (userText === 'Нет') {
        // Предлагаем приобрести абонемент
        await ctx.replyWithHTML(
            'Тебе подойдет Абонемент из раздела Астроконсультации.',
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

export { onceOrManyQuestScene };